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
                    src="https://drive.google.com/file/d/1nnXV0leUWLphH-fIB3TE4yvgf2-8xJNW/view?usp=share_link"
                    align="center"
                    width="600"
                    height="350"
                    class="CToWUd a6T"
                    data-bit="iit"
                    tabindex="0"
                  />
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
                      background-color: #ffffff;
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
                            padding-bottom: 40px;
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
                              color: #585858;
                            "
                          >
                            We are pleased to inform you that your
                            <strong>TechnoTweet 2k23</strong> registration has been
                            successful!<br />
                            The event will be held on 15th and 16th of April 2023. It
                            will be a two-days workshop on MERN stack.
                          </p>
                          You will have access to the Frontend session of the event as a registered participant.
                          <br />
                          <br />
                          Please do not hesitate to contact us if you have any queries
                          about the event.We will be happy to assist you in any way we
                          can.
                          <p></p>
                          <p>
                            <strong> TechnoTweet website:</strong>
                            <a href="technotweet.wcewlug.org"
                              >technotweet.wcewlug.org</a
                            >
                            <br />
                            Do share this with your friends and join us for an exciting
                            journey!
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
                      background-color: #ffffff;
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
                              height: 180px;
                              max-height: 180px;
                              text-align: center;
                              color: #ffffff;
                            "
                            alt="Logo"
                            src="https://ci5.googleusercontent.com/proxy/TisKghh6CVtCSczBFdUzjnV3J612Dox2nLAXEU0vEMrB_bjQJMmrUmwfzgMGvIXYVLp-ur368plqJ8jCfcOGAEJTCbjk7y0WA0lVYg5drw_kLKMC4rwArY6BQfjX=s0-d-e1-ft#https://res.cloudinary.com/ravikjha7/image/upload/v1669990835/6_onbyb0.png"
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
                            data-saferedirecturl="https://www.google.com/url?q=https://www.instagram.com/wcewlug/&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw16ObtJOZ1hpw9644RZ4oMM"
                            ><img
                              src="https://ci3.googleusercontent.com/proxy/f7g6lMFgA75_Aq2zIEAe_WMbnONAhMTc82-4lxigPiEuX3yxK9zuOsLoNazImMci4IFrU6urnadMUd3dTQDNcJT2CV8dZ01DMj0g=s0-d-e1-ft#https://img.icons8.com/windows/32/null/instagram-new.png"
                              class="CToWUd"
                              data-bit="iit"
                          /></a>
                          <a
                            href="https://twitter.com/wcewlug"
                            target="_blank"
                            data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/wcewlug&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw1ypHRKREADjq_cn0IRD2po"
                            ><img
                              src="https://ci3.googleusercontent.com/proxy/FGiluFSHeZZ5G6vgpgLIHX_pWAwz7YXx_izKvGeXCF37XZGUK9Atvyl-FeKAylgcIIbip2wOvb2JENSNJ5sx-u3J77PO=s0-d-e1-ft#https://img.icons8.com/windows/32/null/twitter.png"
                              class="CToWUd"
                              data-bit="iit"
                          /></a>
                          <a
                            href="https://linkedin.com/company/wlug-club"
                            target="_blank"
                            data-saferedirecturl="https://www.google.com/url?q=https://linkedin.com/company/wlug-club&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw0TDo2Akq1O-un9s_gRi70t"
                            ><img
                              src="https://ci3.googleusercontent.com/proxy/dtDnSZeDyKv6sNoNMenwSC2L8cjQSI2ttOj6cN8ivHaCnlbVUbwlzwZYxXMg5gJ9vaP9DfiLMWrAlVFFFf-xZ1x-xFI7kqpiMw=s0-d-e1-ft#https://img.icons8.com/ios-glyphs/30/null/linkedin.png"
                              class="CToWUd"
                              data-bit="iit"
                          /></a>
                          <a
                            href="http://discord.wcewlug.org/join"
                            target="_blank"
                            data-saferedirecturl="https://www.google.com/url?q=http://discord.wcewlug.org/join&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw3PNiAyDSeiO1V36KVKeLZl"
                            ><img
                              src="https://ci5.googleusercontent.com/proxy/k-nXo_zrA7dzPpTeOBjoTHMLfoZmAxz4xS8iRI2TdfV77mvlJRuzK3m_DKoqxy1IFl8Z2m-97kNnzOZi5ub-lTifEb3n2Vd-u0Agz-FRwPmgl9M=s0-d-e1-ft#https://img.icons8.com/material-rounded/24/null/discord-logo.png"
                              class="CToWUd"
                              data-bit="iit"
                          /></a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
                    src="https://drive.google.com/file/d/1nnXV0leUWLphH-fIB3TE4yvgf2-8xJNW/view?usp=share_link"
                    align="center"
                    width="600"
                    height="350"
                    class="CToWUd a6T"
                    data-bit="iit"
                    tabindex="0"
                  />
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
                      background-color: #ffffff;
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
                            padding-bottom: 40px;
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
                              color: #585858;
                            "
                          >
                            We are pleased to inform you that your
                            <strong>TechnoTweet 2k23</strong> registration has been
                            successful!<br />
                            The event will be held on 15th and 16th of April 2023. It
                            will be a two-days workshop on MERN stack.
                          </p>
                          You will have access to the Backend session of the event as a registered participant.
                          <br />
                          <br />
                          Please do not hesitate to contact us if you have any queries
                          about the event.We will be happy to assist you in any way we
                          can.
                          <p></p>
                          <p>
                            <strong> TechnoTweet website:</strong>
                            <a href="technotweet.wcewlug.org"
                              >technotweet.wcewlug.org</a
                            >
                            <br />
                            Do share this with your friends and join us for an exciting
                            journey!
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
                      background-color: #ffffff;
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
                              height: 180px;
                              max-height: 180px;
                              text-align: center;
                              color: #ffffff;
                            "
                            alt="Logo"
                            src="https://ci5.googleusercontent.com/proxy/TisKghh6CVtCSczBFdUzjnV3J612Dox2nLAXEU0vEMrB_bjQJMmrUmwfzgMGvIXYVLp-ur368plqJ8jCfcOGAEJTCbjk7y0WA0lVYg5drw_kLKMC4rwArY6BQfjX=s0-d-e1-ft#https://res.cloudinary.com/ravikjha7/image/upload/v1669990835/6_onbyb0.png"
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
                            data-saferedirecturl="https://www.google.com/url?q=https://www.instagram.com/wcewlug/&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw16ObtJOZ1hpw9644RZ4oMM"
                            ><img
                              src="https://ci3.googleusercontent.com/proxy/f7g6lMFgA75_Aq2zIEAe_WMbnONAhMTc82-4lxigPiEuX3yxK9zuOsLoNazImMci4IFrU6urnadMUd3dTQDNcJT2CV8dZ01DMj0g=s0-d-e1-ft#https://img.icons8.com/windows/32/null/instagram-new.png"
                              class="CToWUd"
                              data-bit="iit"
                          /></a>
                          <a
                            href="https://twitter.com/wcewlug"
                            target="_blank"
                            data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/wcewlug&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw1ypHRKREADjq_cn0IRD2po"
                            ><img
                              src="https://ci3.googleusercontent.com/proxy/FGiluFSHeZZ5G6vgpgLIHX_pWAwz7YXx_izKvGeXCF37XZGUK9Atvyl-FeKAylgcIIbip2wOvb2JENSNJ5sx-u3J77PO=s0-d-e1-ft#https://img.icons8.com/windows/32/null/twitter.png"
                              class="CToWUd"
                              data-bit="iit"
                          /></a>
                          <a
                            href="https://linkedin.com/company/wlug-club"
                            target="_blank"
                            data-saferedirecturl="https://www.google.com/url?q=https://linkedin.com/company/wlug-club&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw0TDo2Akq1O-un9s_gRi70t"
                            ><img
                              src="https://ci3.googleusercontent.com/proxy/dtDnSZeDyKv6sNoNMenwSC2L8cjQSI2ttOj6cN8ivHaCnlbVUbwlzwZYxXMg5gJ9vaP9DfiLMWrAlVFFFf-xZ1x-xFI7kqpiMw=s0-d-e1-ft#https://img.icons8.com/ios-glyphs/30/null/linkedin.png"
                              class="CToWUd"
                              data-bit="iit"
                          /></a>
                          <a
                            href="http://discord.wcewlug.org/join"
                            target="_blank"
                            data-saferedirecturl="https://www.google.com/url?q=http://discord.wcewlug.org/join&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw3PNiAyDSeiO1V36KVKeLZl"
                            ><img
                              src="https://ci5.googleusercontent.com/proxy/k-nXo_zrA7dzPpTeOBjoTHMLfoZmAxz4xS8iRI2TdfV77mvlJRuzK3m_DKoqxy1IFl8Z2m-97kNnzOZi5ub-lTifEb3n2Vd-u0Agz-FRwPmgl9M=s0-d-e1-ft#https://img.icons8.com/material-rounded/24/null/discord-logo.png"
                              class="CToWUd"
                              data-bit="iit"
                          /></a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
                    src="https://drive.google.com/file/d/1nnXV0leUWLphH-fIB3TE4yvgf2-8xJNW/view?usp=share_link"
                    align="center"
                    width="600"
                    height="350"
                    class="CToWUd a6T"
                    data-bit="iit"
                    tabindex="0"
                  />
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
                      background-color: #ffffff;
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
                            padding-bottom: 40px;
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
                              color: #585858;
                            "
                          >
                            We are pleased to inform you that your
                            <strong>TechnoTweet 2k23</strong> registration has been
                            successful!<br />
                            The event will be held on 15th and 16th of April 2023. It
                            will be a two-days workshop on MERN stack.
                          </p>
                          You will have access to all the sessions and activities we
                          have scheduled for the event as a registered participant.
                          <br />
                          <br />
                          Please do not hesitate to contact us if you have any queries
                          about the event.We will be happy to assist you in any way we
                          can.
                          <p></p>
                          <p>
                            <strong> TechnoTweet website:</strong>
                            <a href="technotweet.wcewlug.org"
                              >technotweet.wcewlug.org</a
                            >
                            <br />
                            Do share this with your friends and join us for an exciting
                            journey!
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
                      background-color: #ffffff;
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
                              height: 180px;
                              max-height: 180px;
                              text-align: center;
                              color: #ffffff;
                            "
                            alt="Logo"
                            src="https://ci5.googleusercontent.com/proxy/TisKghh6CVtCSczBFdUzjnV3J612Dox2nLAXEU0vEMrB_bjQJMmrUmwfzgMGvIXYVLp-ur368plqJ8jCfcOGAEJTCbjk7y0WA0lVYg5drw_kLKMC4rwArY6BQfjX=s0-d-e1-ft#https://res.cloudinary.com/ravikjha7/image/upload/v1669990835/6_onbyb0.png"
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
                            data-saferedirecturl="https://www.google.com/url?q=https://www.instagram.com/wcewlug/&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw16ObtJOZ1hpw9644RZ4oMM"
                            ><img
                              src="https://ci3.googleusercontent.com/proxy/f7g6lMFgA75_Aq2zIEAe_WMbnONAhMTc82-4lxigPiEuX3yxK9zuOsLoNazImMci4IFrU6urnadMUd3dTQDNcJT2CV8dZ01DMj0g=s0-d-e1-ft#https://img.icons8.com/windows/32/null/instagram-new.png"
                              class="CToWUd"
                              data-bit="iit"
                          /></a>
                          <a
                            href="https://twitter.com/wcewlug"
                            target="_blank"
                            data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/wcewlug&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw1ypHRKREADjq_cn0IRD2po"
                            ><img
                              src="https://ci3.googleusercontent.com/proxy/FGiluFSHeZZ5G6vgpgLIHX_pWAwz7YXx_izKvGeXCF37XZGUK9Atvyl-FeKAylgcIIbip2wOvb2JENSNJ5sx-u3J77PO=s0-d-e1-ft#https://img.icons8.com/windows/32/null/twitter.png"
                              class="CToWUd"
                              data-bit="iit"
                          /></a>
                          <a
                            href="https://linkedin.com/company/wlug-club"
                            target="_blank"
                            data-saferedirecturl="https://www.google.com/url?q=https://linkedin.com/company/wlug-club&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw0TDo2Akq1O-un9s_gRi70t"
                            ><img
                              src="https://ci3.googleusercontent.com/proxy/dtDnSZeDyKv6sNoNMenwSC2L8cjQSI2ttOj6cN8ivHaCnlbVUbwlzwZYxXMg5gJ9vaP9DfiLMWrAlVFFFf-xZ1x-xFI7kqpiMw=s0-d-e1-ft#https://img.icons8.com/ios-glyphs/30/null/linkedin.png"
                              class="CToWUd"
                              data-bit="iit"
                          /></a>
                          <a
                            href="http://discord.wcewlug.org/join"
                            target="_blank"
                            data-saferedirecturl="https://www.google.com/url?q=http://discord.wcewlug.org/join&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw3PNiAyDSeiO1V36KVKeLZl"
                            ><img
                              src="https://ci5.googleusercontent.com/proxy/k-nXo_zrA7dzPpTeOBjoTHMLfoZmAxz4xS8iRI2TdfV77mvlJRuzK3m_DKoqxy1IFl8Z2m-97kNnzOZi5ub-lTifEb3n2Vd-u0Agz-FRwPmgl9M=s0-d-e1-ft#https://img.icons8.com/material-rounded/24/null/discord-logo.png"
                              class="CToWUd"
                              data-bit="iit"
                          /></a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
