const express = require("express");
const router = express.Router();
const Videos=require("../models/video");
router.get("/view/:id", (req,res)=>{
    Videos.findById(req.params.id, (err, foundVideo)=>{
        if(err){
            console.log(err);
        }else{
            res.render("Video/View", {video: foundVideo});
        }
    });
});
router.put("/approove/:id", (req,res)=>{
    Videos.findById(req.params.id, (err, foundVideo)=>{
        if(err){
            console.log(err);
        }else{
            foundVideo.ModerationStatus=true;
            foundVideo.ReportStatus=false;
            foundVideo.save();
            backURL=req.header('Referer') || '/';
            console.log(`Previous URL Was ${backURL}`);
            req.flash("Success", "Video was Moderated Sucessfully");
            res.redirect("/admin/dashboard");
        }
    });
});
module.exports=router;