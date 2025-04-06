import mongoose from 'mongoose';
import UserActivity from '../models/userActivity.model.js';

export default class UserActivityService {
  static create = async (userId, action, ip, userAgent) => {
    return await UserActivity.create({
      user: userId,
      action,
      ip,
      userAgent,
    });
  };

  static getActivitiesByUserId = async (userId) => {
    return await UserActivity.find({
      user: new mongoose.Types.ObjectId(userId),
    }).lean();
  };
}
