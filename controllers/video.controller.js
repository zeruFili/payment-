// controllers/videoController.js
const Video = require('../models/Video');

// Create a new video entry
exports.createVideo = async (req, res) => {
    try {
        const { userId, youtubeURL, videoName, amount, message } = req.body;

        const video = new Video({ userId, youtubeURL, videoName, amount, message });
        await video.save();

        return res.status(201).json({ message: 'Video created successfully', video });
    } catch (error) {
        return res.status(400).json({ message: 'Error creating video', error: error.message });
    }
};

// Get all videos
exports.getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate('userId', 'username'); // Optionally populate user details
        return res.status(200).json(videos);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving videos', error: error.message });
    }
};

// Get a specific video by ID
exports.getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id).populate('userId', 'username');
        
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        return res.status(200).json(video);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving video', error: error.message });
    }
};