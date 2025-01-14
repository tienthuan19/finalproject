const mongoose = require('mongoose');

// Define the contact schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ // Optional regex for email validation
  },
  phone: {
    type: String,
    required: true,  // Ensure phone is required
  },
  message: {
    type: String,
    required: true,
  },
});

// Create a model based on the schema
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
