var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const indexRouter = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'secret_key', 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://lebuithuan:YW8LmVbhfmXNdIAw@csbu103.mz1bk.mongodb.net/?retryWrites=true&w=majority&appName=CSBU103' }), 
    cookie: { maxAge: 1000 * 60 * 60 * 24 } 
  })
);

app.use(authRoutes);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/', (req, res) => {
  res.render('index', {title: 'Home'});
});


app.use((req, res, next) => {
  res.locals.username = req.session.user ? req.session.user.username : null;
  next();
});


app.get('/contact/contactIndex', (req, res) => {
  res.render('contact/contactIndex'); 
});

const reservationRoutes = require('./routes/reservationRoutes');

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.locals.username = req.session.user ? req.session.user.username : null;
  next();
});


app.use('/', reservationRoutes);

app.get('/reservation/clientInfo', (req, res) => {
  res.render('reservation/clientInfo' , {title: 'Reservation'}); 
});

app.get('/order/form', (req, res) => {
  res.render('order/form'); 
});


const mongoose = require('mongoose');
const contactRoutes = require('./routes/contactRoutes');

const mongoURI = 'mongodb+srv://lebuithuan:YW8LmVbhfmXNdIAw@csbu103.mz1bk.mongodb.net/?retryWrites=true&w=majority&appName=CSBU103';  // Replace with your MongoDB URI

mongoose.connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

app.use('/', contactRoutes); 

const orderRoutes = require('./routes/orderRoutes');
app.use('/', orderRoutes);

const menuRoutes = require('./routes/menuRoutes');
app.use(menuRoutes);

app.get('/reservation', (req, res) => {
  const username = req.session?.username || null; 
  res.render('reservation/clientInfo', { username }); 
});

app.get('/menu/publicMenu', (req, res) => {
  const username = req.session.user ? req.session.user.username : null; 
  res.render('menu/publicMenu', { username }); 
});


const usersRouter = require('./routes/users');
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

