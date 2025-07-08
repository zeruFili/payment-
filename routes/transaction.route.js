const express = require('express');
const { createTransaction, updateTransactionStatus, getAllTransactions } = require('../controllers/Transaction_Controller'); // Adjust the path as necessary
const { protect, adminValidator } = require('../middleware/authMiddleware'); // Middleware to protect routes and get user info

const router = express.Router();

// Route to create a new transaction
router.post('/', protect, createTransaction);

// Route to update transaction status
router.patch('/:transactionId', protect, adminValidator, updateTransactionStatus);

// Route to get transaction details
router.get('/', protect, adminValidator, getAllTransactions);

module.exports = router;