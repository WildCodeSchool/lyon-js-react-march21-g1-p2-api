const express = require('express');

const app = express();
require('dotenv').config();
// const nodemailer = require('nodemailer');

const port = 4444;

app.listen(port, () => {
    console.log(`app is live on ${port}`)
  })

  app.use('sendtome', require('./routes/sendToMe'))