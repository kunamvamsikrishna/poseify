const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true
  },
  original_name: {
    type: String,
    required: [true, 'Original name is required'],
    trim: true
  },
  file_path: {
    type: String,
    required: false,
    trim: true
  },
  image_url: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  cloudinary_public_id: {
    type: String,
    trim: true
  },
  file_size: {
    type: Number,
    required: true,
    min: 0
  },
  mime_type: {
    type: String,
    required: true,
    trim: true
  },
  width: {
    type: Number,
    min: 0
  },
  height: {
    type: Number,
    min: 0
  },
  user_id: {
    type: Number,
    default: null,
    index: true
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'processed', 'failed'],
    default: 'uploaded'
  },
  pose_extracted: {
    type: Boolean,
    default: false
  },
  sql_record_id: {
    type: Number,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'images'
});

// Indexes
imageSchema.index({ filename: 1 });
imageSchema.index({ status: 1 });
imageSchema.index({ created_at: -1 });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
