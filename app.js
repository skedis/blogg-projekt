const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const config = require('./config/database');

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
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

// Set view engine
app.set('view engine', 'pug'); 

// Set public folder
app.use(express.static(path.join(__dirname, 'public'))); 

// Middlewares ----------------------------------------

app.use(bodyParser.urlencoded({ extended: false }));

// Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express messages middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Passport config
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Allow access to the user object when handling other routes
app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes ----------------------------------------------
let indexRoute = require('./routes/index');
let postsRoute = require('./routes/posts');
let usersRoute = require('./routes/users');
app.use(indexRoute)
app.use(postsRoute)
app.use(usersRoute)

// Start listening for requests
app.listen(3000, () => {
  console.log(`Server now listening at http://127.0.0.1:${port}/`);
});
