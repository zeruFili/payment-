const Transaction = require('../models/transaction.model'); // Adjust the path as necessary
const User = require('../models/user.model'); // Adjust the path as necessary
const request = require('request');

const createTransaction = async (req, res) => {
    try {
        const { amount, receiver, description } = req.body;
        const sender = req.user._id; // Get sender ID from authenticated user

        if (!amount || !receiver) {
            return res.status(400).json({ message: "Please provide all required fields: amount, receiver" });
        }

        // Create transaction
        const transaction = await Transaction.create({
            sender,
            amount,
            receiver,
            description,
        });

        return res.status(201).json(transaction);
    } catch (error) {
        return res.status(500).json({ message: "Failed to create transaction", error: error.message });
    }
};

const getMyTransactions = async (req, res) => {
    try { 
        const sender = req.user._id; 
        const transactions = await Transaction.find({sender})
            .populate('sender', 'first_name last_name')
            .populate('receiver', 'first_name last_name')
            .sort({ createdAt: -1 });

        if (transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found" });
        }

        const response = transactions.map(transaction => ({
            _id: transaction._id,
            amount: transaction.amount,
            status: transaction.status,
            sender: {
                first_name: transaction.sender.first_name,
                last_name: transaction.sender.last_name,
            },
            receiver: {
                first_name: transaction.receiver.first_name,
                last_name: transaction.receiver.last_name,
            },
            description: transaction.description,
            createdAt: transaction.createdAt,

        }));

        return res.json(response);
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve transactions", error: error.message });
    }
};


const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('sender', 'first_name last_name')
            .populate('receiver', 'first_name last_name')
            .sort({ createdAt: -1 });

        if (transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found" });
        }

        const response = transactions.map(transaction => ({
            _id: transaction._id,
            amount: transaction.amount,
            status: transaction.status,
            sender: {
                first_name: transaction.sender.first_name,
                last_name: transaction.sender.last_name,
            },
            receiver: {
                first_name: transaction.receiver.first_name,
                last_name: transaction.receiver.last_name,
            },
            description: transaction.description,
            createdAt: transaction.createdAt,

        }));

        return res.json(response);
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve transactions", error: error.message });
    }
};

module.exports = {
    createTransaction,
    getAllTransactions,
};