require('dotenv').config();
const nodemailer = require('nodemailer');

// Transparter Setup
const transporter = nodemailer.createTransport(
  {
    pool: true,
    maxConnections: 10,
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.CLIENT_SMPT_EMAIL, // set your SMTP email
      pass: process.env.CLIENT_SMPT_PASSWORD // set your SMTP password
    }
  },
  {
    from: `E-Store <${process.env.CLIENT_SMPT_EMAIL}>`,
  }
)

// Create transporter mailer function
const send = message => transporter.sendMail({ ...message }, (err, info) => {
  return err ? console.log(err) : console.log(`Email sent: ` + info)
})

module.exports.send = send