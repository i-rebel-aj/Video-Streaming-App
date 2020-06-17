var mongoose=require("mongoose");
var ModeratorSchema=new mongoose.Schema({
    Name: {
        type:String,
        required: true
    },
    Email: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    Username:{
        type: String,
        required: true,
        unique: true
    },
    VideosModerated:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ]
},{ timestamps: true });
module.exports=mongoose.model("Moderator", ModeratorSchema);