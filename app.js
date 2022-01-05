const { response } = require("express");
const express = require("express");
const https = require("https");

const app = express();

app.use(express.static("public"));

// these are used to send post/put request ONLY
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const name = req.body.name;
  const mail = req.body.email;
  const query = req.body.query;

  const data = {
    members: [
      {
        email_address: mail,
        status: "subscribed",
        merge_fields: {
          FNAME: name,
          QUERY: query,
        },
      },
    ],
  };

  const url = "https://us5.api.mailchimp.com/3.0/lists/a31f0709a4";
  const jsonData = JSON.stringify(data);
  const options = {
    method: "POST",
    auth: "Prakhar:4f9e8ea7ae81d8a7724951eae8455538-us5",
  };

  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      console.log(Number(JSON.parse(data).error_count));
      if (Number(JSON.parse(data).error_count) > 0) {
        res.sendFile(__dirname + "/error.html");
      } else {
        res.sendFile(__dirname + "/success.html");
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("server is listening...");
});

// api key : 4f9e8ea7ae81d8a7724951eae8455538-us5
// audience id : a31f0709a4
