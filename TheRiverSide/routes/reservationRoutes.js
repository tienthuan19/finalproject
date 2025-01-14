const express = require('express');
const Reservation = require('../models/Reservation'); // Import model
const MenuItem = require('../models/menuItem'); // Import shared menu data
const router = express.Router();

// Render client information form
router.get('/reservation/clientInfo', (req, res) => {
  res.render('reservation/clientInfo', { title: 'Reservation' });
});

// Handle client information submission
router.post('/reservation', (req, res) => {
  const { name, phone, email, date, numPeople, timeArrival } = req.body;

  if (!timeArrival) {
    return res.status(400).send('Time arrival is required.');
  }

  // Store client information and time arrival in session
  req.session.reservationData = { name, phone, email, date, numPeople, timeArrival };

  console.log('Session Data After Client Info:', req.session.reservationData); // Debug log
  res.redirect('/reservation/selectTable'); // Redirect to table selection
});

// Render table selection page
router.get('/reservation/selectTable', async (req, res) => {
  const { date, timeArrival } = req.session.reservationData;
  const reservations = await Reservation.find({ date, timeArrival });
  const bookedTables = reservations.map(res => res.table);

  res.render('reservation/selectTable', { bookedTables });
});

// Handle table selection
router.post('/reservation/selectTable', async (req, res) => {
  const { table } = req.body;
  const { date, timeArrival } = req.session.reservationData;

  if (!table) {
    return res.status(400).send('Table selection is required.');
  }

  // Kiểm tra xem bàn đã được đặt chưa
  const existingReservation = await Reservation.findOne({
    table,
    date,
    timeArrival
  });

  if (existingReservation) {
    return res.status(400).send('This table is already booked for the selected time.');
  }

  req.session.reservationData = {
    ...req.session.reservationData,
    table,
  };

  console.log('Session Data After Adding Table:', req.session.reservationData);
  res.redirect('/reservation/selectFood');
});

router.get('/reservation/selectFood', async (req, res) => {
  const menuItems = await MenuItem.find();
  const reservationData = req.session.reservationData || {};
  console.log('Fetched Menu Items for Reservation:', menuItems);
  res.render('reservation/selectFood', { menuItems, reservationData });
});

// Handle food selection and save to MongoDB
router.post('/reservation/submit', async (req, res) => {
  const foodItemsRaw = req.body.foodItems;
  const reservationData = req.session.reservationData;

  if (!reservationData) {
    console.error('No session data found!');
    return res.status(400).send('Reservation data is missing.');
  }

  const foodItems = [];
  let totalCost = 0;

  for (const id in foodItemsRaw) {
    const quantity = parseInt(foodItemsRaw[id]);
    if (quantity > 0) {
      const menuItem = await MenuItem.findById(id);
      if (menuItem) {
        foodItems.push({
          name: menuItem.name,
          price: menuItem.price,
          quantity: quantity,
          total: menuItem.price * quantity,
        });
        totalCost += menuItem.price * quantity;
      }
    }
  }

  reservationData.foodItems = foodItems;
  reservationData.totalCost = totalCost;

  const newReservation = new Reservation(reservationData);
  await newReservation.save();

  req.session.reservationData = null; 
  res.redirect('/reservation/received');
});


router.get('/reservation/received', (req, res) => {
  res.render('reservation/received');
});


router.get('/reservation/all', async (req, res) => {
  const reservations = await Reservation.find();
  res.render('reservation/allReservations', { reservations });
});

// Delete a specific reservation
router.post('/reservation/delete/:id', async (req, res) => {
  const { id } = req.params;
  await Reservation.findByIdAndDelete(id); // Delete reservation by ID
  res.redirect('/reservation/all'); // Redirect to the list after deletion
});

module.exports = router;
