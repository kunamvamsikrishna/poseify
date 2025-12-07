const brevo = require('@getbrevo/brevo');
const fs = require('fs');
const path = require('path');

// Configure Brevo (formerly Sendinblue)
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL || process.env.FROM_EMAIL;
const FROM_NAME = process.env.BREVO_FROM_NAME || 'POSEIFY Backup';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

console.log('[Email] BREVO_API_KEY present:', !!BREVO_API_KEY);
console.log('[Email] FROM_EMAIL:', FROM_EMAIL);
console.log('[Email] ADMIN_EMAIL:', ADMIN_EMAIL);

let apiInstance = null;

if (BREVO_API_KEY) {
  try {
    // Create API instance and set authentication
    apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);
    console.log('[Email] Brevo API initialized successfully');
  } catch (error) {
    console.error('[Email] Failed to initialize Brevo:', error.message);
  }
} else {
  console.warn('[Email] Brevo API key not found in environment');
}

/**
 * Send backup notification email with ZIP attachment
 * @param {string} backupPath - Path to the backup ZIP file
 * @param {string} filename - Name of the backup file
 * @returns {Promise<Object>} Email send result
 */
const sendBackupEmail = async (backupPath, filename) => {
  if (!BREVO_API_KEY) {
    console.warn('[Email] Brevo API key not configured. Skipping email notification.');
    return { success: false, message: 'Brevo not configured' };
  }

  if (!FROM_EMAIL) {
    console.warn('[Email] FROM_EMAIL not configured. Skipping email notification.');
    return { success: false, message: 'From email not configured' };
  }

  if (!ADMIN_EMAIL) {
    console.warn('[Email] ADMIN_EMAIL not configured. Skipping email notification.');
    return { success: false, message: 'Admin email not configured' };
  }

  if (!apiInstance) {
    console.warn('[Email] Brevo API instance not initialized.');
    return { success: false, message: 'Brevo not initialized' };
  }

  try {
    const stats = fs.statSync(backupPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    // Read file and convert to base64
    const attachment = fs.readFileSync(backupPath).toString('base64');

    // Extract date from filename (yyyy-mm-dd-backup.zip)
    const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `Daily DB Backup - ${date}`;
    sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
    sendSmtpEmail.to = [{ email: ADMIN_EMAIL }];
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">✅ Database Backup Completed</h2>
        <p>Your daily database backup has been completed successfully.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Backup Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li>📁 <strong>Filename:</strong> ${filename}</li>
            <li>💾 <strong>Size:</strong> ${fileSizeMB} MB</li>
            <li>📅 <strong>Date:</strong> ${date}</li>
            <li>🕐 <strong>Time:</strong> ${new Date().toLocaleString()}</li>
          </ul>
        </div>

        <p>The backup file contains:</p>
        <ul>
          <li>PostgreSQL database (users, pose_data)</li>
          <li>MongoDB collections (images metadata)</li>
          <li>Backup metadata</li>
        </ul>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated backup notification from POSEIFY Backend.
        </p>
      </div>
    `;
    sendSmtpEmail.textContent = `Database backup completed successfully.\n\nBackup Details:\n- Filename: ${filename}\n- Size: ${fileSizeMB} MB\n- Date: ${date}\n\nThe backup file is attached to this email.`;
    sendSmtpEmail.attachment = [
      {
        content: attachment,
        name: filename
      }
    ];

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`[Email] Backup notification sent to ${ADMIN_EMAIL} (Message ID: ${response.messageId})`);
    
    return {
      success: true,
      messageId: response.messageId,
      recipient: ADMIN_EMAIL
    };

  } catch (error) {
    console.error('[Email] Failed to send backup notification:', error.message);
    if (error.response) {
      console.error('[Email] Brevo error:', JSON.stringify(error.response.body));
    }
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send backup notification with download link (no attachment)
 * Useful for large backups that exceed email attachment limits
 * @param {string} filename - Name of the backup file
 * @param {string} downloadUrl - URL to download the backup
 * @returns {Promise<Object>} Email send result
 */
const sendBackupLinkEmail = async (filename, downloadUrl) => {
  if (!BREVO_API_KEY || !FROM_EMAIL || !ADMIN_EMAIL) {
    console.warn('[Email] Brevo not fully configured. Skipping email notification.');
    return { success: false, message: 'Brevo not configured' };
  }

  if (!apiInstance) {
    console.warn('[Email] Brevo API instance not initialized.');
    return { success: false, message: 'Brevo not initialized' };
  }

  try {
    const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `Daily DB Backup - ${date}`;
    sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
    sendSmtpEmail.to = [{ email: ADMIN_EMAIL }];
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">✅ Database Backup Completed</h2>
        <p>Your daily database backup has been completed successfully.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Backup Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li>📁 <strong>Filename:</strong> ${filename}</li>
            <li>📅 <strong>Date:</strong> ${date}</li>
            <li>🕐 <strong>Time:</strong> ${new Date().toLocaleString()}</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${downloadUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            📥 Download Backup
          </a>
        </div>

        <p style="color: #666; font-size: 12px;">
          Note: This download link requires authentication with your API token.
        </p>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated backup notification from POSEIFY Backend.
        </p>
      </div>
    `;
    sendSmtpEmail.textContent = `Database backup completed successfully.\n\nBackup Details:\n- Filename: ${filename}\n- Date: ${date}\n\nDownload Link: ${downloadUrl}\n\nThis link is valid for authenticated users only.`;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`[Email] Backup link notification sent to ${ADMIN_EMAIL} (Message ID: ${response.messageId})`);
    
    return {
      success: true,
      messageId: response.messageId,
      recipient: ADMIN_EMAIL
    };

  } catch (error) {
    console.error('[Email] Failed to send backup link notification:', error.message);
    if (error.response) {
      console.error('[Email] Brevo error:', JSON.stringify(error.response.body));
    }
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendBackupEmail,
  sendBackupLinkEmail
};
