import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { asyncHandler } from '../utils/errorHandler';
import { User } from '../models/User.model';
import { Auth } from '../models/Auth.model';
import { School } from '../models/school.model';
import { Volunteer } from '../models/volunteer.model';
import config from '../config/env';
import { logger } from '../utils/logger';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService';

// POST /api/auth/register - Register a new user (Donor)
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    logger.warn(`Registration attempt with existing email: ${email}`);
    return res.status(400).json({ success: false, message: 'Email already in use' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Create user for identity
  const newUser = await User.create({
    name,
    email,
    phone,
    role: role || 'donor',
    isEmailVerified: false,
  });

  // Generate email verification token (expires in 24 hours)
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Create auth record for security
  console.log('Creating auth record for:', email);
  const authRecord = await Auth.create({
    user_id: newUser._id,
    passwordHash,
    role: newUser.role,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: tokenExpiry,
  });
  console.log('Auth record created successfully');

  // Send verification email
  try {
    await sendVerificationEmail(email, name, verificationToken);
    logger.info(`Verification email sent to: ${email}`);
  } catch (error) {
    logger.error(`Failed to send verification email to ${email}:`, error);
    // Don't fail registration if email fails to send
  }

  logger.info(`User registered: ${email} (role: ${newUser.role})`);

  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please check your email to verify your account.',
    data: { id: newUser._id, email: newUser.email, role: newUser.role },
  });
});

// POST /api/auth/volunteer/register - Register a new volunteer with profile
export const volunteerRegister = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone, expertise, skills, availability } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    logger.warn(`Volunteer registration attempt with existing email: ${email}`);
    return res.status(400).json({ success: false, message: 'Email already in use' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Create user for identity
  const newUser = await User.create({
    name,
    email,
    phone,
    role: 'volunteer',
    isEmailVerified: false,
  });

  // Generate email verification token (expires in 24 hours)
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Create auth record for security
  await Auth.create({
    user_id: newUser._id,
    passwordHash,
    role: 'volunteer',
    emailVerificationToken: verificationToken,
    emailVerificationExpires: tokenExpiry,
  });

  // Create volunteer profile linked to user
  const volunteerProfile = await Volunteer.create({
    user_id: newUser._id,
    expertise: expertise || [],
    skills: skills || [],
    availability: availability || [],
    hoursContributed: 0,
    pastActivities: [],
  });

  // Send verification email
  try {
    await sendVerificationEmail(email, name, verificationToken);
    logger.info(`Verification email sent to: ${email}`);
  } catch (error) {
    logger.error(`Failed to send verification email to ${email}:`, error);
    // Don't fail registration if email fails to send
  }

  logger.info(`Volunteer registered: ${email} with profile ID: ${volunteerProfile._id}`);

  res.status(201).json({
    success: true,
    message: 'Volunteer registered successfully. Please check your email to verify your account.',
    data: {
      userId: newUser._id,
      profileId: volunteerProfile._id,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

// POST /api/auth/login - Login for all users (returns JWT)
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    logger.warn(`Login attempt with non-existent email: ${email}`);
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Find auth record for the user
  const authRecord = await Auth.findOne({ user_id: user._id });

  if (!authRecord) {
    logger.error(`Auth record missing for user: ${email}`);
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, authRecord.passwordHash);
  if (!match) {
    logger.warn(`Failed login attempt for: ${email}`);
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Check if email is verified (warning, not blocking)
  if (!user.isEmailVerified) {
    logger.warn(`Login from unverified email: ${email}`);
  }

  const payload = { id: user._id, email: user.email, role: user.role };
  const signOptions: jwt.SignOptions = {
    expiresIn: config.JWT_EXPIRY as unknown as jwt.SignOptions['expiresIn'],
  };
  const token = jwt.sign(payload as Record<string, unknown>, config.JWT_SECRET as jwt.Secret, signOptions);

  logger.info(`User logged in: ${email} (role: ${user.role})`);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    expiresIn: config.JWT_EXPIRY,
    emailVerified: user.isEmailVerified,
  });
});

// POST /api/auth/school/register - Specific registration for Schools (creates User + School)
export const schoolRegister = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, schoolDetails, contactPerson, verification, requirements } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    logger.warn(`School registration attempt with existing email: ${email}`);
    return res.status(400).json({ success: false, message: 'Account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Create user for identity
  const newUser = await User.create({
    name: schoolDetails.name,
    email,
    phone: contactPerson.phone,
    role: 'school',
    isEmailVerified: false,
  });

  // Generate email verification token (expires in 24 hours)
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Create auth record for security
  await Auth.create({
    user_id: newUser._id,
    passwordHash,
    role: 'school',
    emailVerificationToken: verificationToken,
    emailVerificationExpires: tokenExpiry,
  });

  // Create school profile linked to user
  const newSchool = await School.create({
    user_id: newUser._id,
    schoolDetails,
    contactPerson,
    verification: verification || { documentUrl: '', isVerified: false },
    requirements: requirements || { infrastructure: [], booksNeeded: false, volunteerRoles: [] },
  });

  // Send verification email
  try {
    await sendVerificationEmail(email, schoolDetails.name, verificationToken);
    logger.info(`Verification email sent to: ${email}`);
  } catch (error) {
    logger.error(`Failed to send verification email to ${email}:`, error);
    // Don't fail registration if email fails to send
  }

  logger.info(`School registered: ${schoolDetails.name} (${email})`);

  res.status(201).json({
    success: true,
    message: 'School registered successfully. Please check your email to verify your account.',
    data: { userId: newUser._id, schoolId: newSchool._id, schoolName: schoolDetails.name },
  });
});

// POST /api/auth/forgot-password - Initiate password reset
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // Always return success response to avoid leaking which emails exist
  if (!user) {
    logger.warn(`Forgot password attempt with non-existent email: ${email}`);
    return res.status(200).json({ success: true, message: 'If an account exists, a reset link will be sent' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Update auth record with reset token
  await Auth.updateOne(
    { user_id: user._id },
    { emailVerificationToken: token, emailVerificationExpires: tokenExpiry }
  );

  // Send password reset email
  try {
    await sendPasswordResetEmail(email, user.name, token);
    logger.info(`Password reset email sent to: ${email}`);
  } catch (error) {
    logger.error(`Failed to send password reset email to ${email}:`, error);
    // Still return success to avoid information leakage
  }

  logger.info(`Password reset token generated for: ${email}`);

  res.status(200).json({
    success: true,
    message: 'If an account exists, a reset link will be sent',
  });
});

// POST /api/auth/verify-email - Verify email with token
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Verification token is required' });
  }

  // Find auth record with matching verification token
  const authRecord = await Auth.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() }, // Token must not be expired
  });

  if (!authRecord) {
    logger.warn(`Invalid or expired verification token attempted`);
    return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
  }

  // Update user to mark email as verified
  const user = await User.findByIdAndUpdate(
    authRecord.user_id,
    { isEmailVerified: true },
    { new: true }
  );

  // Clear the verification token
  await Auth.updateOne(
    { _id: authRecord._id },
    { emailVerificationToken: null, emailVerificationExpires: null }
  );

  logger.info(`Email verified for user: ${user?.email}`);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
    data: { email: user?.email, verified: true },
  });
});

// POST /api/auth/resend-verification-email - Resend verification email
export const resendVerificationEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    logger.warn(`Resend verification attempt with non-existent email: ${email}`);
    return res.status(400).json({ success: false, message: 'User not found' });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ success: false, message: 'Email is already verified' });
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Update auth record with new token
  await Auth.updateOne(
    { user_id: user._id },
    { emailVerificationToken: verificationToken, emailVerificationExpires: tokenExpiry }
  );

  // Send verification email
  try {
    await sendVerificationEmail(email, user.name, verificationToken);
    logger.info(`Verification email resent to: ${email}`);
  } catch (error) {
    logger.error(`Failed to resend verification email to ${email}:`, error);
    return res.status(500).json({ success: false, message: 'Failed to send verification email' });
  }

  res.status(200).json({
    success: true,
    message: 'Verification email sent. Please check your email.',
  });
});
