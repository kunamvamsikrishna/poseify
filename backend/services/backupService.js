const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

/**
 * Backup Service
 * Handles database backups for both SQL (PostgreSQL) and NoSQL (MongoDB)
 */

// Backup directory
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

/**
 * Ensure backup directory exists
 */
const ensureBackupDir = () => {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`[Backup] Created backup directory: ${BACKUP_DIR}`);
  }
};

/**
 * Generate timestamp-based filename
 * Format: yyyy-mm-dd-backup.zip
 */
const generateBackupFilename = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}-backup.zip`;
};

/**
 * Export PostgreSQL database using Sequelize (no pg_dump required)
 */
const exportPostgresDB = async () => {
  const timestamp = Date.now();
  const sqlFile = path.join(BACKUP_DIR, `postgres-${timestamp}.json`);
  
  try {
    const { sequelize } = require('../db/sql');
    const User = require('../models/sql/User');
    const PoseData = require('../models/sql/PoseData');

    // Export all tables to JSON
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      raw: true
    });

    const poses = await PoseData.findAll({
      raw: true
    });

    const backup = {
      exportDate: new Date().toISOString(),
      database: process.env.DB_NAME || 'poseify',
      tables: {
        users: {
          count: users.length,
          data: users
        },
        pose_data: {
          count: poses.length,
          data: poses
        }
      }
    };

    fs.writeFileSync(sqlFile, JSON.stringify(backup, null, 2));
    console.log(`[Backup] PostgreSQL exported: ${sqlFile} (${users.length} users, ${poses.length} poses)`);
    return sqlFile;
  } catch (error) {
    console.error('[Backup] PostgreSQL export failed:', error.message);
    // Create empty file on error
    const emptyBackup = {
      exportDate: new Date().toISOString(),
      error: error.message,
      tables: { users: { count: 0, data: [] }, pose_data: { count: 0, data: [] } }
    };
    fs.writeFileSync(sqlFile, JSON.stringify(emptyBackup, null, 2));
    return sqlFile;
  }
};

/**
 * Export MongoDB database using Mongoose (no mongoexport required)
 */
const exportMongoDB = async () => {
  const timestamp = Date.now();
  const mongoDir = path.join(BACKUP_DIR, `mongodb-${timestamp}`);
  
  // Create directory for MongoDB export
  if (!fs.existsSync(mongoDir)) {
    fs.mkdirSync(mongoDir, { recursive: true });
  }

  try {
    const Image = require('../models/mongo/Image');

    // Export Images collection (contains all uploaded images metadata)
    const images = await Image.find({}).lean();
    fs.writeFileSync(
      path.join(mongoDir, 'images.json'), 
      JSON.stringify(images, null, 2)
    );
    console.log(`[Backup] Exported ${images.length} images from MongoDB`);

    // Create summary
    const summary = {
      exportDate: new Date().toISOString(),
      database: 'MongoDB',
      note: 'Images are stored in MongoDB, pose landmarks are stored in PostgreSQL',
      collections: {
        images: { 
          count: images.length,
          description: 'Image metadata including Cloudinary URLs and user associations'
        }
      }
    };
    fs.writeFileSync(
      path.join(mongoDir, 'summary.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log(`[Backup] MongoDB exported: ${mongoDir}`);
    return mongoDir;
  } catch (error) {
    console.error('[Backup] MongoDB export failed:', error.message);
    // Create empty files if export fails
    fs.writeFileSync(path.join(mongoDir, 'images.json'), '[]');
    fs.writeFileSync(path.join(mongoDir, 'error.txt'), error.message);
    return mongoDir;
  }
};

/**
 * Create ZIP archive from backup files
 */
const createZipArchive = (sqlFile, mongoDir, outputPath) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    output.on('close', () => {
      console.log(`[Backup] Archive created: ${outputPath} (${archive.pointer()} bytes)`);
      resolve(outputPath);
    });

    archive.on('error', (err) => {
      console.error('[Backup] Archive error:', err);
      reject(err);
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('[Backup] Archive warning:', err);
      } else {
        reject(err);
      }
    });

    archive.pipe(output);

    // Add PostgreSQL dump
    if (sqlFile && fs.existsSync(sqlFile)) {
      archive.file(sqlFile, { name: path.basename(sqlFile) });
    }

    // Add MongoDB directory
    if (mongoDir && fs.existsSync(mongoDir)) {
      archive.directory(mongoDir, 'mongodb');
    }

    // Add metadata
    const metadata = {
      backup_date: new Date().toISOString(),
      postgresql_file: sqlFile ? path.basename(sqlFile) : null,
      mongodb_dir: mongoDir ? path.basename(mongoDir) : null,
      node_version: process.version,
      platform: process.platform
    };
    archive.append(JSON.stringify(metadata, null, 2), { name: 'backup-info.json' });

    archive.finalize();
  });
};

/**
 * Clean up temporary backup files
 */
const cleanupTempFiles = (sqlFile, mongoDir) => {
  try {
    if (sqlFile && fs.existsSync(sqlFile)) {
      fs.unlinkSync(sqlFile);
      console.log(`[Backup] Cleaned up: ${sqlFile}`);
    }

    if (mongoDir && fs.existsSync(mongoDir)) {
      fs.rmSync(mongoDir, { recursive: true, force: true });
      console.log(`[Backup] Cleaned up: ${mongoDir}`);
    }
  } catch (error) {
    console.error('[Backup] Cleanup error:', error.message);
  }
};

/**
 * Delete old backups (keep last N backups)
 */
const deleteOldBackups = (keepCount = 30) => {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.endsWith('.zip'))
      .map(file => ({
        name: file,
        path: path.join(BACKUP_DIR, file),
        time: fs.statSync(path.join(BACKUP_DIR, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    // Delete old backups
    if (files.length > keepCount) {
      const filesToDelete = files.slice(keepCount);
      filesToDelete.forEach(file => {
        fs.unlinkSync(file.path);
        console.log(`[Backup] Deleted old backup: ${file.name}`);
      });
    }
  } catch (error) {
    console.error('[Backup] Error deleting old backups:', error.message);
  }
};

/**
 * Main backup function
 * Exports both databases and creates a ZIP archive
 * Optionally sends email notification
 * @param {boolean} sendEmail - Whether to send email notification
 */
const performBackup = async (sendEmail = false) => {
  console.log('\n[Backup] ===== Starting Database Backup =====');
  const startTime = Date.now();

  try {
    // Ensure backup directory exists
    ensureBackupDir();

    // Generate backup filename
    const backupFilename = generateBackupFilename();
    const backupPath = path.join(BACKUP_DIR, backupFilename);

    // Check if backup already exists for today
    if (fs.existsSync(backupPath)) {
      console.log(`[Backup] Backup already exists for today: ${backupFilename}`);
      return { success: true, path: backupPath, alreadyExists: true, filename: backupFilename };
    }

    let sqlFile = null;
    let mongoDir = null;

    // Export PostgreSQL
    console.log('[Backup] Exporting PostgreSQL database...');
    try {
      sqlFile = await exportPostgresDB();
    } catch (error) {
      console.error('[Backup] PostgreSQL export failed, continuing...');
    }

    // Export MongoDB
    console.log('[Backup] Exporting MongoDB database...');
    try {
      mongoDir = await exportMongoDB();
    } catch (error) {
      console.error('[Backup] MongoDB export failed, continuing...');
    }

    // Create ZIP archive
    console.log('[Backup] Creating ZIP archive...');
    await createZipArchive(sqlFile, mongoDir, backupPath);

    // Clean up temporary files
    cleanupTempFiles(sqlFile, mongoDir);

    // Delete old backups (keep last 30)
    deleteOldBackups(30);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Backup] ===== Backup Completed in ${duration}s =====\n`);

    // Send email notification if requested
    let emailResult = null;
    if (sendEmail) {
      console.log('[Backup] Sending email notification...');
      const { sendBackupEmail } = require('./emailService');
      emailResult = await sendBackupEmail(backupPath, backupFilename);
      
      if (emailResult.success) {
        console.log(`[Backup] Email sent successfully to ${emailResult.recipient}`);
      } else {
        console.warn(`[Backup] Email notification failed: ${emailResult.message || emailResult.error}`);
      }
    }

    return {
      success: true,
      path: backupPath,
      filename: backupFilename,
      duration: `${duration}s`,
      emailSent: emailResult?.success || false,
      emailRecipient: emailResult?.recipient || null
    };

  } catch (error) {
    console.error('[Backup] ===== Backup Failed =====');
    console.error('[Backup] Error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  performBackup,
  ensureBackupDir,
  BACKUP_DIR
};
