var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://taro:studenti2017@cluster0.887gh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
//mongoose.set("debug", true);
var userSchema = new mongoose.Schema({
  username: String
});
var exerciseSchema = new mongoose.Schema({
  user_id: String,
  description: String,
  duration: Number,
  date: String
});

var Exercise = mongoose.model("Exercise", exerciseSchema);
var User = mongoose.model("User", userSchema);

//handles get requests
router.get(["/", "/:_id/logs"], function(req, res, next) {
  let lim = req.query.limit ? req.query.limit : 1000;
  var from = req.query.from ? new Date(req.query.from) : new Date("1111-11-11");
  var to = req.query.to ? new Date(req.query.to) : new Date();
  if (req.params._id != undefined) {
    User.findOne({ _id: req.params._id }).exec(function(err, user) {
      Exercise.find(
        { user_id: req.params._id },
        {
          _id: 0,
          _v: -1,
          date: {
            $gt: from.toDateString(),
            $lt: to.toDateString()
          }
        }
      )
        .select(["description", "date", "duration"])
        .limit(Number(lim))
        .exec(function(err, exer) {
          res.json({
            _id: req.params._id,
            username: user.username,
            count: Number(exer.length),
            log: [...exer]
          });
        });
    });
  } else {
    User.find({}).exec(function(err, users) {
      res.json(users);
    });
  }
});

//handle post request to store user and exercice in db
router.post(["/", "/:_id/exercises"], function(req, res, next) {
  if (req.params._id == undefined) {
    var userDoc = new User({ username: req.body.username });
    userDoc.save(function(err, data) {
      if (err) return console.error(err);
      res.json({ username: data.username, _id: data._id });
    });
  } else {
    let date = req.body.date
      ? new Date(req.body.date).toDateString()
      : new Date().toDateString();
    let description = req.body.description;
    let duration = req.body.duration;

    const Prom = () => {
      return new Promise((resolve, reject) => {
        var exerciseDoc = new Exercise({
          user_id: req.params._id,
          date: date,
          description: description,
          duration: duration
        });
        exerciseDoc.save(function(err, data) {
          if (err) return console.error(err);
        });
        resolve();
      });
    };
    Prom().then(() => {
      User.findOne({ _id: req.params._id }, function(err, user) {
        if (err) return console.log(err);
        res.json({
          username: user.username,
          date: date,
          description: description,
          duration: Number(duration),
          _id: user._id
        });
      });
    });
  }
});

module.exports = router;
