var Users=require("../models/user");
var Videos=require("../models/video");
var middlewareObj={};
middlewareObj.isLoggedIn= function(req,res,next){
    if(req.session.isLoggedIn){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}
middlewareObj.checkVideoOwnership=(req,res,next)=>{
    if(req.session.isLoggedIn){
        Videos.findById(req.params.id, (err, foundVideo)=>{
            if(err){
                console.log(err);
            }else{
                if(foundVideo.author.Username===req.session.Username){
                    return next();
                }else{
                    req.flash("error", "You are not the author of this video");
                    res.redirect("/login");
                }
            }
        });
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}
module.exports=middlewareObj;