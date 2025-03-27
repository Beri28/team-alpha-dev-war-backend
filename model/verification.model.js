import mongoose from 'mongoose';

const verificationRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  idFrontImage: {
    type: String,
    required: true
  },
  idBackImage: {
    type: String,
    required: true
  },
  selfieWithIdImage: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date
});

export default mongoose.model('VerificationRequest', verificationRequestSchema);