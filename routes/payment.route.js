const express = require('express');
const { createCheckoutSession } = require('../controllers/payment.controller'); // Adjust the path as necessary
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to create a checkout session
router.post('/', protect, createCheckoutSession);

module.exports = router;