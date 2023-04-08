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
                    src="https://lh3.googleusercontent.com/HmyU0R6X2MylUdW_78c-v4c6xDutQzUaQJsVVV6Uzyrf-j5cHlh6s1o36ZqMAH-2ympAMIyML2Uk6NpAk2e8w12_5237bX0WCpLzEXcX0Um47Wwr2Fdw6ZQycJnfSgh3uFUIG7DorAxmrFVAuBSsgX4o3icR9Liuwx3NDoLAvMzKryWiV36rMpgvVmZd4g8c9f-4-Ra47D3rtaZ3-9x8i3jjutVbxEKWeNBuJGo_NzV0ODBgHq4TdZfc7z-sgKWJFtZMSh3Hs1X-5y4q58UX7LSWB2b_ZYYtdAIh6e8YFjmfV4aUziwWjmjRTIq2siCoFRrm522y11EYNg-eQrpeLy0HBLbrWv7H5Qjh5tUlYoTbUdCf5MuZxpzSVxroAlI6StvorbnQ48etr3_Ra3v2PgOMYWrI__8noxil0kUvRjFZ3995jKKRZapHguz2N9NvG-3tp8s1I7dsPjl1LhajFzjKVwGdj2tsJZ5RUFq1yZq7HGzockFmJe5J610Xh7J6D-cpIRuhtlXkX47w0GpZyncJOJHrRpio2lrMqkcpgoHYHBTW64DJasOoZxs5spu81esg1S_0YPaGZniclXP03V0wAaJWxurY36ZQg_PdaafI-UjHV32y4gcxtjMXx1WGvU3Fwyu_t-wBiB5Q7C31lTILRiQSpq0NEy7BVwIhh81CV43kIvHkD-vAin_t4Givb_5DiPL_V6KOrSOd3y4e8YGyOZTO1lmIEjqY3RTNrTEvGf8Tpxa68wyntqQHC5ecTq3T9DKaBJoc2DzNNE84h2y3G6-l4XsM59NO0EPgVlsth3rupPaUc-5NYf--_5oyOTq3FpcPtn9mliV633gTgJS9N0IDETwuX4DzVUZ5iPFJqGzpphmo2xNv__hS2ekzULqwx0HNkc3sDA6BdcgRkLoq-I4ntJK0wIUvEKbYQwIom-tv=w1002-h601-s-no?authuser=0"
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
                              color: #4e4e4e;
                            "
                          >
                            We are pleased to inform you that your
                            <strong>TechnoTweet 2k23</strong> registration for Frontend workshop has been
                            successful!<br />
                            The event will be held on 15th and 16th of April 2023. It
                            will be a two-day workshop on the MERN stack.
                            <br />
                            <br />
                            Please do not hesitate to contact us if you have any queries
                            about the event.We will be happy to assist you in any way we
                            can.
                          </p>
        
                          <p></p>
                          <p>
                            <strong> TechnoTweet website:</strong>
                            <a href="https://technotweet.wcewlug.org/"
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
                              height: 100px;
                              margin-bottom: 15px;
                              max-height: 100px;
                              text-align: center;
                              color: #ffffff;
                            "
                            alt="Logo"
                            src="https://lh3.googleusercontent.com/TO30OWgM1vwxDbjUCci4qk74A1PhFAZPkSPsYh_P6eypFX1qFNCxHhJjR5YOOxvm6ttueIoL1iUYFF8EqpRYNPKN2vua77h6kQfVX-5ZSL-g7EH5NGN7xlDACN9OsfCv_A_2MyHcgwvrTmKr2aSI8jsVmK62PdRI6leD6gBjZOavN3pNrS_czkBuX4pRuF8LZAiKA1QPZdcsiB6oB15uyW04dOGQnZbQnO6qNwxFqQc4W_QNSU9Go31USa43jpG3wxG-E-pvFYVR8FVa2F6h5DEF3u-QfVCJYBz0aKYVyDwjtp6MEKANwdPdZi4DIHheXthpM5wpuNgNdIi-sEeUBnrfFj2YATQbRM4YIqofHve369jnnFJwyXPxAL0-fShlUrnyaBIegHW9l_VkZ1w9SmGSYcBIfg2t1Px1yuk5LOc3WiJisaLhO_AOD3_pmyVFAODDfsrQfbrnPpb2Xn7YjfaC3fDQn_wUXpeOe5FD_WMusfaR1NcHRcwKuvxGa04osKz1GBcRRdPYx37a2Jkx6NsoOC8Y-5ZiTdZI6dr6cB3HZHx5sxOOm4L9aA5QsNLHryQjEJ74zdafoy91Q8IkD8pTspYhYRAhzEmTSlcCCF66gtm8k5Zhm5SLBPJMTP4PiT4Xt7k4oGz_winvh5A_UVkTh3ysVFb3bxJ12hPVMhfINBOGGjop36muwKswEYgHdJ2EfMv0g0JIAvt-KjJhVX3I60pLcKU5pULLC3vaa_XhN8xH7x80STdD53KxO9spDjVbEMKXPTjtoz0FLLTxuLT1de5TS-bE1d6xwJZ-SvyRtbGoAyos134-bgZNItklRbi3XXKIZySAEbSHuo0YcwHnHmoZ_9zk9_BSO3VbfaesHxH_cP1sHUlLtvG4Z2SQO6Wsel5FCog1GoVzQXQWCQ9X9PK2Y2eFNmGfu88qyhyJcGUb=w429-h242-no?authuser=0"
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
                              src="https://lh3.googleusercontent.com/Ld_d5DP39PqswAvl0McBAOGUn4m15DCGOPk8xA_Yrw8is1p2LIygiXdAtLaq6oqLmFRaev_ah9L9RvVyhWjUJAya6hQr3aY-gSrlyKorbnTIvBDzyYQkTYLrEuYbFOI7nItwK8ehG5kMMNHD7L0TFbrlIdwu23RVz-ivwhmtuM8FpnR6B-DtwPAknUCmfYufY8XiJHBT-HJ9kQV5KyyKpr1fBcJYmlM6_B1j99iYzqDZ-KTqkv1yYhY6DdXbj_FwFJUJjmL-e1XH8oP28akyDFRi-PKPxQSDw2rAvZOb1DYWz6AortmteO-Q_qHTCGe6wn6mjNJXDKO5BTX_V3vcqTLhn3PcI46PNokjr8Z_zJKKo04Tb2Rblrfoh3Oli9J16UptYwM9WmQ-3KlDeWs3xr6KvfCX5E23jCI9eZa3h_hz2QymJnGSMJ5eQNcu7GVtqLLwHaOASuy49K5vEdWa8u8-KppphA6dPdPZ8PVTQuE9FR-piBkQFZu0orCkZPMPHlE_Jv3ivg-aK-AQNvo6I7UZrztckOAmzIMolBQD5Ca6_MpHyj66i32lNWdBZrvb6fbQk_1TZn92ZZvQRgJ58fev9erJsSD49sQBCk1QIR2STjLBWPOyaZQkQwpnGqXKtdypgajLQaVY-fMz6JpTUS1-1lPttVSs3KuuLhifeUBpItR0Npq5A03TZXA5_H0zXHb5gk-SUOew2waiFD0Kmy5dUf0GiwKUKj4FVFank5da0C27GAzNcpI7z62giu7JEca2OVSOVqpzefcYSXcjkNnSGcmGEhyNQgXtxxfvNqXyFh0EC3imyQpvBIhos_MfWLTiKRr6Ybwrzvngnndu2DscniKdWgCAjTls-JZsr_PgrxTQVcbqcYa6lULsgwZVKQeIp4-mogu5_2YhY_w9KzbYlqcD66WRCOJa9m3RWCl3U-EF=w356-h305-s-no?authuser=0"
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
                    src="https://lh3.googleusercontent.com/HmyU0R6X2MylUdW_78c-v4c6xDutQzUaQJsVVV6Uzyrf-j5cHlh6s1o36ZqMAH-2ympAMIyML2Uk6NpAk2e8w12_5237bX0WCpLzEXcX0Um47Wwr2Fdw6ZQycJnfSgh3uFUIG7DorAxmrFVAuBSsgX4o3icR9Liuwx3NDoLAvMzKryWiV36rMpgvVmZd4g8c9f-4-Ra47D3rtaZ3-9x8i3jjutVbxEKWeNBuJGo_NzV0ODBgHq4TdZfc7z-sgKWJFtZMSh3Hs1X-5y4q58UX7LSWB2b_ZYYtdAIh6e8YFjmfV4aUziwWjmjRTIq2siCoFRrm522y11EYNg-eQrpeLy0HBLbrWv7H5Qjh5tUlYoTbUdCf5MuZxpzSVxroAlI6StvorbnQ48etr3_Ra3v2PgOMYWrI__8noxil0kUvRjFZ3995jKKRZapHguz2N9NvG-3tp8s1I7dsPjl1LhajFzjKVwGdj2tsJZ5RUFq1yZq7HGzockFmJe5J610Xh7J6D-cpIRuhtlXkX47w0GpZyncJOJHrRpio2lrMqkcpgoHYHBTW64DJasOoZxs5spu81esg1S_0YPaGZniclXP03V0wAaJWxurY36ZQg_PdaafI-UjHV32y4gcxtjMXx1WGvU3Fwyu_t-wBiB5Q7C31lTILRiQSpq0NEy7BVwIhh81CV43kIvHkD-vAin_t4Givb_5DiPL_V6KOrSOd3y4e8YGyOZTO1lmIEjqY3RTNrTEvGf8Tpxa68wyntqQHC5ecTq3T9DKaBJoc2DzNNE84h2y3G6-l4XsM59NO0EPgVlsth3rupPaUc-5NYf--_5oyOTq3FpcPtn9mliV633gTgJS9N0IDETwuX4DzVUZ5iPFJqGzpphmo2xNv__hS2ekzULqwx0HNkc3sDA6BdcgRkLoq-I4ntJK0wIUvEKbYQwIom-tv=w1002-h601-s-no?authuser=0"
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
                              color: #4e4e4e;
                            "
                          >
                            We are pleased to inform you that your
                            <strong>TechnoTweet 2k23</strong> registration for Backend workshop has been
                            successful!<br />
                            The event will be held on 15th and 16th of April 2023. It
                            will be a two-day workshop on the MERN stack.
                            <br />
                            <br />
                            Please do not hesitate to contact us if you have any queries
                            about the event.We will be happy to assist you in any way we
                            can.
                          </p>
        
                          <p></p>
                          <p>
                            <strong> TechnoTweet website:</strong>
                            <a href="https://technotweet.wcewlug.org/"
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
                              height: 100px;
                              margin-bottom: 15px;
                              max-height: 100px;
                              text-align: center;
                              color: #ffffff;
                            "
                            alt="Logo"
                            src="https://lh3.googleusercontent.com/TO30OWgM1vwxDbjUCci4qk74A1PhFAZPkSPsYh_P6eypFX1qFNCxHhJjR5YOOxvm6ttueIoL1iUYFF8EqpRYNPKN2vua77h6kQfVX-5ZSL-g7EH5NGN7xlDACN9OsfCv_A_2MyHcgwvrTmKr2aSI8jsVmK62PdRI6leD6gBjZOavN3pNrS_czkBuX4pRuF8LZAiKA1QPZdcsiB6oB15uyW04dOGQnZbQnO6qNwxFqQc4W_QNSU9Go31USa43jpG3wxG-E-pvFYVR8FVa2F6h5DEF3u-QfVCJYBz0aKYVyDwjtp6MEKANwdPdZi4DIHheXthpM5wpuNgNdIi-sEeUBnrfFj2YATQbRM4YIqofHve369jnnFJwyXPxAL0-fShlUrnyaBIegHW9l_VkZ1w9SmGSYcBIfg2t1Px1yuk5LOc3WiJisaLhO_AOD3_pmyVFAODDfsrQfbrnPpb2Xn7YjfaC3fDQn_wUXpeOe5FD_WMusfaR1NcHRcwKuvxGa04osKz1GBcRRdPYx37a2Jkx6NsoOC8Y-5ZiTdZI6dr6cB3HZHx5sxOOm4L9aA5QsNLHryQjEJ74zdafoy91Q8IkD8pTspYhYRAhzEmTSlcCCF66gtm8k5Zhm5SLBPJMTP4PiT4Xt7k4oGz_winvh5A_UVkTh3ysVFb3bxJ12hPVMhfINBOGGjop36muwKswEYgHdJ2EfMv0g0JIAvt-KjJhVX3I60pLcKU5pULLC3vaa_XhN8xH7x80STdD53KxO9spDjVbEMKXPTjtoz0FLLTxuLT1de5TS-bE1d6xwJZ-SvyRtbGoAyos134-bgZNItklRbi3XXKIZySAEbSHuo0YcwHnHmoZ_9zk9_BSO3VbfaesHxH_cP1sHUlLtvG4Z2SQO6Wsel5FCog1GoVzQXQWCQ9X9PK2Y2eFNmGfu88qyhyJcGUb=w429-h242-no?authuser=0"
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
                              src="https://lh3.googleusercontent.com/Ld_d5DP39PqswAvl0McBAOGUn4m15DCGOPk8xA_Yrw8is1p2LIygiXdAtLaq6oqLmFRaev_ah9L9RvVyhWjUJAya6hQr3aY-gSrlyKorbnTIvBDzyYQkTYLrEuYbFOI7nItwK8ehG5kMMNHD7L0TFbrlIdwu23RVz-ivwhmtuM8FpnR6B-DtwPAknUCmfYufY8XiJHBT-HJ9kQV5KyyKpr1fBcJYmlM6_B1j99iYzqDZ-KTqkv1yYhY6DdXbj_FwFJUJjmL-e1XH8oP28akyDFRi-PKPxQSDw2rAvZOb1DYWz6AortmteO-Q_qHTCGe6wn6mjNJXDKO5BTX_V3vcqTLhn3PcI46PNokjr8Z_zJKKo04Tb2Rblrfoh3Oli9J16UptYwM9WmQ-3KlDeWs3xr6KvfCX5E23jCI9eZa3h_hz2QymJnGSMJ5eQNcu7GVtqLLwHaOASuy49K5vEdWa8u8-KppphA6dPdPZ8PVTQuE9FR-piBkQFZu0orCkZPMPHlE_Jv3ivg-aK-AQNvo6I7UZrztckOAmzIMolBQD5Ca6_MpHyj66i32lNWdBZrvb6fbQk_1TZn92ZZvQRgJ58fev9erJsSD49sQBCk1QIR2STjLBWPOyaZQkQwpnGqXKtdypgajLQaVY-fMz6JpTUS1-1lPttVSs3KuuLhifeUBpItR0Npq5A03TZXA5_H0zXHb5gk-SUOew2waiFD0Kmy5dUf0GiwKUKj4FVFank5da0C27GAzNcpI7z62giu7JEca2OVSOVqpzefcYSXcjkNnSGcmGEhyNQgXtxxfvNqXyFh0EC3imyQpvBIhos_MfWLTiKRr6Ybwrzvngnndu2DscniKdWgCAjTls-JZsr_PgrxTQVcbqcYa6lULsgwZVKQeIp4-mogu5_2YhY_w9KzbYlqcD66WRCOJa9m3RWCl3U-EF=w356-h305-s-no?authuser=0"
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
                    src="https://lh3.googleusercontent.com/HmyU0R6X2MylUdW_78c-v4c6xDutQzUaQJsVVV6Uzyrf-j5cHlh6s1o36ZqMAH-2ympAMIyML2Uk6NpAk2e8w12_5237bX0WCpLzEXcX0Um47Wwr2Fdw6ZQycJnfSgh3uFUIG7DorAxmrFVAuBSsgX4o3icR9Liuwx3NDoLAvMzKryWiV36rMpgvVmZd4g8c9f-4-Ra47D3rtaZ3-9x8i3jjutVbxEKWeNBuJGo_NzV0ODBgHq4TdZfc7z-sgKWJFtZMSh3Hs1X-5y4q58UX7LSWB2b_ZYYtdAIh6e8YFjmfV4aUziwWjmjRTIq2siCoFRrm522y11EYNg-eQrpeLy0HBLbrWv7H5Qjh5tUlYoTbUdCf5MuZxpzSVxroAlI6StvorbnQ48etr3_Ra3v2PgOMYWrI__8noxil0kUvRjFZ3995jKKRZapHguz2N9NvG-3tp8s1I7dsPjl1LhajFzjKVwGdj2tsJZ5RUFq1yZq7HGzockFmJe5J610Xh7J6D-cpIRuhtlXkX47w0GpZyncJOJHrRpio2lrMqkcpgoHYHBTW64DJasOoZxs5spu81esg1S_0YPaGZniclXP03V0wAaJWxurY36ZQg_PdaafI-UjHV32y4gcxtjMXx1WGvU3Fwyu_t-wBiB5Q7C31lTILRiQSpq0NEy7BVwIhh81CV43kIvHkD-vAin_t4Givb_5DiPL_V6KOrSOd3y4e8YGyOZTO1lmIEjqY3RTNrTEvGf8Tpxa68wyntqQHC5ecTq3T9DKaBJoc2DzNNE84h2y3G6-l4XsM59NO0EPgVlsth3rupPaUc-5NYf--_5oyOTq3FpcPtn9mliV633gTgJS9N0IDETwuX4DzVUZ5iPFJqGzpphmo2xNv__hS2ekzULqwx0HNkc3sDA6BdcgRkLoq-I4ntJK0wIUvEKbYQwIom-tv=w1002-h601-s-no?authuser=0"
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
                              color: #4e4e4e;
                            "
                          >
                            We are pleased to inform you that your
                            <strong>TechnoTweet 2k23</strong> registration for both Frontend and Backend workshop has been
                            successful!<br />
                            The event will be held on 15th and 16th of April 2023. It
                            will be a two-day workshop on the MERN stack.
                            <br />
                            <br />
                            Please do not hesitate to contact us if you have any queries
                            about the event.We will be happy to assist you in any way we
                            can.
                          </p>
        
                          <p></p>
                          <p>
                            <strong> TechnoTweet website:</strong>
                            <a href="https://technotweet.wcewlug.org/"
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
                              height: 100px;
                              margin-bottom: 15px;
                              max-height: 100px;
                              text-align: center;
                              color: #ffffff;
                            "
                            alt="Logo"
                            src="https://lh3.googleusercontent.com/TO30OWgM1vwxDbjUCci4qk74A1PhFAZPkSPsYh_P6eypFX1qFNCxHhJjR5YOOxvm6ttueIoL1iUYFF8EqpRYNPKN2vua77h6kQfVX-5ZSL-g7EH5NGN7xlDACN9OsfCv_A_2MyHcgwvrTmKr2aSI8jsVmK62PdRI6leD6gBjZOavN3pNrS_czkBuX4pRuF8LZAiKA1QPZdcsiB6oB15uyW04dOGQnZbQnO6qNwxFqQc4W_QNSU9Go31USa43jpG3wxG-E-pvFYVR8FVa2F6h5DEF3u-QfVCJYBz0aKYVyDwjtp6MEKANwdPdZi4DIHheXthpM5wpuNgNdIi-sEeUBnrfFj2YATQbRM4YIqofHve369jnnFJwyXPxAL0-fShlUrnyaBIegHW9l_VkZ1w9SmGSYcBIfg2t1Px1yuk5LOc3WiJisaLhO_AOD3_pmyVFAODDfsrQfbrnPpb2Xn7YjfaC3fDQn_wUXpeOe5FD_WMusfaR1NcHRcwKuvxGa04osKz1GBcRRdPYx37a2Jkx6NsoOC8Y-5ZiTdZI6dr6cB3HZHx5sxOOm4L9aA5QsNLHryQjEJ74zdafoy91Q8IkD8pTspYhYRAhzEmTSlcCCF66gtm8k5Zhm5SLBPJMTP4PiT4Xt7k4oGz_winvh5A_UVkTh3ysVFb3bxJ12hPVMhfINBOGGjop36muwKswEYgHdJ2EfMv0g0JIAvt-KjJhVX3I60pLcKU5pULLC3vaa_XhN8xH7x80STdD53KxO9spDjVbEMKXPTjtoz0FLLTxuLT1de5TS-bE1d6xwJZ-SvyRtbGoAyos134-bgZNItklRbi3XXKIZySAEbSHuo0YcwHnHmoZ_9zk9_BSO3VbfaesHxH_cP1sHUlLtvG4Z2SQO6Wsel5FCog1GoVzQXQWCQ9X9PK2Y2eFNmGfu88qyhyJcGUb=w429-h242-no?authuser=0"
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
                              src="https://lh3.googleusercontent.com/Ld_d5DP39PqswAvl0McBAOGUn4m15DCGOPk8xA_Yrw8is1p2LIygiXdAtLaq6oqLmFRaev_ah9L9RvVyhWjUJAya6hQr3aY-gSrlyKorbnTIvBDzyYQkTYLrEuYbFOI7nItwK8ehG5kMMNHD7L0TFbrlIdwu23RVz-ivwhmtuM8FpnR6B-DtwPAknUCmfYufY8XiJHBT-HJ9kQV5KyyKpr1fBcJYmlM6_B1j99iYzqDZ-KTqkv1yYhY6DdXbj_FwFJUJjmL-e1XH8oP28akyDFRi-PKPxQSDw2rAvZOb1DYWz6AortmteO-Q_qHTCGe6wn6mjNJXDKO5BTX_V3vcqTLhn3PcI46PNokjr8Z_zJKKo04Tb2Rblrfoh3Oli9J16UptYwM9WmQ-3KlDeWs3xr6KvfCX5E23jCI9eZa3h_hz2QymJnGSMJ5eQNcu7GVtqLLwHaOASuy49K5vEdWa8u8-KppphA6dPdPZ8PVTQuE9FR-piBkQFZu0orCkZPMPHlE_Jv3ivg-aK-AQNvo6I7UZrztckOAmzIMolBQD5Ca6_MpHyj66i32lNWdBZrvb6fbQk_1TZn92ZZvQRgJ58fev9erJsSD49sQBCk1QIR2STjLBWPOyaZQkQwpnGqXKtdypgajLQaVY-fMz6JpTUS1-1lPttVSs3KuuLhifeUBpItR0Npq5A03TZXA5_H0zXHb5gk-SUOew2waiFD0Kmy5dUf0GiwKUKj4FVFank5da0C27GAzNcpI7z62giu7JEca2OVSOVqpzefcYSXcjkNnSGcmGEhyNQgXtxxfvNqXyFh0EC3imyQpvBIhos_MfWLTiKRr6Ybwrzvngnndu2DscniKdWgCAjTls-JZsr_PgrxTQVcbqcYa6lULsgwZVKQeIp4-mogu5_2YhY_w9KzbYlqcD66WRCOJa9m3RWCl3U-EF=w356-h305-s-no?authuser=0"
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
