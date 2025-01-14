const express = require('express');
const MenuItem = require('../models/menuItem');
const router = express.Router();

// Public Menu Page - Search and View
router.get('/menu/public', async (req, res) => {
  const { search } = req.query; 
  const query = search ? { name: { $regex: search, $options: 'i' } } : {};
  const menuItems = await MenuItem.find(query);
  res.render('menu/publicMenu', { menuItems, search });
});

// Admin Menu Page - Search and Manage
router.get('/menu', async (req, res) => {
  const { search } = req.query; 
  const query = search ? { name: { $regex: search, $options: 'i' } } : {};
  const menuItems = await MenuItem.find(query);
  res.render('menu/adminMenu', { menuItems, search });
});

// Add a new menu item (render form)
router.get('/menu/add', (req, res) => {
  res.render('menu/addMenuItem');
});

router.post('/menu/add', async (req, res) => {
  const { name, description, price, image } = req.body;
  const newMenuItem = new MenuItem({ name, description, price, image });
  await newMenuItem.save();
  res.redirect('/menu');
});

// Edit menu item (render form)
router.get('/menu/edit/:id', async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);
  res.render('menu/editMenuItem', { menuItem });
});

router.post('/menu/edit/:id', async (req, res) => {
  const { name, description, price, image } = req.body;
  await MenuItem.findByIdAndUpdate(req.params.id, { name, description, price, image });
  res.redirect('/menu');
});

// Delete menu item
router.get('/menu/delete/:id', async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.redirect('/menu');
});

module.exports = router;
