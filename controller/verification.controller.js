import VerificationRequest from '../model/verification.model.js';
import User from '../model/user.model.js';
import { processImage } from '../utils/imageProcessor.js';

/**
 * Submit a verification request
 */
export const submitVerification = async (req, res) => {
  try {
    const { userId } = req;
    
    // Check if user is already verified
    const user = await User.findById(userId);
    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Check for existing pending request
    const existingRequest = await VerificationRequest.findOne({
      user: userId,
      status: 'pending'
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending verification request' });
    }

    // Process images
    const idFront = await processImage(req.files.idFront[0]);
    const idBack = await processImage(req.files.idBack[0]);
    const selfieWithId = await processImage(req.files.selfieWithId[0]);

    // Create verification request
    const verificationRequest = new VerificationRequest({
      user: userId,
      idFrontImage: idFront.path,
      idBackImage: idBack.path,
      selfieWithIdImage: selfieWithId.path
    });

    await verificationRequest.save();

    // Update user status and link the request
    await User.findByIdAndUpdate(userId, { 
      verificationStatus: 'pending',
      verificationRequest: verificationRequest._id
    });

    res.status(201).json({
      message: 'Verification submitted successfully',
      requestId: verificationRequest._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting verification', error: error.message });
  }
};

/**
 * Approve a user's verification request (Admin Only)
 */
export const approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Find the verification request
    const verificationRequest = await VerificationRequest.findById(requestId);
    if (!verificationRequest) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    // Update user verification status
    const updatedUser = await User.findByIdAndUpdate(
      verificationRequest.user,
      { isVerified: true, verificationStatus: 'approved' }, // Explicitly set verificationStatus
      { new: true } // Ensure we get the updated document
    );

    // Update verification request status
    verificationRequest.status = 'approved';
    await verificationRequest.save();

    res.status(200).json({
      message: 'User verification approved successfully',
      user: updatedUser, // Return the updated user for confirmation
    });
  } catch (error) {
    res.status(500).json({ message: 'Error approving verification request', error: error.message });
  }
};


/**
 * Reject a user's verification request (Admin Only)
 */
export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Find the verification request
    const verificationRequest = await VerificationRequest.findById(requestId);
    if (!verificationRequest) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    // Update verification status
    await User.findByIdAndUpdate(verificationRequest.user, { isVerified: false });
    verificationRequest.status = 'rejected';
    await verificationRequest.save();

    res.status(200).json({ message: 'User verification rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting verification request', error: error.message });
  }
};

/**
 * Get all pending verification requests (Admin Only)
 */
export const getAllPendingRequests = async (req, res) => {
  try {
    const requests = await VerificationRequest.find({ status: 'pending' }).populate('user');
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending requests', error: error.message });
  }
};

/**
 * Get a specific verification request
 */
export const getVerificationRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const verificationRequest = await VerificationRequest.findById(requestId).populate('user');
    if (!verificationRequest) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    res.status(200).json({ verificationRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching verification request', error: error.message });
  }
};

/**
 * Cancel a user's verification request
 */
export const cancelVerificationRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const verificationRequest = await VerificationRequest.findById(requestId);
    if (!verificationRequest) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    await verificationRequest.remove();

    // Update user status
    await User.findByIdAndUpdate(verificationRequest.user, { verificationStatus: 'none', verificationRequest: null });

    res.status(200).json({ message: 'Verification request canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling verification request', error: error.message });
  }
};

/**
 * Get the verification status of the user
 */
export const getVerificationStatus = async (req, res) => {
  try {
    const { userId } = req; // Assuming you are extracting userId from the request

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the verification status of the user
    res.status(200).json({
      message: 'User verification status fetched successfully',
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching verification status', error: error.message });
  }
};
