const mongoose = require('mongoose');

// Function to generate random alphanumeric order codes
const generateOrderCode = () => {
  return Math.random().toString(36).substring(2, 6).toUpperCase(); // Example: 'A1B2'
};

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  foodItems: [
    {
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
      total: { type: Number },
    },
  ],
  
  totalCost: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  orderCode: { type: String, default: generateOrderCode }, // Randomized alphanumeric code
  statusHistory: [
    {
      status: { type: String, enum: ['Paid', 'Unpaid', 'Canceled'], required: true },
      changedAt: { type: Date, default: Date.now },
    },
  ], // Store all status changes
});

module.exports = mongoose.model('Order', orderSchema);
