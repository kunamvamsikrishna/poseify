const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sql');

/**
 * PoseData Model
 * Stores all 33 MediaPipe Pose landmarks as individual columns
 * Each landmark has 4 properties: x, y, z, visibility
 */
const PoseData = sequelize.define('PoseData', {
  // Primary Key
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Auto-incrementing primary key'
  },

  // Foreign Key References
  image_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Reference to the image/video source',
    index: true
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Reference to the user who uploaded this pose',
    index: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },

  // Landmark 0: NOSE
  nose_x: { type: DataTypes.FLOAT, allowNull: true },
  nose_y: { type: DataTypes.FLOAT, allowNull: true },
  nose_z: { type: DataTypes.FLOAT, allowNull: true },
  nose_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 1: LEFT_EYE_INNER
  left_eye_inner_x: { type: DataTypes.FLOAT, allowNull: true },
  left_eye_inner_y: { type: DataTypes.FLOAT, allowNull: true },
  left_eye_inner_z: { type: DataTypes.FLOAT, allowNull: true },
  left_eye_inner_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 2: LEFT_EYE
  left_eye_x: { type: DataTypes.FLOAT, allowNull: true },
  left_eye_y: { type: DataTypes.FLOAT, allowNull: true },
  left_eye_z: { type: DataTypes.FLOAT, allowNull: true },
  left_eye_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 3: LEFT_EYE_OUTER
  left_eye_outer_x: { type: DataTypes.FLOAT, allowNull: true },
  left_eye_outer_y: { type: DataTypes.FLOAT, allowNull: true },
  left_eye_outer_z: { type: DataTypes.FLOAT, allowNull: true },
  left_eye_outer_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 4: RIGHT_EYE_INNER
  right_eye_inner_x: { type: DataTypes.FLOAT, allowNull: true },
  right_eye_inner_y: { type: DataTypes.FLOAT, allowNull: true },
  right_eye_inner_z: { type: DataTypes.FLOAT, allowNull: true },
  right_eye_inner_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 5: RIGHT_EYE
  right_eye_x: { type: DataTypes.FLOAT, allowNull: true },
  right_eye_y: { type: DataTypes.FLOAT, allowNull: true },
  right_eye_z: { type: DataTypes.FLOAT, allowNull: true },
  right_eye_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 6: RIGHT_EYE_OUTER
  right_eye_outer_x: { type: DataTypes.FLOAT, allowNull: true },
  right_eye_outer_y: { type: DataTypes.FLOAT, allowNull: true },
  right_eye_outer_z: { type: DataTypes.FLOAT, allowNull: true },
  right_eye_outer_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 7: LEFT_EAR
  left_ear_x: { type: DataTypes.FLOAT, allowNull: true },
  left_ear_y: { type: DataTypes.FLOAT, allowNull: true },
  left_ear_z: { type: DataTypes.FLOAT, allowNull: true },
  left_ear_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 8: RIGHT_EAR
  right_ear_x: { type: DataTypes.FLOAT, allowNull: true },
  right_ear_y: { type: DataTypes.FLOAT, allowNull: true },
  right_ear_z: { type: DataTypes.FLOAT, allowNull: true },
  right_ear_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 9: MOUTH_LEFT
  mouth_left_x: { type: DataTypes.FLOAT, allowNull: true },
  mouth_left_y: { type: DataTypes.FLOAT, allowNull: true },
  mouth_left_z: { type: DataTypes.FLOAT, allowNull: true },
  mouth_left_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 10: MOUTH_RIGHT
  mouth_right_x: { type: DataTypes.FLOAT, allowNull: true },
  mouth_right_y: { type: DataTypes.FLOAT, allowNull: true },
  mouth_right_z: { type: DataTypes.FLOAT, allowNull: true },
  mouth_right_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 11: LEFT_SHOULDER
  left_shoulder_x: { type: DataTypes.FLOAT, allowNull: true },
  left_shoulder_y: { type: DataTypes.FLOAT, allowNull: true },
  left_shoulder_z: { type: DataTypes.FLOAT, allowNull: true },
  left_shoulder_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 12: RIGHT_SHOULDER
  right_shoulder_x: { type: DataTypes.FLOAT, allowNull: true },
  right_shoulder_y: { type: DataTypes.FLOAT, allowNull: true },
  right_shoulder_z: { type: DataTypes.FLOAT, allowNull: true },
  right_shoulder_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 13: LEFT_ELBOW
  left_elbow_x: { type: DataTypes.FLOAT, allowNull: true },
  left_elbow_y: { type: DataTypes.FLOAT, allowNull: true },
  left_elbow_z: { type: DataTypes.FLOAT, allowNull: true },
  left_elbow_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 14: RIGHT_ELBOW
  right_elbow_x: { type: DataTypes.FLOAT, allowNull: true },
  right_elbow_y: { type: DataTypes.FLOAT, allowNull: true },
  right_elbow_z: { type: DataTypes.FLOAT, allowNull: true },
  right_elbow_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 15: LEFT_WRIST
  left_wrist_x: { type: DataTypes.FLOAT, allowNull: true },
  left_wrist_y: { type: DataTypes.FLOAT, allowNull: true },
  left_wrist_z: { type: DataTypes.FLOAT, allowNull: true },
  left_wrist_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 16: RIGHT_WRIST
  right_wrist_x: { type: DataTypes.FLOAT, allowNull: true },
  right_wrist_y: { type: DataTypes.FLOAT, allowNull: true },
  right_wrist_z: { type: DataTypes.FLOAT, allowNull: true },
  right_wrist_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 17: LEFT_PINKY
  left_pinky_x: { type: DataTypes.FLOAT, allowNull: true },
  left_pinky_y: { type: DataTypes.FLOAT, allowNull: true },
  left_pinky_z: { type: DataTypes.FLOAT, allowNull: true },
  left_pinky_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 18: RIGHT_PINKY
  right_pinky_x: { type: DataTypes.FLOAT, allowNull: true },
  right_pinky_y: { type: DataTypes.FLOAT, allowNull: true },
  right_pinky_z: { type: DataTypes.FLOAT, allowNull: true },
  right_pinky_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 19: LEFT_INDEX
  left_index_x: { type: DataTypes.FLOAT, allowNull: true },
  left_index_y: { type: DataTypes.FLOAT, allowNull: true },
  left_index_z: { type: DataTypes.FLOAT, allowNull: true },
  left_index_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 20: RIGHT_INDEX
  right_index_x: { type: DataTypes.FLOAT, allowNull: true },
  right_index_y: { type: DataTypes.FLOAT, allowNull: true },
  right_index_z: { type: DataTypes.FLOAT, allowNull: true },
  right_index_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 21: LEFT_THUMB
  left_thumb_x: { type: DataTypes.FLOAT, allowNull: true },
  left_thumb_y: { type: DataTypes.FLOAT, allowNull: true },
  left_thumb_z: { type: DataTypes.FLOAT, allowNull: true },
  left_thumb_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 22: RIGHT_THUMB
  right_thumb_x: { type: DataTypes.FLOAT, allowNull: true },
  right_thumb_y: { type: DataTypes.FLOAT, allowNull: true },
  right_thumb_z: { type: DataTypes.FLOAT, allowNull: true },
  right_thumb_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 23: LEFT_HIP
  left_hip_x: { type: DataTypes.FLOAT, allowNull: true },
  left_hip_y: { type: DataTypes.FLOAT, allowNull: true },
  left_hip_z: { type: DataTypes.FLOAT, allowNull: true },
  left_hip_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 24: RIGHT_HIP
  right_hip_x: { type: DataTypes.FLOAT, allowNull: true },
  right_hip_y: { type: DataTypes.FLOAT, allowNull: true },
  right_hip_z: { type: DataTypes.FLOAT, allowNull: true },
  right_hip_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 25: LEFT_KNEE
  left_knee_x: { type: DataTypes.FLOAT, allowNull: true },
  left_knee_y: { type: DataTypes.FLOAT, allowNull: true },
  left_knee_z: { type: DataTypes.FLOAT, allowNull: true },
  left_knee_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 26: RIGHT_KNEE
  right_knee_x: { type: DataTypes.FLOAT, allowNull: true },
  right_knee_y: { type: DataTypes.FLOAT, allowNull: true },
  right_knee_z: { type: DataTypes.FLOAT, allowNull: true },
  right_knee_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 27: LEFT_ANKLE
  left_ankle_x: { type: DataTypes.FLOAT, allowNull: true },
  left_ankle_y: { type: DataTypes.FLOAT, allowNull: true },
  left_ankle_z: { type: DataTypes.FLOAT, allowNull: true },
  left_ankle_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 28: RIGHT_ANKLE
  right_ankle_x: { type: DataTypes.FLOAT, allowNull: true },
  right_ankle_y: { type: DataTypes.FLOAT, allowNull: true },
  right_ankle_z: { type: DataTypes.FLOAT, allowNull: true },
  right_ankle_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 29: LEFT_HEEL
  left_heel_x: { type: DataTypes.FLOAT, allowNull: true },
  left_heel_y: { type: DataTypes.FLOAT, allowNull: true },
  left_heel_z: { type: DataTypes.FLOAT, allowNull: true },
  left_heel_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 30: RIGHT_HEEL
  right_heel_x: { type: DataTypes.FLOAT, allowNull: true },
  right_heel_y: { type: DataTypes.FLOAT, allowNull: true },
  right_heel_z: { type: DataTypes.FLOAT, allowNull: true },
  right_heel_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 31: LEFT_FOOT_INDEX
  left_foot_index_x: { type: DataTypes.FLOAT, allowNull: true },
  left_foot_index_y: { type: DataTypes.FLOAT, allowNull: true },
  left_foot_index_z: { type: DataTypes.FLOAT, allowNull: true },
  left_foot_index_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Landmark 32: RIGHT_FOOT_INDEX
  right_foot_index_x: { type: DataTypes.FLOAT, allowNull: true },
  right_foot_index_y: { type: DataTypes.FLOAT, allowNull: true },
  right_foot_index_z: { type: DataTypes.FLOAT, allowNull: true },
  right_foot_index_visibility: { type: DataTypes.FLOAT, allowNull: true },

  // Summary/Metadata
  summary: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Optional summary or notes about this pose data'
  }

}, {
  tableName: 'pose_data',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // Only track creation time
  indexes: [
    {
      name: 'idx_image_id',
      fields: ['image_id']
    },
    {
      name: 'idx_created_at',
      fields: ['created_at']
    }
  ],
  comment: 'Stores all 33 MediaPipe Pose landmarks as individual columns'
});

/**
 * Helper method to insert pose data from MediaPipe landmarks array
 * @param {string} imageId - Reference to image/video
 * @param {Array} landmarks - Array of 33 landmarks from MediaPipe
 * @param {string} summary - Optional summary
 * @param {number} userId - User ID who uploaded this pose
 * @returns {Promise} Created pose data record
 */
PoseData.createFromLandmarks = async function(imageId, landmarks, summary = null, userId = null) {
  if (!landmarks || landmarks.length !== 33) {
    throw new Error('Invalid landmarks: Expected array of 33 landmarks');
  }

  const landmarkNames = [
    'nose', 'left_eye_inner', 'left_eye', 'left_eye_outer',
    'right_eye_inner', 'right_eye', 'right_eye_outer',
    'left_ear', 'right_ear', 'mouth_left', 'mouth_right',
    'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
    'left_wrist', 'right_wrist', 'left_pinky', 'right_pinky',
    'left_index', 'right_index', 'left_thumb', 'right_thumb',
    'left_hip', 'right_hip', 'left_knee', 'right_knee',
    'left_ankle', 'right_ankle', 'left_heel', 'right_heel',
    'left_foot_index', 'right_foot_index'
  ];

  const data = { image_id: imageId, summary, user_id: userId };

  landmarks.forEach((landmark, index) => {
    const name = landmarkNames[index];
    data[`${name}_x`] = landmark.x;
    data[`${name}_y`] = landmark.y;
    data[`${name}_z`] = landmark.z;
    data[`${name}_visibility`] = landmark.visibility;
  });

  return await this.create(data);
};

/**
 * Helper method to get landmarks in array format
 * @returns {Array} Array of 33 landmarks
 */
PoseData.prototype.toLandmarksArray = function() {
  const landmarkNames = [
    'nose', 'left_eye_inner', 'left_eye', 'left_eye_outer',
    'right_eye_inner', 'right_eye', 'right_eye_outer',
    'left_ear', 'right_ear', 'mouth_left', 'mouth_right',
    'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
    'left_wrist', 'right_wrist', 'left_pinky', 'right_pinky',
    'left_index', 'right_index', 'left_thumb', 'right_thumb',
    'left_hip', 'right_hip', 'left_knee', 'right_knee',
    'left_ankle', 'right_ankle', 'left_heel', 'right_heel',
    'left_foot_index', 'right_foot_index'
  ];

  return landmarkNames.map(name => ({
    x: this[`${name}_x`],
    y: this[`${name}_y`],
    z: this[`${name}_z`],
    visibility: this[`${name}_visibility`]
  }));
};

module.exports = PoseData;
