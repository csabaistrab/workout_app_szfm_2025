import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  age: { 
    type: Number,
    required: true,
    min: 13,
    max: 120
  },
  weight: { 
    type: Number,
    required: true,
    min: 30,
    max: 300
  },
  height: { 
    type: Number,
    required: true,
    min: 100,
    max: 250
  },
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  workoutPreferences: {
    focusAreas: [{
      type: String,
      enum: ['cardio', 'strength', 'flexibility', 'balance']
    }],
    timePerSession: {
      type: Number,
      default: 30,
      min: 15,
      max: 120
    }
  },
  lastWorkoutGeneration: {
    type: Date
  }
}, { 
  timestamps: true,
  versionKey: false 
});

// Remove sensitive data when converting to JSON
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  }
});

// Password verification method
userSchema.methods.verifyPassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  next();
});

export default mongoose.model('User', userSchema);