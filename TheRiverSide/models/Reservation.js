const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  numPeople: { type: Number, required: true },
  table: { type: String, required: true },
  timeArrival: { type: String, required: true },
  foodItems: [
    {
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
      total: { type: Number },
    },
  ],
  
  totalCost: { type: Number, required: true } // Total cost of selected food
});

module.exports = mongoose.model('Reservation', reservationSchema);
