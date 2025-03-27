import express from 'express';
import {
  submitVerification,
  getVerificationStatus,
  getAllPendingRequests,
  approveRequest,
  rejectRequest
} from '../controller/verification.controller.js';
import { authenticateUser, checkAdmin } from '../middleware/auth.middleware.js';
import { uploadVerificationImages } from '../middleware/upload.middleware.js';

const verificationRoute = express.Router();

// User routes
verificationRoute.post('/submit', 
  authenticateUser, 
  uploadVerificationImages, 
  submitVerification
);

verificationRoute.get('/status', 
  authenticateUser, 
  getVerificationStatus
);

// Admin routes
verificationRoute.get('/pending', 
  authenticateUser, 
  checkAdmin, 
  getAllPendingRequests
);

verificationRoute.put('/approve/:requestId', 
  authenticateUser, 
  checkAdmin, 
  approveRequest
);

verificationRoute.put('/reject/:requestId', 
  authenticateUser, 
  checkAdmin, 
  rejectRequest
);

export default verificationRoute;