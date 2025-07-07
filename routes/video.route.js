// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');

// Route to create a new video
router.post('/', protect, videoController.createVideo);

// Route to get all videos
router.get('/', videoController.getAllVideos);

// Route to get a specific video by ID
router.get('/:id', videoController.getVideoById);

// Route to update a video by ID
router.put('/:id', protect, videoController.updateVideo);

// Route to delete a video by ID
router.delete('/:id', protect, videoController.deleteVideo);

module.exports = router;