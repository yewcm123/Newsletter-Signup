const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require('dotenv').config()

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/5a10ec503d";
  const options = {
    method: "POST",
    auth: "yewcm:"+ process.env.MAILCHIMP_API,
  };
  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        console.log(response)
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => console.log("Server is listening on port 3000"));

//List Id
//5a10ec503d
