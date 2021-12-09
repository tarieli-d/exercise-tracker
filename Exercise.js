var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://taro:studenti2017@cluster0.887gh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.set("debug", true);

var exerciseSchema = new mongoose.Schema({
  user_id: String,
  description: String,
  duration: Number,
  date: String
});

var Exercise = mongoose.model("Exercise", exerciseSchema);

//handles get requests
router.get(["/:date", "/shorturl/:shorturl", "/whoami", "/"], function(
  req,
  res,
  next
) {
  try {
    Exercise.findOne({ short_url: req.params.shorturl }, function(err, url) {
      if (err) return console.log(err);
      res.json(1);
    });
  } catch (e) {
    res.json(e);
  }
});

//post submitted url
router.post("/:_id/exercises", function(req, res, next) {
  let lookupUrl = req.body;
  let date = req.body.date.toDateString() || new Date().toDateString();
  let description = req.body.description;
  let duration = req.body.duration;
  //arr.push({ original_url: req.body.url, short_url: arr.length + 1 });
  const Prom = () => {
    return new Promise((resolve, reject) => {
      var exerciseDoc = new Exercise({
        user_id: req.params._id,
        description: description,
        duration: duration,
        date: date
      });
      exerciseDoc.save(function(err, data) {
        if (err) return console.error(err);
      });
      resolve();
    });
  };
  Prom().then(() => {
    mongoose.User.findOne({ _id: req.params._id }, function(err, user) {
      if (err) return console.log(err);
      res.json({ ...user,description: description, duration: duration, date: date });
    });
  });
});

module.exports = router;

/**
1) Install & Set up mongoose 
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

// 2) Create a 'Person' Model 
var personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favoriteFoods: [String]
});

// 3) Create and Save a Person 
var Person = mongoose.model('Person', personSchema);

var createAndSavePerson = function(done) {
  var janeFonda = new Person({name: "Jane Fonda", age: 84, favoriteFoods: ["eggs", "fish", "fresh fruit"]});

  janeFonda.save(function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  });
};

// 4) Create many People with `Model.create()`
var arrayOfPeople = [
  {name: "Frankie", age: 74, favoriteFoods: ["Del Taco"]},
  {name: "Sol", age: 76, favoriteFoods: ["roast chicken"]},
  {name: "Robert", age: 78, favoriteFoods: ["wine"]}
];

var createManyPeople = function(arrayOfPeople, done) {
  Person.create(arrayOfPeople, function (err, people) {
    if (err) return console.log(err);
    done(null, people);
  });
};
const findPeopleByName = (personName, done) => {
  Person.find({name: personName},function (err, people) {
    if (err) return console.log(err);
    done(null, people);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food},function (err, people) {
    if (err) return console.log(err);
    done(null, people);
  });
};

const findPersonById = (personId, done) => {
  Person.findById({_id:personId},function (err, people) {
    if (err) return console.log(err);
    done(null, people);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
    Person.findById({_id:personId},function (err, person) {
    if (err) return console.log(err);
      person.favoriteFoods.push(foodToAdd);
      person.save((err, updatedPerson) => {
      if(err) return console.log(err);
      done(null, updatedPerson)
    })
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {age: ageToSet},{new: true}, (err, updatedDoc) => {
    if(err) return console.log(err);
    done(null, updatedDoc);
  });
  };

const removeById = (personId, done) => {
    Person.findByIdAndRemove({_id: personId}, (err, updatedDoc) => {
    if(err) return console.log(err);
    done(null, updatedDoc);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
Person.remove({name: nameToRemove}, (err, updatedDoc) => {
    if(err) return console.log(err);
    done(null, updatedDoc);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
    var e=Person.find({favoriteFoods: foodToSearch}).sort({name:1}).limit(2).select({ age: 0 });
    e.exec((err, people) =>{
    if (err) return console.log(err);
    done(err, people);
  });
};


//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;

 */
