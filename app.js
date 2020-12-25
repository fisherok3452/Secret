require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds =10;

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true,  useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, {secret: secret, encryptedFields:["password"]});
const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");
});
app.get("/register", function(req, res){
  res.render("register");
});
app.get("/login", function(req, res){
  res.render("login");
});


app.post("/register", function(req, res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err){
      if (err){
        console.log(err);
      }
      else if(req.body.username === "igortsvelykh@gmail.com"){
        res.render("friends", {
          img: "igor.jpg",
          textOne: "Привет, Игорёк!"
        });
      }
      else if(req.body.username === "sheingart.max@gmail.com"){
        res.render("friends", {
          img: "max.jpg",
          textOne: "Привет, Максимка!"
        });
      }
      else if(req.body.username === "jushangart@gmail.com"){
        res.render("friends", {
          img: "jura.jpg",
          textOne: "Привет, Хитрый Жир!"
        });
      }
      else {
        res.render("secrets");
      }
    });  // Store hash in your password DB.
  });

});

app.post("/login", function(req, res){
  const userEmail = req.body.username;
  const password = req.body.password;


  User.findOne({email:userEmail},function(err, foundUser){
    if (err){
      console.log(err);
    }
    else {if (foundUser){
      bcrypt.compare(password, foundUser.password, function(err, result) {
        res.render("secrets");// result == true
    });
    }}
  });

});




app.listen(3000, function(){
  console.log("Server work on port 3000");
});
