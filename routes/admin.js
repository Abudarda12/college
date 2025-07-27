const express = require('express');
const router = express.Router();
const Grievance = require('../models/Grievance');
const sendEmail = require('../utils/sendEmail');
const nodemailer = require('nodemailer');
const transporter = require('../utils/mailer');


//middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/admin/login');
}

// Show all grievances
router.get('/admin', isAuthenticated, async (req, res) => {
  try {
    const grievances = await Grievance.find().sort({ createdAt: -1 });
    res.render('admin_dashboard', { grievances });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// View grievance by ID
router.get('/admin/view/:id', isAuthenticated, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    res.render('grievance_details', { grievance });
  } catch (err) {
    console.error(err);
    res.status(404).send('Grievance not found');
  }
});


// Admin dashboard with filter by status
router.get('/admin/dashboard', isAuthenticated, async (req, res) => {
  try {
    const statusFilter = req.query.status || '';
    const query = statusFilter ? { status: statusFilter } : {};
    const grievances = await Grievance.find(query).sort({ createdAt: -1 });
    res.render('admin_dashboard', { grievances, statusFilter });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update grievance status and send email to student
router.post('/admin/update-status/:id', async (req, res) => {
  try {
    // Update status and remarks
    await Grievance.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
      remarks: req.body.remarks // Save remarks too
    });

    // Fetch updated grievance for email
    const grievance = await Grievance.findById(req.params.id);
    if (grievance && grievance.email) {
      const mailStudent = {
        from: `<abudardaansari66@gmail.com>`,
        to: grievance.email,
        subject: "Grievance Status Update",
        text: `Your grievance with ID ${grievance._id} has been updated to status: ${req.body.status}.\nRemarks: ${req.body.remarks || 'No remarks provided.'}`,
      };

      // Make sure transporter is defined and imported correctly
   
      transporter.sendMail(mailStudent, (error, info) => {
        if (error) {
          console.error("Email Error:", error);
          req.flash("error", "Grievance status updated, but failed to notify student.");
        } else {
          console.log("Email sent to student: " + info.response);
          req.flash("success", "Grievance status updated and student notified.");
        }
      });
    }
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating status');
  }
});

module.exports = router;
