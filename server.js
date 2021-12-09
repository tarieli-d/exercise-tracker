var util= require('util');
var encoder = new util.TextEncoder('utf-8');
// where your node app starts
var Users = require("./User");
// init project
var express = require("express");
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.use("/api/users/", Users);

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
