const express = require("express");
const router = express.Router();
const Videos=require("../models/video");
router.get("/:id", (req,res)=>{
    Videos.findById(req.params.id, (err, foundVideo)=>{
        if(err){
            console.log(err);
        }else{
            res.render("Video/video", {video: foundVideo});
        }
    });
});
module.exports=router;