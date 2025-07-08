const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
 
});

module.exports = mongoose.model('Transaction', transactionSchema);