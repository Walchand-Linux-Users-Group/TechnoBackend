const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const connectMongoDB = require("./db");
const user = require("./user");
const path = require("path");
const sendEmail = require("./email");
const template_path = path.join(__dirname, "./template/views");
console.log(__dirname);
app.set("view engine", "hbs");
app.set("views", template_path);

dotenv.config();
connectMongoDB();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(express.static(template_path));
app.use(express.urlencoded({ extended: false }));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
// app.get("/", (req, res) => {
//   res.render("success");
// });
// app.get("/success", (req, res) => {
//   res.render("success");
// });
// app.get("/failure", (req, res) => {
//   res.render("failure");
// });

app.get("/allUsers", async (req, res) => {
  const users = await user.find();
  res.send({ Users: users });
});

app.get("/users", async (req, res) => {
  const count = await user.find().count();
  res.send({ "No Of Users": count });
});

app.post("/getData", async (req, res) => {
  try {
    console.log(req.body);
    const existing = await user.findOne({ email: req.body.email });

    if (existing != null) {
      console.log("invalid email");
      return res.status(401).send({
        success:'false',
        message:'Email Already Registered',
      });
      
      
    }
    const existing2 = await user.findOne({
      transactionId: req.body.transactionId,
    });

    if (existing2 != null) {
      return res.status(401).send({
        success:'false',
        message:'Transaction id already used',
      });
      
    }

    if(req.body.phoneno.toString().length!==10){
      return res.status(401).send({
        success:'false',
        message:'Invalid mobile number',
      });
    }

    let User = new user({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phoneno,
      transactionId: req.body.transactionId,
      collegeName: req.body.collegeName,
      yearOfStudy: req.body.yearOfStudy,
      course: req.body.course,
    });
    const postdata = await User.save();
    try {
      if(User.course === "Frontend"){
        sendEmail(User.email,"Thank You For Registering For TechnoTweet 2K23",`<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
          </head>
          <body>
            <div>
              <u></u>
        
              <div
                style="
                  text-align: center;
                  margin: 0;
                  padding-top: 10px;
                  padding-bottom: 10px;
                  padding-left: 0;
                  padding-right: 0;
                  background-color: #f2f4f6;
                  color: #000000;
                "
                align="center"
              >
                <div style="text-align: center">
                  <table
                    align="center"
                    style="
                      text-align: center;
                      vertical-align: middle;
                      width: 600px;
                      max-width: 600px;
                    "
                    width="600"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="width: 596px; vertical-align: middle"
                          width="596"
                        ></td>
                      </tr>
                    </tbody>
                  </table>
        
                  <img
                    style="
                      width: 600px;
                      max-width: 600px;
                      height: 350px;
                      max-height: 350px;
                      text-align: center;
                    "
                    alt="TechnoTweet image"
                    src="https://res.cloudinary.com/dduur8qoo/image/upload/v1680936945/WhatsApp_Image_2023-04-08_at_00.16.06_oylqii.jpg"
                    align="center"
                    width="600"
                    height="350"
                    class="CToWUd a6T"
                    data-bit="iit"
                    tabindex="0"
                  />
                  <div>
                    <div
                      class="a6S"
                      dir="ltr"
                      style="opacity: 0.01; left: 552px; top: 501.5px"
                    >
                      <div
                        id=":155"
                        class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q"
                        role="button"
                        tabindex="0"
                        aria-label="Download attachment "
                        jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc2MjU0MTQxMTA0MjYyMTM2NyIsbnVsbCxbXV0."
                        data-tooltip-class="a1V"
                        data-tooltip="Download"
                      >
                        <div class="akn"><div class="aSK J-J5-Ji aYr"></div></div>
                      </div>
                    </div>
        
                    <table
                      align="center"
                      style="
                        text-align: center;
                        vertical-align: top;
                        width: 600px;
                        max-width: 600px;
                        background-color: #e0e0e0;
                        color: #000000;
                      "
                      width="600"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              width: 596px;
                              vertical-align: top;
                              padding-left: 30px;
                              padding-right: 30px;
                              padding-top: 30px;
                              padding-bottom: 10px;
                            "
                            width="596"
                          >
                            <h1
                              style="
                                font-size: 20px;
                                line-height: 24px;
                                font-family: 'Helvetica', Arial, sans-serif;
                                font-weight: 600;
                                text-decoration: none;
                                color: #000000;
                              "
                            >
                              Dear Participant,
                            </h1>
        
                            <p
                              style="
                                font-size: 15px;
                                line-height: 24px;
                                font-family: 'Helvetica', Arial, sans-serif;
                                font-weight: 400;
                                text-decoration: none;
                              "
                            >
                              We are pleased to inform you that your
                              <strong>TechnoTweet 2k23</strong> registration for <strong>Frontend</strong> workshop has been
                              successful!<br />
                              The event will be held on
                              <strong> 29th and 30th of April 2023</strong>. It will be
                              a two-day workshop on the MERN stack.
                              <br />
                              <br />
                              Please do not hesitate to contact us if you have any
                              queries about the event.We will be happy to assist you in
                              any way we can.
                            </p>
        
                            <p></p>
                            <p>
                              <strong> TechnoTweet website:</strong>
                              <a href="https://technotweet.wcewlug.org/"
                                >technotweet.wcewlug.org</a
                              >
                              <br />
                              Do share this with your friends and join us for an
                              exciting journey!
                            </p>
        
                            <p>
                              <strong>
                                <i>We look forward to seeing you there!</i>
                              </strong>
                            </p>
        
                            <p>
                              Thanks and regards,<br />
                              Walchand Linux Users' Group
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
        
                    <table
                      align="center"
                      style="
                        text-align: center;
                        vertical-align: top;
                        width: 600px;
                        max-width: 600px;
                        background-color: #e0e0e0;
                        color: #000000; ;
                      "
                      width="600"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              width: 596px;
                              vertical-align: top;
                              padding-left: 0;
                              padding-right: 0;
                            "
                            width="596"
                          >
                            <img
                              style="
                                width: 180px;
                                max-width: 180px;
                                height: 80px;
                                margin-bottom: 20px;
                                margin-top: 20px;
                                max-height: 80px;
                                text-align: center;
                              "
                              alt="Logo"
                              src="https://res.cloudinary.com/dduur8qoo/image/upload/v1680939150/WLUG_LOGO-png_hggxau.png"
                              align="center"
                              width="180"
                              height="85"
                              class="CToWUd"
                              data-bit="iit"
                            />
                          </td>
                        </tr>
        
                        <tr>
                          <td>
                            <a
                              href="https://www.instagram.com/wcewlug/"
                              target="_blank"
                              style="
                                margin-right: 5px;
                                margin-left: 5px;
                                margin-bottom: 15px;
                              "
                              data-saferedirecturl="https://www.google.com/url?q=https://www.instagram.com/wcewlug/&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw16ObtJOZ1hpw9644RZ4oMM"
                              ><img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Instagram-Icon.png/640px-Instagram-Icon.png"
                                class="CToWUd"
                                data-bit="iit"
                                style="width: 30px"
                            /></a>
                            <a
                              href="https://twitter.com/wcewlug"
                              target="_blank"
                              style="
                                margin-right: 5px;
                                margin-left: 5px;
                                margin-bottom: 15px;
                              "
                              data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/wcewlug&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw1ypHRKREADjq_cn0IRD2po"
                              ><img
                                src="https://res.cloudinary.com/dduur8qoo/image/upload/v1680936828/Logo_Twitter-removebg-preview_1_csh980.png"
                                style="width: 30px"
                                class="CToWUd"
                                data-bit="iit"
                            /></a>
                            <a
                              href="https://linkedin.com/company/wlug-club"
                              target="_blank"
                              style="
                                margin-right: 5px;
                                margin-left: 5px;
                                margin-bottom: 15px;
                              "
                              data-saferedirecturl="https://www.google.com/url?q=https://linkedin.com/company/wlug-club&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw0TDo2Akq1O-un9s_gRi70t"
                              ><img
                                src="https://pbs.twimg.com/profile_images/1508518003184349187/1KQYoqPY_400x400.png"
                                class="CToWUd"
                                data-bit="iit"
                                style="width: 30px; border-radius: 7px"
                            /></a>
                            <a
                              href="http://discord.wcewlug.org/join"
                              target="_blank"
                              style="
                                margin-right: 5px;
                                margin-left: 5px;
                                margin-bottom: 15px;
                              "
                              data-saferedirecturl="https://www.google.com/url?q=http://discord.wcewlug.org/join&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw3PNiAyDSeiO1V36KVKeLZl"
                              ><img
                                src="https://play-lh.googleusercontent.com/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ"
                                class="CToWUd"
                                style="width: 30px; border-radius: 7px"
                                data-bit="iit"
                            /></a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="yj6qo"></div>
                  <div class="adL"></div>
                </div>
                <div class="adL"></div>
              </div>
              <div class="adL"></div>
            </div>
          </body>
        </html>
        `);
      }
      else if(User.course === "Backend"){
        sendEmail(User.email,"Thank You For Registering For TechnoTweet 2K23",`<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
          </head>
          <body>
            <div>
              <u></u>
        
              <div
                style="
                  text-align: center;
                  margin: 0;
                  padding-top: 10px;
                  padding-bottom: 10px;
                  padding-left: 0;
                  padding-right: 0;
                  background-color: #f2f4f6;
                  color: #000000;
                "
                align="center"
              >
                <div style="text-align: center">
                  <table
                    align="center"
                    style="
                      text-align: center;
                      vertical-align: middle;
                      width: 600px;
                      max-width: 600px;
                    "
                    width="600"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="width: 596px; vertical-align: middle"
                          width="596"
                        ></td>
                      </tr>
                    </tbody>
                  </table>
        
                  <img
                    style="
                      width: 600px;
                      max-width: 600px;
                      height: 350px;
                      max-height: 350px;
                      text-align: center;
                    "
                    alt="TechnoTweet image"
                    src="https://res.cloudinary.com/dduur8qoo/image/upload/v1680936945/WhatsApp_Image_2023-04-08_at_00.16.06_oylqii.jpg"
                    align="center"
                    width="600"
                    height="350"
                    class="CToWUd a6T"
                    data-bit="iit"
                    tabindex="0"
                  />
                  <div>
                    <div
                      class="a6S"
                      dir="ltr"
                      style="opacity: 0.01; left: 552px; top: 501.5px"
                    >
                      <div
                        id=":155"
                        class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q"
                        role="button"
                        tabindex="0"
                        aria-label="Download attachment "
                        jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc2MjU0MTQxMTA0MjYyMTM2NyIsbnVsbCxbXV0."
                        data-tooltip-class="a1V"
                        data-tooltip="Download"
                      >
                        <div class="akn"><div class="aSK J-J5-Ji aYr"></div></div>
                      </div>
                    </div>
        
                    <table
                      align="center"
                      style="
                        text-align: center;
                        vertical-align: top;
                        width: 600px;
                        max-width: 600px;
                        background-color: #e0e0e0;
                        color: #000000;
                      "
                      width="600"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              width: 596px;
                              vertical-align: top;
                              padding-left: 30px;
                              padding-right: 30px;
                              padding-top: 30px;
                              padding-bottom: 10px;
                            "
                            width="596"
                          >
                            <h1
                              style="
                                font-size: 20px;
                                line-height: 24px;
                                font-family: 'Helvetica', Arial, sans-serif;
                                font-weight: 600;
                                text-decoration: none;
                                color: #000000;
                              "
                            >
                              Dear Participant,
                            </h1>
        
                            <p
                              style="
                                font-size: 15px;
                                line-height: 24px;
                                font-family: 'Helvetica', Arial, sans-serif;
                                font-weight: 400;
                                text-decoration: none;
                              "
                            >
                              We are pleased to inform you that your
                              <strong>TechnoTweet 2k23</strong> registration for <strong>Backend</strong> workshop has been
                              successful!<br />
                              The event will be held on
                              <strong> 29th and 30th of April 2023</strong>. It will be
                              a two-day workshop on the MERN stack.
                              <br />
                              <br />
                              Please do not hesitate to contact us if you have any
                              queries about the event.We will be happy to assist you in
                              any way we can.
                            </p>
        
                            <p></p>
                            <p>
                              <strong> TechnoTweet website:</strong>
                              <a href="https://technotweet.wcewlug.org/"
                                >technotweet.wcewlug.org</a
                              >
                              <br />
                              Do share this with your friends and join us for an
                              exciting journey!
                            </p>
        
                            <p>
                              <strong>
                                <i>We look forward to seeing you there!</i>
                              </strong>
                            </p>
        
                            <p>
                              Thanks and regards,<br />
                              Walchand Linux Users' Group
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
        
                    <table
                      align="center"
                      style="
                        text-align: center;
                        vertical-align: top;
                        width: 600px;
                        max-width: 600px;
                        background-color: #e0e0e0;
                        color: #000000; ;
                      "
                      width="600"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              width: 596px;
                              vertical-align: top;
                              padding-left: 0;
                              padding-right: 0;
                            "
                            width="596"
                          >
                            <img
                              style="
                                width: 180px;
                                max-width: 180px;
                                height: 80px;
                                margin-bottom: 20px;
                                margin-top: 20px;
                                max-height: 80px;
                                text-align: center;
                              "
                              alt="Logo"
                              src="https://res.cloudinary.com/dduur8qoo/image/upload/v1680939150/WLUG_LOGO-png_hggxau.png"
                              align="center"
                              width="180"
                              height="85"
                              class="CToWUd"
                              data-bit="iit"
                            />
                          </td>
                        </tr>
        
                        <tr>
                          <td>
                            <a
                              href="https://www.instagram.com/wcewlug/"
                              target="_blank"
                              style="
                                margin-right: 5px;
                                margin-left: 5px;
                                margin-bottom: 15px;
                              "
                              data-saferedirecturl="https://www.google.com/url?q=https://www.instagram.com/wcewlug/&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw16ObtJOZ1hpw9644RZ4oMM"
                              ><img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Instagram-Icon.png/640px-Instagram-Icon.png"
                                class="CToWUd"
                                data-bit="iit"
                                style="width: 30px"
                            /></a>
                            <a
                              href="https://twitter.com/wcewlug"
                              target="_blank"
                              style="
                                margin-right: 5px;
                                margin-left: 5px;
                                margin-bottom: 15px;
                              "
                              data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/wcewlug&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw1ypHRKREADjq_cn0IRD2po"
                              ><img
                                src="https://res.cloudinary.com/dduur8qoo/image/upload/v1680936828/Logo_Twitter-removebg-preview_1_csh980.png"
                                style="width: 30px"
                                class="CToWUd"
                                data-bit="iit"
                            /></a>
                            <a
                              href="https://linkedin.com/company/wlug-club"
                              target="_blank"
                              style="
                                margin-right: 5px;
                                margin-left: 5px;
                                margin-bottom: 15px;
                              "
                              data-saferedirecturl="https://www.google.com/url?q=https://linkedin.com/company/wlug-club&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw0TDo2Akq1O-un9s_gRi70t"
                              ><img
                                src="https://pbs.twimg.com/profile_images/1508518003184349187/1KQYoqPY_400x400.png"
                                class="CToWUd"
                                data-bit="iit"
                                style="width: 30px; border-radius: 7px"
                            /></a>
                            <a
                              href="http://discord.wcewlug.org/join"
                              target="_blank"
                              style="
                                margin-right: 5px;
                                margin-left: 5px;
                                margin-bottom: 15px;
                              "
                              data-saferedirecturl="https://www.google.com/url?q=http://discord.wcewlug.org/join&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw3PNiAyDSeiO1V36KVKeLZl"
                              ><img
                                src="https://play-lh.googleusercontent.com/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ"
                                class="CToWUd"
                                style="width: 30px; border-radius: 7px"
                                data-bit="iit"
                            /></a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="yj6qo"></div>
                  <div class="adL"></div>
                </div>
                <div class="adL"></div>
              </div>
              <div class="adL"></div>
            </div>
          </body>
        </html>
        `)  
      }
      else{
        sendEmail(User.email,"Thank You For Registering For TechnoTweet 2K23",`<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
          </head>
          <body>
            <div>
              <u></u>
        
              <div
                style="
                  text-align: center;
                  margin: 0;
                  padding-top: 10px;
                  padding-bottom: 10px;
                  padding-left: 0;
                  padding-right: 0;
                  background-color: #f2f4f6;
                  color: #000000;
                "
                align="center"
              >
                <div style="text-align: center">
                  <table
                    align="center"
                    style="
                      text-align: center;
                      vertical-align: middle;
                      width: 600px;
                      max-width: 600px;
                    "
                    width="600"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="width: 596px; vertical-align: middle"
                          width="596"
                        ></td>
                      </tr>
                    </tbody>
                  </table>
        
                  <img
                    style="
                      width: 600px;
                      max-width: 600px;
                      height: 350px;
                      max-height: 350px;
                      text-align: center;
                    "
                    alt="TechnoTweet image"
                    src="https://res.cloudinary.com/dduur8qoo/image/upload/v1680936945/WhatsApp_Image_2023-04-08_at_00.16.06_oylqii.jpg"
                    align="center"
                    width="600"
                    height="350"
                    class="CToWUd a6T"
                    data-bit="iit"
                    tabindex="0"
                  />
                  <div>
                    <div
                      class="a6S"
                      dir="ltr"
                      style="opacity: 0.01; left: 552px; top: 501.5px"
                    >
                      <div
                        id=":155"
                        class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q"
                        role="button"
                        tabindex="0"
                        aria-label="Download attachment "
                        jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc2MjU0MTQxMTA0MjYyMTM2NyIsbnVsbCxbXV0."
                        data-tooltip-class="a1V"
                        data-tooltip="Download"
                      >
                        <div class="akn"><div class="aSK J-J5-Ji aYr"></div></div>
                      </div>
                    </div>
        
                    <table
                      align="center"
                      style="
                        text-align: center;
                        vertical-align: top;
                        width: 600px;
                        max-width: 600px;
                        background-color: #e0e0e0;
                        color: #000000;
                      "
                      width="600"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              width: 596px;
                              vertical-align: top;
                              padding-left: 30px;
                              padding-right: 30px;
                              padding-top: 30px;
                              padding-bottom: 10px;
                            "
                            width="596"
                          >
                            <h1
                              style="
                                font-size: 20px;
                                line-height: 24px;
                                font-family: 'Helvetica', Arial, sans-serif;
                                font-weight: 600;
                                text-decoration: none;
                                color: #000000;
                              "
                            >
                              Dear Participant,
                            </h1>
        
                            <p
                              style="
                                font-size: 15px;
                                line-height: 24px;
                                font-family: 'Helvetica', Arial, sans-serif;
                                font-weight: 400;
                                text-decoration: none;
                              "
                            >
                              We are pleased to inform you that your
                              <strong>TechnoTweet 2k23</strong> registration for both <strong>Frontend</strong> and <strong>Backend</strong> workshop has been
                              successful!<br />
                              The event will be held on
                              <strong> 29th and 30th of April 2023</strong>. It will be
                              a two-day workshop on the MERN stack.
                              <br />
                              <br />
                              Please do not hesitate to contact us if you have any
                              queries about the event.We will be happy to assist you in
                              any way we can.
                            </p>
        
                            <p></p>
                            <p>
                              <strong> TechnoTweet website:</strong>
                              <a href="https://technotweet.wcewlug.org/"
                                >technotweet.wcewlug.org</a
                              >
                              <br />
                              Do share this with your friends and join us for an
                              exciting journey!
                            </p>
        
                            <p>
                              <strong>
                                <i>We look forward to seeing you there!</i>
                              </strong>
                            </p>
        
                            <p>
                              Thanks and regards,<br />
                              Walchand Linux Users' Group
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
        
                    <table
                      align="center"
                      style="
                        text-align: center;
                        vertical-align: top;
                        width: 600px;
                        max-width: 600px;
                        background-color: #e0e0e0;
                        color: #000000; ;
                      "
                      width="600"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              width: 596px;
                              vertical-align: top;
                              padding-left: 0;
                              padding-right: 0;
                            "
                            width="596"
                          >
                            <img
                              style="
                                width: 180px;
                                max-width: 180px;
                                height: 80px;
                                margin-bottom: 20px;
                                margin-top: 20px;
                                max-height: 80px;
                                text-align: center;
                              "
                              alt="Logo"
                              src="https://res.cloudinary.com/dduur8qoo/image/upload/v1680939150/WLUG_LOGO-png_hggxau.png"
                              align="center"
                              width="180"
                              height="85"
                              class="CToWUd"
                              data-bit="iit"
                            />
                          </td>
                        </tr>
        
                        <tr>
                          <td>
                            <a
                              href="https://www.instagram.com/wcewlug/"
                              target="_blank"
                              style="
                                margin-right: 5px;
                                margin-left: 5px;
                                margin-bottom: 15px;
                              "
                              data-saferedirecturl="https://www.google.com/url?q=https://www.instagram.com/wcewlug/&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw16ObtJOZ1hpw9644RZ4oMM"
                              ><img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Instagram-Icon.png/640px-Instagram-Icon.png"
                                class="CToWUd"
                                data-bit="iit"
                                style="width: 30px"
                            /></a>
                            <a
                              href="https://twitter.com/wcewlug"
                              target="_blank"
                              style="
                                margin-right: 5px;
                                margin-left: 5px;
                                margin-bottom: 15px;
                              "
                              data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/wcewlug&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw1ypHRKREADjq_cn0IRD2po"
                              ><img
                                src="https://res.cloudinary.com/dduur8qoo/image/upload/v1680936828/Logo_Twitter-removebg-preview_1_csh980.png"
                                style="width: 30px"
                                class="CToWUd"
                                data-bit="iit"
                            /></a>
                            <a
                              href="https://linkedin.com/company/wlug-club"
                              target="_blank"
                              style="
                                margin-right: 5px;
                                margin-left: 5px;
                                margin-bottom: 15px;
                              "
                              data-saferedirecturl="https://www.google.com/url?q=https://linkedin.com/company/wlug-club&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw0TDo2Akq1O-un9s_gRi70t"
                              ><img
                                src="https://pbs.twimg.com/profile_images/1508518003184349187/1KQYoqPY_400x400.png"
                                class="CToWUd"
                                data-bit="iit"
                                style="width: 30px; border-radius: 7px"
                            /></a>
                            <a
                              href="http://discord.wcewlug.org/join"
                              target="_blank"
                              style="
                                margin-right: 5px;
                                margin-left: 5px;
                                margin-bottom: 15px;
                              "
                              data-saferedirecturl="https://www.google.com/url?q=http://discord.wcewlug.org/join&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw3PNiAyDSeiO1V36KVKeLZl"
                              ><img
                                src="https://play-lh.googleusercontent.com/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ"
                                class="CToWUd"
                                style="width: 30px; border-radius: 7px"
                                data-bit="iit"
                            /></a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="yj6qo"></div>
                  <div class="adL"></div>
                </div>
                <div class="adL"></div>
              </div>
              <div class="adL"></div>
            </div>
          </body>
        </html>
        `) 
      }
    } catch (error) {
      console.log(error);
    }
    console.log(postdata);
    return res.status(201).json({ postdata });
    
  } catch (error) {
    res.status(500).send("Failed to submit!!! Try Again");
    console.log(error);
  }
});

app.listen(port, () => {
  console.log("Listening to port 5000");
});
