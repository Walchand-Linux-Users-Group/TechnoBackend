const nodemailer = require('nodemailer')
const nodemailerSendgrid = require('nodemailer-sendgrid')
require('dotenv').config()

const sendEmail = async (email, subject, text) => {
    try {
        // let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASS, // generated ethereal password
            
          },
        });
  
      // console.log(smtpConfig);
  
    //   var transporter = nodemailer.createTransport(smtpConfig);
  
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

