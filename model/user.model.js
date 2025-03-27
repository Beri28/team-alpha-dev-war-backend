import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  verificationStatus: {
    type: String,
    enum: ['unverified', 'pending', 'verified', 'rejected'],
    default: 'unverified'
  },
  verificationRejectionReason: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VerificationRequest'
  },
  role: {  // Adding the role field
    type: String,
    enum: ['user', 'admin'],  // User can be 'user' or 'admin'
    default: 'user'  // Default value set to 'user'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
