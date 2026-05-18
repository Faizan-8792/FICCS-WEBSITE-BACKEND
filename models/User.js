import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    approvedAt: { type: Date, default: null },
    photo: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 300 },
  },
  { timestamps: true }
);

userSchema.pre('save', async function savePassword() {
  if (!this.isModified('password')) return;
  if (typeof this.password === 'string' && this.password.startsWith('$2')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  const storedPassword = this.password || this.get('passwordHash');

  if (
    typeof enteredPassword !== 'string'
    || typeof storedPassword !== 'string'
    || !storedPassword
  ) {
    return false;
  }

  return bcrypt.compare(enteredPassword, storedPassword);
};

export default mongoose.model('User', userSchema);
