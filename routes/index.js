const express = require("express");
const router = express.Router();
const multer = require("multer");
const Videos = require("../models/video");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const middleware = require("../middleware/index");
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink);
const fetch = require('node-fetch');
const { stringify } = require('querystring');
/*===============================================================
    Setting Up Multer Here (To Save the Video in Upload Folder)
=================================================================*/
//cb stands for callback
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
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

/*===========================================
    Handling User Authentication Part Here
=============================================*/

//@ SHOW USER SIGN UP PAGE
router.get("/signup", (req, res) => {
    res.render("Index/signup");
});

//@ SHOW USER LOG IN PAGE
router.get("/login", (req, res) => {
    res.render("Index/login");
});

//@ SHOW USER LOG OUT PAGE
router.get("/logout", middleware.isLoggedIn, function(req, res) {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

//@ POST Saving User In the Database
router.post("/signup", async(req, res) => {
    let hash = bcrypt.hashSync(req.body.password, 14);
    req.body.password = hash;
    let registered_user = new User(req.body);
    registered_user.save(function(err, doc) {
        if (err) {
            req.flash("error", "Already Taken Email/Username");
            res.redirect("/signup");
        } else {
            req.flash("success", "Signup was successfull, now you can login");
            res.redirect("/login");
        }
    });
});
//@ POST Logging in the User
router.post("/login", function(req, res) {
    User.findOne({ Username: req.body.Username }, (err, user) => {
        if (err || !user || !(bcrypt.compareSync(req.body.password, user.password))) {
            req.flash("error", "Incorrect Username/Password");
            req.session.isLoggedIn = false;
            res.redirect("/");
        } else {
            //console.log("Login is successfull");
            req.flash("success", "Login Successfull");
            //Setting Up the session
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect("/");
        }
    });
});

/*==============================================
    Support Handling
================================================*/
router.get("/support", (req, res) => {
    res.send("Support Page Will Go Here");
});
router.get("/contact", (req, res) => {
    res.render("Index/contact");
});





/*===============================================
    Video Handling
=================================================*/

// @GET request to display the Landing Page (Show "Trending" Videos)
router.get("/", (req, res) => {
    Videos.find({ ModerationStatus: true }, (err, allVideos) => {
        if (err) {
            console.log(err);
        } else {
            allVideos.forEach((video) => {
                video.comparator = video.LikedUsers.length / (Date.now() - video.createdAt);
            });
            allVideos.sort((a, b) => (a.comparator < b.comparator) ? 1 : ((b.comparator < a.comparator) ? -1 : 0));
            res.render("Index/landing", { Videos: allVideos, showingLatest: false });
        }
    });
});

// @GET to open the upload video page
router.get("/uploadVideo", middleware.isLoggedIn, (req, res) => {
    res.render("Index/upload");
});


//@ GET LATEST APPROOVED VIDEOS
router.get("/latest", (req, res) => {
    Videos.find({ ModerationStatus: true }, (err, allVideos) => {
        if (err) {
            console.log(error);
        } else {
            allVideos.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : ((b.createdAt < a.createdAt) ? -1 : 0));
            res.render("Index/landing", { Videos: allVideos, showingLatest: true });
        }
    });

});

// @POST to upload the video and save path in database
router.post("/uploadVideo", middleware.isLoggedIn, (req, res) => {
    User.findById(res.locals.currentUser._id, (err, foundUser) => {
        if (err) {
            console.log(error);
        } else {
            upload(req, res, err => {
                if (err) {
                    console.log(err);
                } else {
                    let author = {
                        id: res.locals.currentUser._id,
                        Username: res.locals.currentUser.Username
                    }
                    let videoDetails = req.body;
                    videoDetails.VideoFilePath = req.file.path;
                    videoDetails.author = author;
                    videoDetails.ModerationStatus = false;
                    videoDetails.ReportStatus = false;
                    Videos.create(videoDetails, (err, newlyCreated) => {
                        if (err) {
                            console.log(err);
                        } else {
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

// @POST To Add Video to be reported
router.post("/report/:id", middleware.isLoggedIn, (req, res) => {
    Videos.findById(req.params.id, (err, foundVideo) => {
        if (err) {
            console.log(err);
        } else {
            //Mutating Directly a bad programming practice
            foundVideo.ReportStatus = true;
            //console.log("After Report Status");
            //console.log(foundVideo);
            foundVideo.save();
            req.flash("success", "Video has been reported and will be viewd by moderator or admin");
            res.redirect("/");
        }
    });
});

//@ Delete The Video, Users Array is also deleted
router.delete("/video/:id", upload, async(req, res) => {
    Videos.findById(req.params.id, async(err, foundVideo) => {
        if (err) {
            console.log(err);
        } else {
            User.findById(foundVideo.author.id, (err, foundUser) => {
                if (err) {
                    console.log(err);
                } else {
                    foundUser.Videos.forEach((id, index) => {
                        if (id.equals(req.params.id)) {
                            console.log(index);
                            foundUser.Videos.splice(index, 1);
                            console.log(foundUser);
                            foundUser.save();
                        }
                    });
                }
            });
            await unlinkAsync(foundVideo.VideoFilePath);
            foundVideo.remove();
            backURL = req.header('Referer') || '/';
            req.flash("error", "Video Deleted Successfully");
            if (backURL.includes("/video")) {
                res.redirect("/admin/dashboard");
            } else {
                res.redirect("back");
            }
        }
    });
});
module.exports = router;