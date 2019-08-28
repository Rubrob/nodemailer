require('dotenv').config();
const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
const pug = require('pug');
const checkoutTemplateMedia = require('./checkoutMailer');
const order = require('./checkoutMailer/order');

const app = express()
const PORT = 5000

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
const mailer = message => transporter.sendMail({ ...message }, (err, info) => err ? console.log(err) : console.log(`Email sent: ` + info));

// Loop order to set attachement media
const setAttachementMedia = arr => arr.map((item, index) => ({
  filename: 'orderimg' + index,
  path: item.img,
  cid: 'orderimg' + index
}))


app.post('/', (req, res) => {
  const { email } = req.query
// Read pug template
  fs.readFile('./checkoutMailer/index.pug', 'utf8', (err, data) => {
      if (err) throw err
      const fn = pug.compile(data)

      // Set pug context
      const html = fn({
        email: 'orderowneremail@pug.com',
        address: 'Owner Address St',
        phone: '0507843321',
        order
      })

      const message = {
        to: email, //orderer email
        subject: 'Congratulations! Your order was successfully registred',
        text: `Congratulations! Your order was successfully registred!`,
        attachments: [...checkoutTemplateMedia, ...setAttachementMedia(order)],
        html: html
      }

      mailer(message)
  });

  res.json({ email })
})

app.listen(PORT, () => console.log(`Server on the ${PORT} port`))