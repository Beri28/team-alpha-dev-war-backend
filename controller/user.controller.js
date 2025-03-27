import User from '../model/user.model.js';
import VerificationRequest from '../model/verification.model.js';
import { processImage, deleteImageFile } from '../utils/imageProcessor.js'

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password -__v')
      .populate('verificationRequest', 'status reviewedAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, telephone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, telephone },
      { new: true, runValidators: true }
    ).select('-password -__v');

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    // First find verification request to delete associated files
    const user = await User.findById(req.userId);
    if (user.verificationRequest) {
      const verification = await VerificationRequest.findById(user.verificationRequest);
      if (verification) {
        await deleteImageFile(verification.idFrontImage);
        await deleteImageFile(verification.idBackImage);
        await deleteImageFile(verification.selfieWithIdImage);
        await verification.remove();
      }
    }

    await User.findByIdAndDelete(req.userId);
    
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};

export const getVerificationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('isVerified verificationStatus verificationRejectionReason')
      .populate('verificationRequest', 'status submittedAt reviewedAt rejectionReason');

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching verification status', error: error.message });
  }
};

// Admin controllers
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password -__v')
      .populate('verificationRequest', 'status');
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -__v')
      .populate('verificationRequest');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};