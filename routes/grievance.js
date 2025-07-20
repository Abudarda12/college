const express = require("express");
const router = express.Router();
const multer = require("multer");
const Grievance = require("../models/Grievance");
const sendEmail = require("../utils/sendEmail");
const transporter = require("../utils/mailer"); // Import the mailer transporter

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// POST route
router.post("/submit-grievance", upload.single("file"), async (req, res) => {
  try {
    const { name, roll, email, department, category, subject, outcome, description } =
      req.body;

    const grievance = new Grievance({
      name,
      roll,
      email,
      department,
      category,
      subject,
      description,
      outcome,
      filePath: req.file ? req.file.path : null,
    });
    
    const savedGrievance = await grievance.save();

    // 📧 Faculty email map (you can also fetch this from DB)
    const facultyEmail = {
      academic: "isha1607102@gmail.com",
      hostel: "psiitd@yahoo.com",
      infrastructure: "abudardaansari66@gmail.com",
      tpo: "amritanshuraushan@gmail.com",
      fees: "deepak77.dst2bih.gov.in"
    };
    // Send email to faculty based on category
    const facultyToEmail =
      facultyEmail[req.body.category] || "abudardarajiya@gmail.com"; // Default email if category not found
    // Send email to faculty
    const mailOptions = {
      from: `"${name}" <abudardaansari66@gmail.com>`, // User ka naam, lekin Gmail aapka hi rahega
      to: facultyToEmail, // Category ke base par email jayegi
      replyTo: email, // User ka email, taki reply kar sakein
      subject: "New Grievance Submitted",
      text: `Grievance by: ${name} (${email})\nDepartment: ${department}\nCategory: ${category}\nSubject: ${subject}\nDescription: ${description}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email Error:", error);
        req.flash(
          "error",
          "Grievance submitted, but failed to notify faculty."
        );
      } else {
        console.log("Email sent: " + info.response);
        req.flash("success", "Grievance submitted and faculty notified.");
      }
    });

   res.render('grievance-submitted', { grievanceId: savedGrievance._id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error submitting grievance");
  }
});

//Track routes
router.get('/track', (req, res) => {
  res.render('track');
});

router.post('/track', async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.body.grievanceId);
    if (!grievance) return res.render('track-result', { grievance: null, error: 'No grievance found with that ID.' });

    res.render('track-result', { grievance, error: null });
  } catch (err) {
    res.render('track-result', { grievance: null, error: 'Invalid grievance ID.' });
  }
});


module.exports = router;
