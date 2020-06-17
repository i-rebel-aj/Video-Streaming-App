const express = require("express");
const router = express.Router();
const Users = require("../models/user");
const Videos = require("../models/video");
const Moderators =require("../models/moderator");
//Admin Routes will go here
router.get("/", (req, res) => {
    Users.find({}, (err, foundUsers) => {
        if (err) {
            console.log(err);
        } else {
            Videos.find({}, (err, foundVideos) => {
                if (err) {
                    console.log(err);
                }else{
                    Moderators.find({}, (err, foundModerators)=>{
                        if(err){
                            console.log(err);
                        }else{
                            res.render("Admin/AdminPanel", {Users: foundUsers, Videos: foundVideos, Moderators: foundModerators});
                        }
                    });
                }
            });
        }
    });
});
module.exports = router;