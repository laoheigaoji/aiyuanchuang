import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  openId: { type: String, unique: true, required: true },
  nickname: String,
  balance: { type: Number, default: 3000 },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', userSchema);
