const express = require('express');
const User = require('../models/User');
const Contact = require('../models/Contact');

const Reservation = require('../models/Reservation');
const MenuItem = require('../models/menuItem');
const bcrypt = require('bcryptjs');
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).send('Access denied. Admins only.');
}

router.get('/', (req, res) => {
  const username = req.session.user ? req.session.user.username : null; 
  res.render('index', { username }); 
});

// Render register page
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Handle registration
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  // Prevent registration of admin
  if (username === 'admin') {
    return res.status(400).send('The username "admin" is reserved.');
  }

  const user = new User({ username, password, role });
  await user.save();
  res.redirect('/login');
});

// Render Login Page
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Handle Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    req.session.user = { username: 'admin', role: 'admin' };
    return res.redirect('/admin');
  }

  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid username or password.');
  }

  req.session.user = { id: user._id, username: user.username, role: user.role };
  res.redirect('/');
});

// Handle Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Error logging out.');
    }
    res.redirect('/'); // Go back to the index page
  });
});

// Admin Dashboard
router.get('/admin', isAdmin, (req, res) => {
  res.render('admin/dashboard', { username: req.session.user.username });
});

// Contact Management
router.get('/contact/contactView', isAdmin, async (req, res) => {
  const contacts = await Contact.find();
  res.render('contact/contactView', { contacts });
});

// Order Management
router.get('/order/allOrder', isAdmin, async (req, res) => {
  const orders = await Order.find();
  res.render('order/allOrder', { orders });
});

// Reservation Management
router.get('/reservation/allReservation', isAdmin, async (req, res) => {
  const reservations = await Reservation.find();
  res.render('reservation/allReservation', { reservations });
});

// Menu Management
router.get('/menu/adminMenu', isAdmin, async (req, res) => {
  const menuItems = await MenuItem.find();
  res.render('menu/adminMenu', { menuItems });
});

module.exports = router;
