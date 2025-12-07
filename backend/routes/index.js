const express = require('express');
const router = express.Router();

// Import route modules
const poseRoutes = require('./poseRoutes');
const userRoutes = require('./userRoutes');
const backupRoutes = require('./backupRoutes');
const imageRoutes = require('./imageRoutes');

// Use routes
router.use('/poses', poseRoutes);
router.use('/users', userRoutes);
router.use('/backup', backupRoutes);
router.use('/images', imageRoutes);

// Default API route
router.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'POSEIFY API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/users/register',
        login: 'POST /api/users/login',
        profile: 'GET /api/users/me',
        updateProfile: 'PUT /api/users/me',
        changePassword: 'PUT /api/users/change-password',
        myImages: 'GET /api/users/me/images',
        myPoses: 'GET /api/users/me/poses',
        deleteAccount: 'DELETE /api/users/me'
      },
      poses: {
        extractPose: 'POST /api/poses/extract-pose',
        getAllPoses: 'GET /api/poses',
        getPoseById: 'GET /api/poses/:id',
        getPoseByImageId: 'GET /api/poses/image/:imageId',
        deletePose: 'DELETE /api/poses/:id'
      },
      images: {
        getAllImages: 'GET /api/images',
        getImageById: 'GET /api/images/:id',
        deleteImage: 'DELETE /api/images/:id'
      },
      backup: {
        create: 'POST /api/backup/create',
        list: 'GET /api/backup/list',
        download: 'GET /api/backup/download/:filename',
        delete: 'DELETE /api/backup/:filename'
      }
    }
  });
});

module.exports = router;
