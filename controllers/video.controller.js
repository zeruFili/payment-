// controllers/videoController.js
const Video = require('../models/Video');

// Create a new video entry
exports.createVideo = async (req, res) => {
    try {
        const { youtubeURL, videoName, message } = req.body;
        const userId = req.user._id;  // Use user ID from the request

        const video = new Video({ userId, youtubeURL, videoName, message });
        await video.save();

        return res.status(201).json({ message: 'Video created successfully', video });
    } catch (error) {
        return res.status(400).json({ message: 'Error creating video', error: error.message });
    }
};

// Get all videos
exports.getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate('userId', 'username'); 
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

// Update a video entry
exports.updateVideo = async (req, res) => {
    try {
        const { youtubeURL, videoName, message } = req.body;
        const userId = req.user._id;  // Use user ID from the request

        const video = await Video.findByIdAndUpdate(
            req.params.id,
            { userId, youtubeURL, videoName, message },
            { new: true, runValidators: true } // Return the updated video and run validators
        );

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        return res.status(200).json({ message: 'Video updated successfully', video });
    } catch (error) {
        return res.status(400).json({ message: 'Error updating video', error: error.message });
    }
};

// Delete a video entry
exports.deleteVideo = async (req, res) => {
    try {
        const userId = req.user._id;  // Use user ID from the request

        const video = await Video.findOneAndDelete({ _id: req.params.id, userId });

        if (!video) {
            return res.status(404).json({ message: 'Video not found or not authorized' });
        }

        return res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting video', error: error.message });
    }
};