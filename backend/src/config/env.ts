import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/edureach',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  UPI_ID: process.env.UPI_ID || '',
  UPI_NAME: process.env.UPI_NAME || 'EduReach',
  // Email Configuration
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || '587',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@edureach.com',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export default config;
