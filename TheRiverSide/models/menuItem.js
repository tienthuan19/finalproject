const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // URL of the food image
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;
