const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();

// Render the contact form
router.get('/', (req, res) => {
  res.render('index');
});

// Render the contact form (accessible via /contact)
router.get('contact/contactIndex', (req, res) => {
    res.render('contact/contactIndex');  // This renders the contact form page
  });

// Handle form submission
router.post('/submit', (req, res) => {
  const { name, email, phone, message } = req.body;

  const newContact = new Contact({ name, email, phone, message });
  newContact.save()
    .then(() => {
      res.redirect('/contact/thankyou');
    })
    .catch((err) => {
      console.log(err);
      res.send("Error saving contact information.");
    });
});

// Thank you page
router.get('/contact/thankyou', (req, res) => {
  res.render('contact/thankyou');
});

// Display all contacts (for delete functionality)
router.get('/contact/contactView', (req, res) => {
    Contact.find()
      .then(contacts => {
        res.render('contact/contactView', { contacts });  // This renders the contact list
      })
      .catch(err => {
        console.log(err);
        res.send("Error fetching contacts.");
      });
  });
  
// Delete a contact
router.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    Contact.findByIdAndDelete(id)
      .then(() => {
        res.redirect('/contact/contactView');
      })
      .catch(err => {
        console.log(err);
        res.send("Error deleting contact.");
      });
  });

module.exports = router;
