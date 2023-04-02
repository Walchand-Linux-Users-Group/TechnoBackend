const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');

const app = express();
const connectMongoDB = require("./db");
const user = require("./user");
const path = require("path");
const template_path = path.join(__dirname, "./template/views");

app.set("view engine", "hbs");
app.set("views", template_path);
//put the connection string here
// const monngodb_url="";
dotenv.config();
connectMongoDB();
app.use(express.urlencoded({ extended: false }));
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(cors());

app.get("/success", (req, res) => {
  res.render("success");
});
app.get("/failure", (req, res) => {
  res.render("failure");
});

app.get('/allUsers', async (req, res) => {
    const users = await user.find();
    res.send({ "Users": users });
})
app.get('/users', async (req, res) => {
    const count = await user.find().count();
    res.send({ "No Of Users": count });
})

app.post("/getData", async (req, res) => {
  try {
    const existing = await user.findOne({ email: req.body.email });
   
    if (existing != null) {
      console.log("invalid email");
      // res.send("email fa  ilure");
      res.render("failure");  
      return;
    }
    const existing2 = await user.findOne({
      transactionId: req.body.transactionId,
    });

    if (existing2 != null) {
      // res.send("transaction id failure");
      // res.render("failure", { message: "Payment ID already used !!!" });
      res.render("failure");
      return;
    }

    let User = new user({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phoneno,
      transactionId: req.body.transactionId,
      collegeName: req.body.collegeName,
      yearOfStudy: req.body.yearOfStudy,
      course: req.body.course,
      isDualBooted: req.body.answer,
    });

    var response = {
      error: "true",
    };
    if (User) {
      response = {
        name: User.name,
        email: User.email,
        error: "false",
        emailSent: "true",
      };

      try {
        let message = ``;
        if (req.body.course === "Frontend") {
          message = `
                    <p>We are reaching out to thank you for registering for our Mega Event <strong>METAMORPHOSIS 2K23</strong> which will be held on January 28th and 29th 2023, at Walchand College of Engineering, Sangli. You have successfully registered for <strong>Go</strong> technology. You will receive more details before the event date. Please feel free to share the event as we want as many talented people as possible. </p>
<p>Thank you again, and have a great day. </p>
<p>For Further Details : </p>
<p>Join the WhatsApp Group : <a href="https://chat.whatsapp.com/H60ujF2U1bLB8RBYeeed9g">(Here)</a></p>

<p>Regards,</br>
Walchand Linux Users' Group</p>

<a href="https://www.instagram.com/wcewlug/" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990838/1_ueuuza.png" height="50em"/></a>
<a href="https://linkedin.com/company/wlug-club" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/2_e25xxl.png" height="50em"/></a>
<a href="https://www.facebook.com/wlugclub" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/3_ew5ope.png" height="50em"/></a>
<a href="https://twitter.com/wcewlug" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/4_csegd1.png" height="50em"/></a>
<a href="http://discord.wcewlug.org/join" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/5_nfvomt.png" height="50em"/></a>
<a href="https://wcewlug.org/" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990835/6_onbyb0.png" height="50em"/></a>
                    `;
        } else if (req.body.course === "Backend") {
          message = `
                    <p>We are reaching out to thank you for registering for our Mega Event <strong>METAMORPHOSIS 2K23</strong> which will be held on January 28th and 29th 2023, at Walchand College of Engineering, Sangli. You have successfully registered for <strong>Docker</strong> technology. You will receive more details before the event date. Please feel free to share the event as we want as many talented people as possible. </p>
<p>Thank you again, and have a great day. </p>
<p>For Further Details : </p>
<p>Join the WhatsApp Group : <a href="https://chat.whatsapp.com/H60ujF2U1bLB8RBYeeed9g">(Here)</a></p>

<p>Regards,</br>
Walchand Linux Users' Group</p>

<a href="https://www.instagram.com/wcewlug/" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990838/1_ueuuza.png" height="50em"/></a>
<a href="https://linkedin.com/company/wlug-club" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/2_e25xxl.png" height="50em"/></a>
<a href="https://www.facebook.com/wlugclub" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/3_ew5ope.png" height="50em"/></a>
<a href="https://twitter.com/wcewlug" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/4_csegd1.png" height="50em"/></a>
<a href="http://discord.wcewlug.org/join" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/5_nfvomt.png" height="50em"/></a>
<a href="https://wcewlug.org/" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990835/6_onbyb0.png" height="50em"/></a>
                    `;
        } else {
          message = `
                    <p>We are reaching out to thank you for registering for our Mega Event <strong>METAMORPHOSIS 2K23</strong> which will be held on January 28th and 29th 2023, at Walchand College of Engineering, Sangli. You have successfully registered for <strong>Both Go and Docker</strong> technologies. You will receive more details before the event date. Please feel free to share the event as we want as many talented people as possible. </p>
<p>Thank you again, and have a great day. </p>
<p>For Further Details : </p>
<p>Join the WhatsApp Group : <a href="https://chat.whatsapp.com/H60ujF2U1bLB8RBYeeed9g">(Here)</a></p>

<p>Regards,</br>
Walchand Linux Users' Group</p>

<a href="https://www.instagram.com/wcewlug/" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990838/1_ueuuza.png" height="50em"/></a>
<a href="https://linkedin.com/company/wlug-club" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/2_e25xxl.png" height="50em"/></a>
<a href="https://www.facebook.com/wlugclub" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/3_ew5ope.png" height="50em"/></a>
<a href="https://twitter.com/wcewlug" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/4_csegd1.png" height="50em"/></a>
<a href="http://discord.wcewlug.org/join" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/5_nfvomt.png" height="50em"/></a>
<a href="https://wcewlug.org/" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990835/6_onbyb0.png" height="50em"/></a>
                    `;
        }
        // res.send(message);
        res.render("success")
        // sendEmail(user.email, "Thank You For Registering For Meta 2K23", message);
      } catch (err) {
        res.render("failure", { message: err.message });
        return;
      }
    }
    const postdata = await User.save();
    console.log(postdata);
    
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

app.listen(5000, () => {
  console.log("Listening to port 5000");
});
