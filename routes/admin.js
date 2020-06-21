const express = require("express");
const router = express.Router();
const Users = require("../models/user");
const Videos = require("../models/video");
const Moderators = require("../models/moderator");
const Admin = require("../models/admin");
const ContactMessages=require("../models/ContactMessages");
const bcrypt = require("bcryptjs");
const fetch = require('node-fetch');
const { stringify } = require('querystring');
//Admin Routes will go here
router.get("/dashboard", (req, res) => {
    Users.find({}, (err, foundUsers) => {
        if (err) {
            console.log(err);
        } else {
            Videos.find({}, (err, foundVideos) => {
                if (err) {
                    console.log(err);
                } else {
                    Moderators.find({}, (err, foundModerators) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render("Admin/AdminPanel", { Users: foundUsers, Videos: foundVideos, Moderators: foundModerators });
                        }
                    });
                }
            });
        }
    });
});
router.get("/signup", (req, res) => {
    res.render("Admin/AdminSignup");
});
router.get("/login", (req, res) => {
    res.render("Admin/login");
});

//@ SHOW USER LOG OUT PAGE
router.get("/logout", function (req, res) {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

//@ POST Saving User In the Database
router.post("/signup", async (req, res) => {
    //If Captcha wasn't filled
    if (!req.body['g-recaptcha-response']) {
        req.flash("error", "Please Select Captcha");
        res.redirect("/admin/signup");
    } else {
        const query = stringify({
            secret: process.env.CaptchaServerKey,
            response: req.body.captcha,
            remoteip: req.connection.remoteAddress
        });
        const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
        const body = await fetch(verifyURL);
        // If not successful
        if (body.success !== undefined && !body.success) {
            req.flash("error", "Captcha Failed");
            res.redirect("/admin/signup");
        } else {
            //If Success
            let hash = bcrypt.hashSync(req.body.password, 14);
            req.body.password = hash;
            const admin = {
                AdminName: req.body.AdminName,
                AdminEmail: req.body.AdminEmail,
                password: req.body.password,
                ApproovedStatus: false
            }
            let registered_admin = new Admin(admin);
            console.log(registered_admin);
            registered_admin.save(function (err, doc) {
                if (err) {
                    req.flash("error", "Already Taken Email/Username");
                    res.redirect("/admin/signup");
                } else {
                    req.flash("success", "Signup was successfull, you can login after approval by owners");
                    res.redirect("/admin/signup");
                }
            });
        }
    }
});
router.post("/contact", (req,res)=>{
    Message=new ContactMessages(req.body);
    Message.save();
    req.flash("success", "Message Sent To admins");
    res.redirect("/");
});
module.exports = router;