const { spawn } = require('child_process');
const path = require('path');

class PythonService {
  constructor() {
    // Path to Python script
    this.pythonScript = process.env.PYTHON_SCRIPT_PATH || 
                       path.join(__dirname, '..', '..', 'python', 'pose_extractor.py');
    
    // Python command - try venv first, then system python
    const venvPython = path.join(__dirname, '..', '..', 'python', 'venv', 'Scripts', 'python.exe');
    this.pythonCommand = process.env.PYTHON_COMMAND || 
                        (require('fs').existsSync(venvPython) ? venvPython : 'python');
    
    console.log(`[PythonService] Using Python: ${this.pythonCommand}`);
  }

  /**
   * Extract pose landmarks from an image file using Python MediaPipe
   * @param {string} imagePath - Absolute path to the image file
   * @returns {Promise<Object>} - Resolves with pose extraction result
   */
  async extractPose(imagePath) {
    return new Promise((resolve, reject) => {
      // Validate input
      if (!imagePath) {
        return reject(new Error('Image path is required'));
      }

      console.log(`[PythonService] Extracting pose from: ${imagePath}`);
      console.log(`[PythonService] Using Python script: ${this.pythonScript}`);

      // Spawn Python process
      const pythonProcess = spawn(this.pythonCommand, [this.pythonScript, imagePath]);

      let dataString = '';
      let errorString = '';

      // Collect stdout data
      pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      // Collect stderr data
      pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
      });

      // Handle process completion
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`[PythonService] Python process exited with code ${code}`);
          console.error(`[PythonService] Error output: ${errorString}`);
          
          return reject(new Error(
            `Python process failed with code ${code}: ${errorString || 'Unknown error'}`
          ));
        }

        try {
          // Extract JSON from output (ignore download messages and other non-JSON lines)
          const jsonMatch = dataString.match(/\{[\s\S]*\}/);
          
          if (!jsonMatch) {
            throw new Error('No JSON found in output');
          }
          
          const result = JSON.parse(jsonMatch[0]);
          
          console.log(`[PythonService] Successfully extracted ${result.num_landmarks || 0} landmarks`);
          
          resolve(result);
        } catch (parseError) {
          console.error(`[PythonService] Failed to parse Python output`);
          console.error(`[PythonService] Raw output: ${dataString.substring(0, 300)}`);
          
          reject(new Error(
            `Failed to parse Python output: ${parseError.message}`
          ));
        }
      });

      // Handle process errors
      pythonProcess.on('error', (error) => {
        console.error(`[PythonService] Failed to start Python process:`, error);
        
        reject(new Error(
          `Failed to start Python process: ${error.message}. Make sure Python is installed and accessible.`
        ));
      });

      // Set timeout (30 seconds)
      setTimeout(() => {
        pythonProcess.kill();
        reject(new Error('Python process timeout (30s)'));
      }, 30000);
    });
  }

  /**
   * Validate if Python and required packages are available
   * @returns {Promise<boolean>}
   */
  async validateSetup() {
    return new Promise((resolve) => {
      const pythonProcess = spawn(this.pythonCommand, ['-c', 'import cv2, mediapipe; print("OK")']);
      
      let output = '';
      
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0 && output.includes('OK')) {
          console.log('[PythonService] Python setup validated successfully');
          resolve(true);
        } else {
          console.error('[PythonService] Python setup validation failed');
          resolve(false);
        }
      });

      pythonProcess.on('error', () => {
        console.error('[PythonService] Python not found');
        resolve(false);
      });
    });
  }
}

module.exports = new PythonService();
