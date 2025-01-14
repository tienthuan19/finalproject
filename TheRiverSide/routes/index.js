const express = require('express');
const router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});


// About Page Route
router.get('/about', (req, res) => {
  res.render('about/about'); 
});

router.get('/privacy', (req, res) => {
  res.render('about/privacy'); 
});

router.get('/refund', (req, res) => {
  res.render('about/refund'); 
});

router.get('/term', (req, res) => {
  res.render('about/term'); 
});

module.exports = router;
