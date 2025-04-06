import mongoose from 'mongoose';

export const UserActivityAction = {
  Login: 'Login',
  Logout: 'Logout',
  'Password Changed': 'Password Changed',
  'Forgot Password Requested': 'Forgot Password Requested',
  'Password Reset': 'Password Reset',
  'Email Verified': 'Email Verified',
  Register: 'Email Verified',
};

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    action: {
      type: String,
      enum: [
        'Login',
        'Logout',
        'Password Changed',
        'Forgot Password Requested',
        'Password Reset',
        'Email Verified',
        'Register',
      ],
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: 'userActivities' },
);

const UserActivity = mongoose.model('UserActivity', schema);
export default UserActivity;
