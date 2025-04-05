import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['FORGOT_PASSWORD', 'VERIFY_EMAIL'],
      required: true,
    },
    expireIn: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, collection: 'tokens' },
);

const Token = mongoose.model('Token', schema);
export default Token;
