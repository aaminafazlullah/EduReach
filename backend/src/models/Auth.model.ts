import mongoose, { Schema, Document } from 'mongoose';

export interface IAuth extends Document {
  user_id: mongoose.Types.ObjectId;
  passwordHash: string;
  role: 'admin' | 'school' | 'volunteer' | 'donor';
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AuthSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'school', 'volunteer', 'donor'],
      required: true,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Auth = mongoose.model<IAuth>('Auth', AuthSchema, 'auths');

