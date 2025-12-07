const { spawn } = require('child_process');
const path = require('path');

class PoseService {
  constructor() {
    this.pythonScript = path.join(__dirname, '..', '..', 'python', 'pose_extractor.py');
  }

  /**
   * Extract pose landmarks from an image or video file
   * @param {string} filePath - Path to the image/video file
   * @returns {Promise} - Resolves with pose data
   */
  async extractPose(filePath) {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [this.pythonScript, filePath]);

      let dataString = '';
      let errorString = '';

      pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process exited with code ${code}: ${errorString}`));
        } else {
          try {
            const result = JSON.parse(dataString);
            resolve(result);
          } catch (error) {
            reject(new Error(`Failed to parse Python output: ${error.message}`));
          }
        }
      });

      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });
    });
  }

  /**
   * Compare two poses and return similarity score
   * @param {Object} pose1 - First pose data
   * @param {Object} pose2 - Second pose data
   * @returns {number} - Similarity score (0-100)
   */
  comparePoses(pose1, pose2) {
    // TODO: Implement pose comparison algorithm
    // This is a placeholder
    return 0;
  }
}

module.exports = new PoseService();
