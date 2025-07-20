const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const grievanceRoutes = require('./routes/grievance');
const multer = require('multer');
const ejsMate = require("ejs-mate")
app.engine('ejs', ejsMate); 
const adminRoutes = require('./routes/admin');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('./models/admin');
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/auth');
const flash = require('connect-flash');
const grievanceModel = require("./models/Grievance");
require('dotenv').config();

const db_url = process.env.ATLASDB_URL

// MongoDB connection
mongoose.connect(db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));



// Middleware
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the public directory
path.join(__dirname, "public");  


// Connect MongoDB with session
const store = MongoStore.create({
  mongoUrl: db_url,
  crypto: {
    secret: "yourSecretKey"
  },
  touchAfter: 24 * 3600 // time period in seconds
});
store.on('error', function (e) {
  console.log("Session Store Error", e);
});

// Session middleware
app.use(session({
  store: store,
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  const admin = await Admin.findOne({ username });
  if (!admin) return done(null, false, { message: 'User not found' });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return done(null, false, { message: 'Incorrect password' });

  return done(null, admin);
}));

passport.serializeUser((admin, done) => done(null, admin.id));
passport.deserializeUser(async (id, done) => {
  const admin = await Admin.findById(id);
  done(null, admin);
});


// Flash middleware
app.use(flash());

// Set flash messages as locals
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});


// Routes
app.get('/', (req, res) => {
  res.render('grievance.ejs');
  
});
app.use('/', grievanceRoutes);
app.use('/', adminRoutes);
app.use('/', authRoutes);


// function saveAdmin(){
//   const addAdmin = new Admin({
//     username: "admin123",
//     password: "yourpassword"
//   })
//   const newadmin = addAdmin.save();
//   console.log(newadmin);
// }




// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
