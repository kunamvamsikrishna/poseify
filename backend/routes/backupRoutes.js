const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createBackup,
  listBackups,
  downloadBackup,
  deleteBackup
} = require('../controllers/backupController');

/**
 * @route   POST /api/backup/create
 * @desc    Manually trigger database backup
 * @access  Private
 */
router.post('/create', protect, createBackup);

/**
 * @route   GET /api/backup/list
 * @desc    List all available backups
 * @access  Private
 */
router.get('/list', protect, listBackups);

/**
 * @route   GET /api/backup/download/:filename
 * @desc    Download a specific backup file
 * @access  Private
 */
router.get('/download/:filename', protect, downloadBackup);

/**
 * @route   DELETE /api/backup/:filename
 * @desc    Delete a specific backup file
 * @access  Private
 */
router.delete('/:filename', protect, deleteBackup);

module.exports = router;
