const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abudardaansari66@gmail.com',
    pass: 'zyvpullktnzsjpib'.replace(/ /g, '') // paste app password here without spaces
  }
});

module.exports = transporter;
