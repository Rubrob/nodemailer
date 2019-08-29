require('dotenv').config();
const express = require('express');
const fs = require('fs');
const mailer = require('./mailer');
const pug = require('pug');
const checkoutTemplateMedia = require('./checkoutMailer');
const order = require('./checkoutMailer/order');

const app = express()
const PORT = 5000

// Loop order to set attachement media
const setAttachementMedia = arr => arr.map((item, index) => ({
  filename: 'orderimg' + index,
  path: item.img,
  cid: 'orderimg' + index
}))

app.post('/:email', (req, res) => {
  const { email } = req.params

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

      mailer.send(message)
  });

  res.json({ email })
})

app.listen(PORT, () => console.log(`Server on the ${PORT} port`))