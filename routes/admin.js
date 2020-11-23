const express = require("express");
const router = express.Router();
const Users = require("../models/user");
const Videos = require("../models/video");
const Admin = require("../models/admin");
const ContactMessages = require("../models/ContactMessages");
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
                    ContactMessages.find({}, (err, foundMessages) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render("Admin/AdminPanel", { Users: foundUsers, Videos: foundVideos, Messages: foundMessages });
                        }
                    });
                }
            });
        }
    });
});
router.get("/login", (req, res) => {
    res.send("Admin Login Page Goes Here!");
});
//@ SHOW USER LOG OUT PAGE
router.get("/logout", function(req, res) {
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
router.post("/contact", (req, res) => {
    Message = new ContactMessages(req.body);
    Message.save();
    req.flash("success", "Message Sent To admins");
    res.redirect("/");
});
module.exports = router;