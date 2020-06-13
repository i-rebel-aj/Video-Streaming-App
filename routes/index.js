var express = require("express");
var router = express.Router();
const multer = require("multer");
var Videos = require("../models/video");
var User = require("../models/user");
var bcrypt = require("bcryptjs");
var middleware = require("../middleware/index");
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink);
router.get("/signup", (req, res) => {
    res.render("Index/signup");
});
router.get("/login", (req, res) => {
    res.render("Index/login");
});
router.get("/logout", function(req,res){
    if (req.session) {
        req.session.destroy(function(err) {
          if(err) {
            return next(err);
          } else {
            return res.redirect('/');
          }
        });
    }   
});
router.get("/latest", (req,res)=>{
    Videos.find({}, (err, allVideos)=>{
        if(err){
            console.log(error);
        }else{
            allVideos.sort((a,b) => (a.createdAt < b.createdAt) ? 1 : ((b.createdAt < a.createdAt) ? -1 : 0));
            res.render("Index/latest", {Videos: allVideos, State: "The United State"});
        }
    });
    
});
router.post("/viewState", (req,res)=>{
    //console.log(req.body);
    Videos.find({VideoLocation: req.body.State}, (err, foundVideos)=>{
        if(err){
            console.log(err);
        }else{
            res.render("Index/landing",{Videos: foundVideos, State: req.body.State});
        }
    });
});
router.post("/viewState/latest", (req,res)=>{
    Videos.find({VideoLocation: req.body.State}, (err, foundVideos)=>{
        if(err){
            console.log(err);
        }else{
            foundVideos.sort((a,b) => (a.createdAt < b.createdAt) ? 1 : ((b.createdAt < a.createdAt) ? -1 : 0));
            res.render("Index/latest",{Videos: foundVideos, State: req.body.State});
        }
    });
});
// @GET request to display the videos 
router.get("/", (req, res) => {
    Videos.find({}, (err, allVideos) => {
        if (err) {
            console.log(err);
        } else {
            res.render("Index/landing", { Videos: allVideos , State: "The United States"});
        }
    });
});

// @GET to open the upload video page
router.get("/uploadVideo", middleware.isLoggedIn, (req, res) => {
    res.render("Index/upload");
});
router.post("/signup", function (req, res) {
    //Hashing The Password
    let hash = bcrypt.hashSync(req.body.password, 14);
    req.body.password = hash;
    //Saving User in the databse
    let registered_user = new User(req.body);
    console.log(registered_user);
    registered_user.save(function (err, doc) {
        if (err) {
            if (err.code === 11000) {
                req.flash("error", "Already Taken Username");
                //console.log('User was already registered');
            }
        } else {
            req.flash("success", "Signup was successfull, now you can login");
            res.redirect("/");
        }
    });

});
router.post("/login", function (req, res) {
    User.findOne({ Username: req.body.Username }, (err, user) => {
        if (err || !user || !(bcrypt.compareSync(req.body.password, user.password))) {
            //console.log("Incorrect Email Password");
            req.flash("error", "Incorrect Username/Password");
            req.session.isLoggedIn = false;
            res.redirect("/");
        } else {
            //console.log("Login is successfull");
            req.flash("success", "Login Successfull");
            //Setting Up the session
            req.session.isLoggedIn = true;
            req.session.user = user;
            //console.log(req.session.userId);
            res.redirect("/");
        }
    });
});
//cb stands for callback
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.mp4') {
            //res.send("Only mp4 files allowed")
            console.log("Onlu mp4 file allowed");
        }
        cb(null, true);
    }
});
var upload = multer({ storage: storage }).single("Video");


// @POST to upload the video
router.post("/uploadVideo", middleware.isLoggedIn, (req, res) => {
   User.findById(res.locals.currentUser._id, (err, foundUser)=>{
        if(err){
            console.log(error);
        }else{
            upload(req,res,err=>{
                if(err){
                    console.log(err);
                }else{
                    var author = {
                        id: res.locals.currentUser._id,
                        Username: res.locals.currentUser.Username
                    }
                    var videoDetails=req.body;
                    videoDetails.VideoFilePath = req.file.path;
                    videoDetails.author=author;
                    //console.log("Video Details are");
                    //console.log(videoDetails);
                    Videos.create(videoDetails, (err, newlyCreated)=>{
                        if(err){
                            console.log(err);
                        }else{
                            foundUser.Videos.push(newlyCreated);
                            foundUser.save();
                            req.flash("success", "Video Uploaded Successfully");
                            res.redirect("/");
                        }
                    });
                }
            });
        }
   });
});
router.delete("/video/:id", upload, async(req,res)=>{
    Videos.findById(req.params.id, async(err, foundVideo)=>{
        if(err){
            console.log(err);
        }else{
            await unlinkAsync(foundVideo.VideoFilePath);
            foundVideo.remove();
            req.flash("error", "Video Deleted Successfully");
            res.redirect("/");
        }
    });
});
module.exports = router;