const express = require('express');
const router = express.Router();
const multer = require('multer');
const Grievance = require('../models/Grievance');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// POST route
router.post('/submit-grievance', upload.single('file'), async (req, res) => {
  try {
    const { name, roll, email, department, category, subject, description } = req.body;

    const grievance = new Grievance({
      name,
      roll,
      email,
      department,
      category,
      subject,
      description,
      filePath: req.file ? req.file.path : null
    });

    await grievance.save();
    res.send('<h3>Grievance Submitted Successfully!<br><a href="/">Submit Another</a></h3>');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error submitting grievance');
  }
});

module.exports = router;
