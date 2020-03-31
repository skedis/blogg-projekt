const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// Passport config
require('./config/passport')(passport);

mongoose.connect('mongodb://localhost:27017/blog-projekt', 
{ useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;

// Check connection
db.once('open', () => {
  console.log('Connected to database');
});

// Check for DB errors
db.on('error', (err) => {
  console.log(err);
});

const app = express();

const port = process.env.port || 3000;

app.set('view engine', 'pug'); 

app.use(express.static(path.join(__dirname, 'public'))); 
app.use(bodyParser.urlencoded({ extended: false }));

// Express session setup
app.use(session({
  secret: 'random secret. unimportant rn. who cares. hellllllloOOoOOOooOOoo.',
  resave: true,
  saveUninitialized: true
}));

// Helmet for various security purposes
app.use(helmet())

// Express messages setup
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Pass variables to all requests
app.get('*', (req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  res.locals.user = req.user || null;
  next();
});

// Routes ----------------------------------------------
let indexRoute = require('./routes/index');
let postsRoute = require('./routes/posts');
let authRoute = require('./routes/auth');
app.use(indexRoute)
app.use('/posts', postsRoute)
app.use('/auth', authRoute)

// Start listening for requests
app.listen(port, () => {
  console.log(`Server now listening at http://127.0.0.1:${port}/`);
});
