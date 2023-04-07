const nodemailer = require('nodemailer')
const nodemailerSendgrid = require('nodemailer-sendgrid')
require('dotenv').config()

const sendEmail = async (email, subject, text) => {
    try {
        // let testAccount = await nodemailer.createTestAccount()
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL, 
            pass: process.env.PASS,
            
          },
        });
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: text,
      });
      console.log("Email Sent Sucessfully");
    } catch (error) {
      console.log("Email Not Sent");
      console.log(error);
    }
  };

module.exports = sendEmail

