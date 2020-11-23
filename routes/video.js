const express = require("express");
const router = express.Router();
const Videos = require("../models/video");
const middleware = require("../middleware/index");
router.get("/view/:id", (req, res) => {
    Videos.findById(req.params.id, (err, foundVideo) => {
        if (err) {
            console.log(err);
        } else {
            res.render("Video/View", { video: foundVideo });
        }
    });
});
router.put("/approve/:id", (req, res) => {
    Videos.findById(req.params.id, (err, foundVideo) => {
        if (err) {
            console.log(err);
        } else {
            foundVideo.ModerationStatus = true;
            foundVideo.ReportStatus = false;
            foundVideo.save();
            backURL = req.header('Referer') || '/';
            console.log(`Previous URL Was ${backURL}`);
            req.flash("Success", "Video was Moderated Sucessfully");
            res.redirect("/admin/dashboard");
        }
    });
});
router.put("/:id/like", middleware.isLoggedIn, (req, res) => {
    Videos.findById(req.params.id, (err, foundVideo) => {
        if (err) {
            console.log(err);
        } else {
            const likingUser = { Username: req.session.user.Username };
            if (foundVideo.LikedUsers.indexOf(likingUser) === -1) {
                foundVideo.LikedUsers.push(likingUser);
                foundVideo.save();
                res.sendStatus(200);
            }
        }
    });
});
router.put("/:id/unlike", middleware.isLoggedIn, (req, res) => {
    Videos.findById(req.params.id, (err, foundVideo) => {
        if (err) {
            console.log(err);
        } else {
            //Add Optimizations
            foundVideo.LikedUsers.forEach((user, index) => {
                if (user.Username === req.session.user.Username) {
                    foundVideo.LikedUsers.splice(index, 1);
                    foundVideo.save();
                    res.sendStatus(200);
                }
            });
        }
    });
});
module.exports = router;