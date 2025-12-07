const cron = require('node-cron');
const path = require('path');
const fs = require('fs').promises;
const { performBackup } = require('../services/backupService');

/**
 * Daily Database Backup Job
 * Runs every day at 11:59 PM
 * Exports PostgreSQL and MongoDB to ZIP file
 */
const backupJob = cron.schedule('59 23 * * *', async () => {
  console.log('[Cron] Running daily backup job at 11:59 PM...');
  
  try {
    // Perform backup with email notification enabled
    const result = await performBackup(true);
    
    if (result.success) {
      if (result.alreadyExists) {
        console.log(`[Cron] ✓ Backup already exists: ${result.filename}`);
      } else {
        console.log(`[Cron] ✓ Backup completed successfully: ${result.filename}`);
        console.log(`[Cron] Duration: ${result.duration}`);
        
        if (result.emailSent) {
          console.log(`[Cron] ✓ Email notification sent to ${result.emailRecipient}`);
        } else {
          console.log(`[Cron] ⚠ Email notification skipped (not configured)`);
        }
      }
    } else {
      console.error(`[Cron] ❌ Backup failed: ${result.error}`);
    }
  } catch (error) {
    console.error('[Cron] ❌ Backup job error:', error.message);
  }
}, {
  scheduled: false, // Start manually via startCronJobs()
  timezone: 'America/New_York' // Adjust to your timezone
});

/**
 * Example cron job for cleaning up old uploads
 * Runs every Sunday at 3:00 AM
 */
const cleanupJob = cron.schedule('0 3 * * 0', async () => {
  console.log('Running cleanup job...');
  
  try {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const files = await fs.readdir(uploadsDir);
    
    // TODO: Implement cleanup logic for files older than 30 days
    console.log(`✓ Cleanup completed. Checked ${files.length} files`);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}, {
  scheduled: false
});

// Manual backup trigger function
const runBackupNow = async () => {
  console.log('[Manual] Triggering backup manually...');
  try {
    const result = await performBackup();
    return result;
  } catch (error) {
    console.error('[Manual] Backup error:', error.message);
    return { success: false, error: error.message };
  }
};

// Start all cron jobs
const startCronJobs = () => {
  const enableCron = process.env.ENABLE_CRON_JOBS === 'true';
  
  if (enableCron) {
    backupJob.start();
    cleanupJob.start();
    console.log('✓ Cron jobs started (Daily backup at 11:59 PM)');
  } else {
    console.log('⚠ Cron jobs disabled (ENABLE_CRON_JOBS=false)');
  }
};

// Stop all cron jobs
const stopCronJobs = () => {
  backupJob.stop();
  cleanupJob.stop();
  console.log('✓ Cron jobs stopped');
};

module.exports = {
  startCronJobs,
  stopCronJobs,
  runBackupNow,
  backupJob,
  cleanupJob
};
