const asyncHandler = require('../middleware/asyncHandler');
const Image = require('../models/mongo/Image');
const { deleteImage: deleteCloudinaryImage } = require('../config/cloudinary');

/**
 * GET /api/images
 * Get all images with pagination
 * @access Public
 */
const getAllImages = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Image.countDocuments();
  const images = await Image.find()
    .sort({ uploaded_at: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    data: {
      images,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalImages: total,
        imagesPerPage: limit
      }
    }
  });
});

/**
 * GET /api/images/:id
 * Get single image by MongoDB ID
 * @access Public
 */
const getImageById = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id).lean();

  if (!image) {
    return res.status(404).json({
      success: false,
      message: 'Image not found'
    });
  }

  res.status(200).json({
    success: true,
    data: image
  });
});

/**
 * DELETE /api/images/:id
 * Delete image from MongoDB and Cloudinary
 * @access Public
 */
const deleteImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);

  if (!image) {
    return res.status(404).json({
      success: false,
      message: 'Image not found'
    });
  }

  // Delete from Cloudinary if public_id exists
  if (image.cloudinary_public_id) {
    try {
      await deleteCloudinaryImage(image.cloudinary_public_id);
      console.log(`[Image] Deleted from Cloudinary: ${image.cloudinary_public_id}`);
    } catch (error) {
      console.error('[Image] Failed to delete from Cloudinary:', error.message);
    }
  }

  // Delete from MongoDB
  await Image.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Image deleted successfully',
    data: {
      id: req.params.id,
      cloudinary_public_id: image.cloudinary_public_id
    }
  });
});

module.exports = {
  getAllImages,
  getImageById,
  deleteImage
};
