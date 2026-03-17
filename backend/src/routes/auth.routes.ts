import { Router } from 'express';
import { authValidators, validateRequest } from '../validators/authValidators';
import { register, login, schoolRegister, volunteerRegister, forgotPassword, verifyEmail, resendVerificationEmail } from '../controllers/authController';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  authValidators.register,
  validateRequest,
  register
);

// POST /api/auth/login
router.post(
  '/login',
  authValidators.login,
  validateRequest,
  login
);

// POST /api/auth/school/register
router.post(
  '/school/register',
  authValidators.schoolRegister,
  validateRequest,
  schoolRegister
);

// POST /api/auth/volunteer/register
router.post(
  '/volunteer/register',
  authValidators.volunteerRegister,
  validateRequest,
  volunteerRegister
);

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  authValidators.forgotPassword,
  validateRequest,
  forgotPassword
);

// POST /api/auth/verify-email
router.post(
  '/verify-email',
  verifyEmail
);

// POST /api/auth/resend-verification-email
router.post(
  '/resend-verification-email',
  resendVerificationEmail
);

export default router;
