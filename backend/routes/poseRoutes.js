const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, optionalAuth } = require('../middleware/auth');
const {
  extractPose,
  getPoseById,
  getAllPoses,
  getPoseByImageId,
  deletePose
} = require('../controllers/poseController');

/**
 * @route   POST /api/poses/extract-pose
 * @desc    Upload image and extract pose using MediaPipe
 * @access  Private (requires authentication)
 */
router.post('/extract-pose', protect, upload.single('image'), extractPose);

/**
 * @route   GET /api/poses
 * @desc    Get all pose data with pagination
 * @access  Public
 */
router.get('/', getAllPoses);

/**
 * @route   GET /api/poses/image/:imageId
 * @desc    Get pose data by MongoDB image ID
 * @access  Public
 */
router.get('/image/:imageId', getPoseByImageId);

/**
 * @route   GET /api/poses/:id
 * @desc    Get pose data by SQL record ID (integer)
 * @access  Public
 */
router.get('/:id', getPoseById);

/**
 * @route   DELETE /api/poses/:id
 * @desc    Delete pose data and associated image
 * @access  Public
 */
router.delete('/:id', deletePose);

module.exports = router;
