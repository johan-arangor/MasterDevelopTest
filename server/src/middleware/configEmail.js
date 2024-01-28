const nodeMailer = require('nodemailer');
require('dotenv').config();

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: '465',
    secure: true, //if port is 465 use true
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASSWORD
    }
});

module.exports = transporter;