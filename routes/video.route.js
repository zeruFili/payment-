// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// Route to create a new video
router.post('/', videoController.createVideo);

// Route to get all videos
router.get('/', videoController.getAllVideos);

// Route to get a specific video by ID
router.get('/:id', videoController.getVideoById);

module.exports = router;