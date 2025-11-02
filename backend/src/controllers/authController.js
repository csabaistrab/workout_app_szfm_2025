import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      weight,
      height,
      fitnessLevel,
      workoutPreferences
    } = req.body;

  // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Create new user
    const user = new User({
      name,
      email,
      passwordHash: password, // will be hashed by pre-save middleware
      age,
      weight,
      height,
      fitnessLevel,
      workoutPreferences
    });