// controllers/videoController.js
const Video = require('../models/video.model');
const User = require('../models/user.model');

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

// Get all videos with user details
exports.getAllVideos = async (req, res) => {
    try {
        // Find all videos
        const videos = await Video.find();

        if (videos.length === 0) {
            return res.status(404).json({ message: 'No videos found' });
        }

        // Create an array of user IDs from the found videos
        const userIds = videos.map(video => video.userId);

        // Find users by the collected user IDs
        const users = await User.find({ _id: { $in: userIds } });

        // Create a mapping of user IDs to names
        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = `${user.first_name} ${user.last_name}`;
        });

        // Map the response to include desired fields
        const response = videos.map(video => ({
            _id: video._id,
            name: userMap[video.userId] || 'Unknown User', // Combine first name and last name
            youtubeURL: video.youtubeURL,
            videoName: video.videoName,
            createdAt: video.createdAt,
            status: video.status,
            message: video.message
        }));

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving videos', error: error.message });
    }
};

// Get videos by user ID
exports.getUserVideos = async (req, res) => {
    try {
        
        const userId = req.user._id; 

        // Find videos for the specified user
        const videos = await Video.find({ userId });

        if (videos.length === 0) {
            return res.status(404).json({ message: 'No videos found for this user' });
        }

        // Map the response to include desired fields
        const response = videos.map(video => ({
            _id: video._id,
            youtubeURL: video.youtubeURL,
            videoName: video.videoName,
            createdAt: video.createdAt,
            message: video.message,
            status: video.status,
        }));

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving user videos', error: error.message });
    }
};

// Get a specific video by ID with user details
exports.getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Find the user associated with the video
        const user = await User.findById(video.userId);

        const response = {
            _id: video._id,
            name: user ? `${user.first_name} ${user.last_name}` : 'Unknown User', // Get user name
            youtubeURL: video.youtubeURL,
            videoName: video.videoName,
            createdAt: video.createdAt,
             message: video.message,
            status: video.status,
        };

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving video', error: error.message });
    }
};
exports.getAvailableVideos = async (req, res) => {
    try {
        // Find available videos
        const videos = await Video.find({ status: 'available' });

        if (videos.length === 0) {
            return res.status(404).json({ message: 'No available videos found' });
        }

        // Create an array of user IDs from the found videos
        const userIds = videos.map(video => video.userId);

        // Find users by the collected user IDs
        const users = await User.find({ _id: { $in: userIds } });

        // Create a mapping of user IDs to names
        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = `${user.first_name} ${user.last_name}`;
        });

        // Map the response to include desired fields
        const response = videos.map(video => ({
            _id: video._id,
            name: userMap[video.userId] || 'Unknown User', // Combine first name and last name
            youtubeURL: video.youtubeURL,
            videoName: video.videoName,
            createdAt: video.createdAt,
             message: video.message,
            status: video.status,
        }));

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving videos', error: error.message });
    }
};

// Update a video entry (creator can update all except status, admin can update status)
exports.updateVideoWithRoleCheck = async (req, res) => {
    try {
        const { youtubeURL, videoName, message, status } = req.body;
        const userId = req.user._id;  // Use user ID from the request
        const userRole = req.user.role; // Assume user role is available in req.user

        console.log("User role:", userRole);

        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Check if the requester is the creator or has admin role
        if (video.userId.toString() !== userId.toString() && userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this video' });
        }

        // Prepare update object
        const updateData = { youtubeURL, videoName, message };

        // If the user is an admin, allow updating the status
        if (userRole === 'admin' && status) {
            updateData.status = status;
        }

        const updatedVideo = await Video.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        return res.status(200).json({ message: 'Video updated successfully', video: updatedVideo });
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

