const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/sql/User');
const Image = require('../models/mongo/Image');
const PoseData = require('../models/sql/PoseData');

/**
 * POST /api/users/register
 * Register a new user
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password, first_name, last_name } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide username, email, and password'
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  // Check if user exists
  const existingUser = await User.findOne({
    where: {
      [require('sequelize').Op.or]: [
        { email },
        { username }
      ]
    }
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: existingUser.email === email 
        ? 'Email already registered' 
        : 'Username already taken'
    });
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    first_name,
    last_name
  });

  // Generate token
  const token = user.generateAuthToken();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: user.toJSON(),
      token
    }
  });
});

/**
 * POST /api/users/login
 * Login user
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Find user
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if user is active
  if (!user.is_active) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated. Please contact support.'
    });
  }

  // Verify password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Update last login
  await user.update({ last_login: new Date() });

  // Generate token
  const token = user.generateAuthToken();

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toJSON(),
      token
    }
  });
});

/**
 * GET /api/users/me
 * Get current user profile
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * PUT /api/users/me
 * Update current user profile
 */
const updateMe = asyncHandler(async (req, res) => {
  const { username, email, first_name, last_name } = req.body;

  const fieldsToUpdate = {};
  if (username) fieldsToUpdate.username = username;
  if (email) fieldsToUpdate.email = email;
  if (first_name !== undefined) fieldsToUpdate.first_name = first_name;
  if (last_name !== undefined) fieldsToUpdate.last_name = last_name;

  // Check if username or email already taken by another user
  if (username || email) {
    const { Op } = require('sequelize');
    const whereClause = {
      id: { [Op.ne]: req.user.id }
    };

    if (username && email) {
      whereClause[Op.or] = [{ username }, { email }];
    } else if (username) {
      whereClause.username = username;
    } else if (email) {
      whereClause.email = email;
    }

    const existingUser = await User.findOne({ where: whereClause });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.username === username 
          ? 'Username already taken' 
          : 'Email already registered'
      });
    }
  }

  await req.user.update(fieldsToUpdate);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: req.user.toJSON()
  });
});

/**
 * PUT /api/users/change-password
 * Change user password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current and new password'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters'
    });
  }

  // Get user with password
  const user = await User.findByPk(req.user.id);

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  await user.update({ password: newPassword });

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

/**
 * GET /api/users/me/images
 * Get all images uploaded by current user
 */
const getMyImages = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const images = await Image.find({ user_id: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Image.countDocuments({ user_id: req.user.id });

  res.status(200).json({
    success: true,
    data: {
      images,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit
      }
    }
  });
});

/**
 * GET /api/users/me/poses
 * Get all pose data for current user
 */
const getMyPoses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { count, rows } = await PoseData.findAndCountAll({
    where: { user_id: req.user.id },
    order: [['created_at', 'DESC']],
    limit,
    offset
  });

  // Get associated images from MongoDB
  const imageIds = rows.map(pose => pose.image_id).filter(id => id && id.match(/^[0-9a-fA-F]{24}$/));
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
    data: {
      poses: posesWithImages,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(count / limit),
        total_items: count,
        items_per_page: limit
      }
    }
  });
});

/**
 * DELETE /api/users/me
 * Delete user account (soft delete - deactivate)
 */
const deleteMe = asyncHandler(async (req, res) => {
  await req.user.update({ is_active: false });

  res.status(200).json({
    success: true,
    message: 'Account deactivated successfully'
  });
});

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
  getMyImages,
  getMyPoses,
  deleteMe
};
