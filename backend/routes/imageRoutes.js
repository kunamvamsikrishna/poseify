const express = require('express');
const router = express.Router();
const { 
  getAllImages,
  getImageById,
  deleteImage
} = require('../controllers/imageController');

/**
 * @route   GET /api/images
 * @desc    Get all images from MongoDB with pagination
 * @access  Public
 */
router.get('/', getAllImages);

/**
 * @route   GET /api/images/:id
 * @desc    Get single image by MongoDB ID
 * @access  Public
 */
router.get('/:id', getImageById);

/**
 * @route   DELETE /api/images/:id
 * @desc    Delete image from MongoDB and Cloudinary
 * @access  Public
 */
router.delete('/:id', deleteImage);

module.exports = router;
