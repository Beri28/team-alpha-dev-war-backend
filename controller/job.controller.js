import Job from  '../model/job.model.js'  // Path to the Job model
import User from '../model/user.model.js';  // Assuming this is the path to the User model

export const createJob = async (req, res) => {
  try {
    const { title, description, skills, budget, deadline, contactInfo } = req.body;
    const userId = req.userId; // Assuming userId is set in the request from authentication

    if (!title || !description || !skills || !budget || !deadline || !contactInfo) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Create the job
    const job = new Job({
      title,
      description,
      skills,
      budget,
      deadline,
      contactInfo,
      userId
    });

    // Save the job to the database
    const savedJob = await job.save();
    res.status(201).json({ message: 'Job created successfully', job: savedJob });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};


export const getAllJobs = async (req, res) => {
    try {
      const jobs = await Job.find().populate('userId', 'name email'); // Populate user info if needed
      res.status(200).json(jobs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  };

  
  export const getJobById = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id).populate('userId', 'name email');
  
      if (!job) {
        return res.status(404).json({ message: 'Job not found.' });
      }
  
      res.status(200).json(job);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  };
  
