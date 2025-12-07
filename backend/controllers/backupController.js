const asyncHandler = require('../middleware/asyncHandler');
const { performBackup, BACKUP_DIR } = require('../services/backupService');
const fs = require('fs');
const path = require('path');

/**
 * POST /api/backup/create
 * Manually trigger a database backup
 * @access Private (Admin only - for now anyone authenticated)
 */
const createBackup = asyncHandler(async (req, res) => {
  console.log('[Backup API] Manual backup triggered by user:', req.user?.username || 'Unknown');

  // Check if email notification is requested via query parameter
  const sendEmail = req.query.sendEmail === 'true';

  const result = await performBackup(sendEmail);

  if (result.success) {
    res.status(200).json({
      success: true,
      message: result.alreadyExists 
        ? 'Backup already exists for today' 
        : 'Backup created successfully',
      data: {
        filename: result.filename,
        path: result.path,
        duration: result.duration,
        alreadyExists: result.alreadyExists || false,
        emailSent: result.emailSent || false,
        emailRecipient: result.emailRecipient || null
      }
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Backup failed',
      error: result.error
    });
  }
});

/**
 * GET /api/backup/list
 * List all available backups
 * @access Private
 */
const listBackups = asyncHandler(async (req, res) => {
  if (!fs.existsSync(BACKUP_DIR)) {
    return res.status(200).json({
      success: true,
      data: {
        backups: [],
        total: 0
      }
    });
  }

  const files = fs.readdirSync(BACKUP_DIR)
    .filter(file => file.endsWith('.zip'))
    .map(file => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      return {
        filename: file,
        size: stats.size,
        size_mb: (stats.size / (1024 * 1024)).toFixed(2),
        created_at: stats.birthtime,
        modified_at: stats.mtime
      };
    })
    .sort((a, b) => b.modified_at - a.modified_at);

  res.status(200).json({
    success: true,
    data: {
      backups: files,
      total: files.length,
      backup_directory: BACKUP_DIR
    }
  });
});

/**
 * GET /api/backup/download/:filename
 * Download a specific backup file
 * @access Private
 */
const downloadBackup = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  // Validate filename (prevent directory traversal)
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid filename'
    });
  }

  const filePath = path.join(BACKUP_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'Backup file not found'
    });
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('[Backup API] Download error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Download failed'
        });
      }
    }
  });
});

/**
 * DELETE /api/backup/:filename
 * Delete a specific backup file
 * @access Private (Admin only)
 */
const deleteBackup = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  // Validate filename
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid filename'
    });
  }

  const filePath = path.join(BACKUP_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'Backup file not found'
    });
  }

  fs.unlinkSync(filePath);

  res.status(200).json({
    success: true,
    message: 'Backup deleted successfully',
    data: {
      filename
    }
  });
});

module.exports = {
  createBackup,
  listBackups,
  downloadBackup,
  deleteBackup
};
