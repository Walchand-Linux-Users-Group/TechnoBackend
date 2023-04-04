const nodemailer = require('nodemailer')
const sendEmail = async (email, subject, text) => {
    try {
        // let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: "harshkarwa0765@gmail.com", // generated ethereal user
            pass: "Harsh1345", // generated ethereal password
          },
        });
  
      // console.log(smtpConfig);
  
    //   var transporter = nodemailer.createTransport(smtpConfig);
  
      await transporter.sendMail({
        from: 'harshkarwa1345@gmail.com',
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

