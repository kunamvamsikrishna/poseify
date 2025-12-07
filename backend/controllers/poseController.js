const asyncHandler = require('../middleware/asyncHandler');
const path = require('path');
const fs = require('fs').promises;

// Models
const Image = require('../models/mongo/Image');
const PoseData = require('../models/sql/PoseData');

// Services
const pythonService = require('../services/pythonService');
const { uploadImage, deleteImage } = require('../config/cloudinary');

/**
 * POST /api/poses/extract-pose
 * Upload image, extract pose using Python MediaPipe, save to MongoDB and PostgreSQL
 */
const extractPose = asyncHandler(async (req, res) => {
  // 1. Validate file upload
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image file uploaded. Please upload an image.'
    });
  }

  const uploadedFile = req.file;
  const filePath = uploadedFile.path;

  console.log(`[ExtractPose] File uploaded: ${uploadedFile.filename}`);

  try {
    // 2. Call Python service to extract pose (needs local file)
    let poseResult;
    try {
      poseResult = await pythonService.extractPose(filePath);
    } catch (pythonError) {
      // Delete local file on error
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.warn(`Failed to delete local file: ${unlinkError.message}`);
      }
      throw new Error(`Pose extraction failed: ${pythonError.message}`);
    }

    // 3. Validate pose extraction result
    if (!poseResult.success || !poseResult.landmarks || poseResult.landmarks.length === 0) {
      // Delete local file
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.warn(`Failed to delete local file: ${unlinkError.message}`);
      }
      
      return res.status(400).json({
        success: false,
        message: poseResult.message || 'No pose detected in the image'
      });
    }

    console.log(`[ExtractPose] Extracted ${poseResult.landmarks.length} landmarks`);

    // 4. Upload to Cloudinary
    let cloudinaryResult;
    try {
      cloudinaryResult = await uploadImage(filePath, {
        folder: 'poseify/poses',
        deleteLocal: true // Will delete local file after upload
      });
      console.log(`[ExtractPose] Image uploaded to Cloudinary: ${cloudinaryResult.url}`);
    } catch (cloudinaryError) {
      // Delete local file if still exists
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        // Ignore
      }
      throw new Error(`Failed to upload to Cloudinary: ${cloudinaryError.message}`);
    }

    // 5. Save image metadata to MongoDB with Cloudinary URL
    const imageRecord = await Image.create({
      filename: uploadedFile.filename,
      original_name: uploadedFile.originalname,
      file_path: filePath, // Keep for reference, but file is deleted
      image_url: cloudinaryResult.url,
      cloudinary_public_id: cloudinaryResult.public_id,
      file_size: uploadedFile.size,
      mime_type: uploadedFile.mimetype,
      width: cloudinaryResult.width || poseResult.image_dimensions?.width,
      height: cloudinaryResult.height || poseResult.image_dimensions?.height,
      user_id: req.user.id, // Link to authenticated user
      status: 'processing'
    });

    console.log(`[ExtractPose] Image metadata saved to MongoDB: ${imageRecord._id}`);

    // 6. Map landmarks to SQL format
    // Map landmarks to SQL format
    const landmarksArray = poseResult.landmarks.map(lm => ({
      x: lm.x,
      y: lm.y,
      z: lm.z,
      visibility: lm.visibility
    }));

    // 7. Save to PostgreSQL
    const poseDataRecord = await PoseData.createFromLandmarks(
      imageRecord._id.toString(),
      landmarksArray,
      `Pose extracted from ${uploadedFile.originalname}`,
      req.user.id // Pass user_id
    );

    console.log(`[ExtractPose] Pose data saved to PostgreSQL: ${poseDataRecord.id}`);

    // 8. Update MongoDB image record
    await Image.findByIdAndUpdate(imageRecord._id, {
      status: 'processed',
      pose_extracted: true,
      sql_record_id: poseDataRecord.id
    });

    // 9. Send success response
    res.status(201).json({
      success: true,
      message: 'Pose extracted successfully',
      data: {
        image_id: imageRecord._id,
        sql_record_id: poseDataRecord.id,
        filename: uploadedFile.filename,
        image_url: cloudinaryResult.url,
        cloudinary_public_id: cloudinaryResult.public_id,
        original_name: uploadedFile.originalname,
        file_size: uploadedFile.size,
        num_landmarks: poseResult.landmarks.length,
        image_dimensions: poseResult.image_dimensions,
        landmarks: poseResult.landmarks
      }
    });

  } catch (error) {
    console.error('[ExtractPose] Error:', error);

    // Clean up uploaded file on error
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      console.error('[ExtractPose] Failed to delete file:', unlinkError);
    }

    throw error;
  }
});

/**
 * GET /api/poses/:id
 * Get pose data by SQL record ID
 */
const getPoseById = asyncHandler(async (req, res) => {
  const poseData = await PoseData.findByPk(req.params.id);

  if (!poseData) {
    return res.status(404).json({
      success: false,
      message: 'Pose data not found'
    });
  }

  // Get associated image from MongoDB
  const image = await Image.findById(poseData.image_id);

  res.status(200).json({
    success: true,
    data: {
      id: poseData.id,
      user_id: poseData.user_id,
      image_id: poseData.image_id,
      created_at: poseData.created_at,
      updated_at: poseData.updated_at,
      image: image,
      landmarks: poseData.toLandmarksArray()
    }
  });
});

/**
 * GET /api/poses
 * Get all pose data with pagination
 */
const getAllPoses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const { count, rows } = await PoseData.findAndCountAll({
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  // Get associated images - filter valid ObjectIds only
  const imageIds = rows
    .map(pose => pose.image_id)
    .filter(id => id && id.match(/^[0-9a-fA-F]{24}$/)); // Valid ObjectId format
  
  const images = await Image.find({ _id: { $in: imageIds } });
  
  const imageMap = {};
  images.forEach(img => {
    imageMap[img._id.toString()] = img;
  });

  const posesWithImages = rows.map(pose => ({
    ...pose.toJSON(),
    image: imageMap[pose.image_id] || null
  }));

  res.status(200).json({
    success: true,
    data: posesWithImages,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    }
  });
});

/**
 * GET /api/poses/image/:imageId
 * Get pose data by MongoDB image ID
 */
const getPoseByImageId = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.imageId);

  if (!image) {
    return res.status(404).json({
      success: false,
      message: 'Image not found'
    });
  }

  if (!image.pose_extracted || !image.sql_record_id) {
    return res.status(404).json({
      success: false,
      message: 'No pose data found for this image'
    });
  }

  const poseData = await PoseData.findByPk(image.sql_record_id);

  res.status(200).json({
    success: true,
    data: {
      id: poseData.id,
      user_id: poseData.user_id,
      image_id: poseData.image_id,
      created_at: poseData.created_at,
      updated_at: poseData.updated_at,
      image: image,
      landmarks: poseData.toLandmarksArray()
    }
  });
});

/**
 * DELETE /api/poses/:id
 * Delete pose data and associated image
 */
const deletePose = asyncHandler(async (req, res) => {
  const poseData = await PoseData.findByPk(req.params.id);

  if (!poseData) {
    return res.status(404).json({
      success: false,
      message: 'Pose data not found'
    });
  }

  // Find and delete associated image
  const image = await Image.findOne({ sql_record_id: poseData.id });
  
  if (image) {
    // Delete from Cloudinary
    if (image.cloudinary_public_id) {
      try {
        await deleteImage(image.cloudinary_public_id);
        console.log('[DeletePose] Image deleted from Cloudinary');
      } catch (error) {
        console.error('[DeletePose] Failed to delete from Cloudinary:', error.message);
      }
    }

    // Delete MongoDB record
    await Image.findByIdAndDelete(image._id);
  }

  // Delete SQL record
  await poseData.destroy();

  res.status(200).json({
    success: true,
    message: 'Pose data and associated image deleted successfully'
  });
});

module.exports = {
  extractPose,
  getPoseById,
  getAllPoses,
  getPoseByImageId,
  deletePose
};
