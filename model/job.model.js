import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: { type: [String], required: true },  // Array of skills
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  contactInfo: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // User who created the job
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;
