import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { uploadAsset } from '../utils/uploadAsset.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  approvedAt: user.approvedAt,
  photo: user.photo || '',
  bio: user.bio || '',
});

export const signup = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const email = String(req.body.email || '').trim().toLowerCase();

  if (!name?.trim() || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('An account with this email already exists.');
  }

  // Create user — status defaults to 'pending' (not yet a member)
  const user = await User.create({ name: String(name).trim(), email, password });

  // Issue JWT immediately — no approval gate for basic login
  res.status(201).json({
    token: signToken(user._id),
    user: safeUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // All users with valid credentials can log in — no status gate
  res.json({
    token: signToken(user._id),
    user: safeUser(user),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(safeUser(req.user));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, bio } = req.body;

  if (name !== undefined) {
    const trimmed = String(name).trim();
    if (!trimmed) {
      res.status(400);
      throw new Error('Name cannot be empty');
    }
    user.name = trimmed;
  }

  if (bio !== undefined) {
    user.bio = String(bio).trim().slice(0, 300);
  }

  // Handle photo upload if file was sent
  if (req.file) {
    const url = await uploadAsset(req, 'ficcs-avatars');
    if (url) user.photo = url;
  }

  await user.save();
  res.json(safeUser(user));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Current and new password are required');
  }

  if (String(newPassword).length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password updated successfully' });
});
