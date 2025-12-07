const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require("../models/sql/User")
const {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
  getMyImages,
  getMyPoses,
  deleteMe
} = require('../controllers/userController');

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   PUT /api/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/me', protect, updateMe);

/**
 * @route   PUT /api/users/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', protect, changePassword);

/**
 * @route   GET /api/users/me/images
 * @desc    Get all images uploaded by current user
 * @access  Private
 */
router.get('/me/images', protect, getMyImages);

/**
 * @route   GET /api/users/me/poses
 * @desc    Get all pose data for current user
 * @access  Private
 */
router.get('/me/poses', protect, getMyPoses);

/**
 * @route   DELETE /api/users/me
 * @desc    Deactivate user account
 * @access  Private
 */
router.delete('/me', protect, deleteMe);


router.get("/",async (req,res)=>{
    const users  = await User.findAll()
    res.json(users)
})
module.exports = router;
