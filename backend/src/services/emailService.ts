import nodemailer from 'nodemailer';
import config from '../config/env';
import { logger } from '../utils/logger';

// Create email transporter
const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: parseInt(config.SMTP_PORT),
  secure: config.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    logger.error('Email transporter error:', error);
  } else if (success && config.NODE_ENV === 'development') {
    logger.info('Email transporter ready');
  }
});

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

/**
 * Send an email using nodemailer
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${options.email}`);
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send email verification email
 */
export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string
): Promise<void> => {
  const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${token}`;

  const message = `
    Hi ${name},
    
    Please verify your email address by clicking the link below:
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you didn't create this account, please ignore this email.
    
    Best regards,
    EduReach Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Email Verification</h2>
      <p>Hi ${name},</p>
      <p>Please verify your email address by clicking the button below:</p>
      <div style="margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Verify Email
        </a>
      </div>
      <p>Or copy this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create this account, please ignore this email.</p>
      <p>Best regards,<br/>EduReach Team</p>
    </div>
  `;

  await sendEmail({
    email,
    subject: 'Verify Your EduReach Email Address',
    message,
    html,
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  token: string
): Promise<void> => {
  const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${token}`;

  const message = `
    Hi ${name},
    
    Click the link below to reset your password:
    ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request a password reset, please ignore this email.
    
    Best regards,
    EduReach Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Password Reset</h2>
      <p>Hi ${name},</p>
      <p>Click the button below to reset your password:</p>
      <div style="margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br/>EduReach Team</p>
    </div>
  `;

  await sendEmail({
    email,
    subject: 'Reset Your EduReach Password',
    message,
    html,
  });
};
