const mongoose = require('mongoose');

const poseSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  pose_name: {
    type: String,
    required: [true, 'Pose name is required'],
    trim: true,
    maxlength: [100, 'Pose name cannot exceed 100 characters']
  },
  pose_data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    // This will store the keypoints/landmarks data from mediapipe
    // Example structure: { landmarks: [], confidence: 0.95 }
  },
  image_url: {
    type: String,
    trim: true
  },
  video_url: {
    type: String,
    trim: true
  },
  duration: {
    type: Number, // in seconds
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: [{
    type: String,
    trim: true
  }],
  is_public: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'poses'
});

// Indexes
poseSchema.index({ user_id: 1 });
poseSchema.index({ pose_name: 'text' });
poseSchema.index({ created_at: -1 });

const Pose = mongoose.model('Pose', poseSchema);

module.exports = Pose;
