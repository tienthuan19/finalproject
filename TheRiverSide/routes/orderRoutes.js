const express = require('express');
const Order = require('../models/order');
const MenuItem = require('../models/menuItem'); 
const router = express.Router();

router.get('/order', async (req, res) => {
  const menuItems = await MenuItem.find();
  console.log('Fetched Menu Items for Order:', menuItems);
  res.render('order/form', { menuItems }); 
});

router.post('/order/submit', async (req, res) => {
  const { name, phone, address } = req.body;
  const foodItemsRaw = req.body.foodItems; 

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

  // Save the order
  const newOrder = new Order({ name, phone, address, foodItems, totalCost });
  await newOrder.save();

  res.redirect('/order/received');
});

// Render order received page
router.get('/order/received', (req, res) => {
  res.render('order/orderThankyou');
});

// Display all orders (for admin)
router.get('/order/all', async (req, res) => {
  const orders = await Order.find();
  res.render('order/allOrder', { orders });
});

// Update order status
router.get('/order/status/:id/:status', async (req, res) => {
  const { id, status } = req.params;

  // Validate the status
  if (!['Paid', 'Unpaid', 'Canceled'].includes(status)) {
    return res.status(400).send('Invalid status.');
  }

  // Find the order
  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).send('Order not found.');
  }

  // Add the new status to the history
  order.statusHistory.push({ status, changedAt: new Date() });

  // Save the updated order
  await order.save();

  res.redirect('/order/all');
});

// Search Orders
router.get('/order/search', async (req, res) => {
  const query = req.query.query; 
  console.log('Search Query:', query); 

  
  const orders = await Order.find({
    $or: [
      { name: { $regex: query, $options: 'i' } }, 
      { orderCode: { $regex: query, $options: 'i' } }, 
    ],
  });

  console.log('Found Orders:', orders); 
  res.render('order/searchResults', { orders, query });
});

// Delete order
router.get('/order/delete/:id', async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndDelete(id);
  res.redirect('/order/all');
});

module.exports = router;
