//Importing Dependencies

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash=require("connect-flash");


//Requiring Routes
var indexRoutes=require("./routes/index");


//Connecting To Database
mongoose.connect("mongodb://localhost/BlackLivesMatter");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//Middlewares
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use('/uploads', express.static('uploads'));
app.use(methodOverride("_method"));
app.use(session({
   resave: false, // don't save session if unmodified
   saveUninitialized: false, // don't create session until something stored
   secret: 'shhhh, very secret lubba wubba dubba etc'
 }));
//To have a global variable across
app.use(function(req,res,next){
   if(req.session.isLoggedIn){
      res.locals.currentUser=req.session.user;   
   }else{
      res.locals.currentUser=null;
   }
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});


//Using Routes
app.use("/", indexRoutes);





app.get("*", (req,res)=>{
    res.send("Some Error page will go here");
});
app.listen(5000, function(){
    console.log("The Server has started");
});