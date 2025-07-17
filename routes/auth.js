const express = require('express');
const router = express.Router();
const passport = require('passport');
const Admin = require('../models/admin');

// GET login form
router.get('/admin/login', (req, res) => {
  res.render('admin_login');
});



// POST login form
router.post('/admin/login', passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/admin/login'
}));

// Logout
router.get('/admin/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/admin/login');
  });
});

module.exports = router;
