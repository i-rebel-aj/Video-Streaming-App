var express = require("express");
var router = express.Router();
//Moderator Routes will go here
router.get("/", (req,res)=>{
    res.send("Moderator Panel well go here");
});
module.exports = router;