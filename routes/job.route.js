import express from 'express';
import { createJob, getAllJobs,getJobById } from '../controller/job.controller.js';  // Path to the controller
import { protect } from '../middleware/auth.middleware.js'

const jobRoutes = express.Router();

// Route to create a job
jobRoutes.post('/jobs', protect, createJob); 
jobRoutes.get('/jobs', getAllJobs);
jobRoutes.get('/jobs/:id', getJobById);

export default jobRoutes;
