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

    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

      // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

      // Verify password
    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

      // Generate token
    const token = generateToken(user);

    res.json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { 
      age, 
      weight, 
      height, 
      fitnessLevel, 
      workoutPreferences 
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (age) user.age = age;
    if (weight) user.weight = weight;
    if (height) user.height = height;
    if (fitnessLevel) user.fitnessLevel = fitnessLevel;
    if (workoutPreferences) user.workoutPreferences = workoutPreferences;

    await user.save();

    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};