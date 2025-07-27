const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use "host" and "port" for other providers
    auth: {
      user: 'abudardaansari66@gmail.com',
      pass: 'zyvpullktnzsjpib', // Not your real password – use App Password if using Gmail
    },
  });

  const mailOptions = {
    from: '"College Grievance" <yourcollegeemail@gmail.com>',
    to,
    subject,
    text,
  };

  const mailStudent = {
    from: '"College Grievance" <yourcollegeemail@gmail.com>',
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailStudent);

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
