const mongoose = require('mongoose');
const videoSchema = mongoose.Schema({
    author: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        Username: String
    },
    VideoTitle: {
        type:String,
        maxlength:50,
    },
    VideoDescription: {
        type: String,
    },
    VideoFilePath : {
        type: String,
    },
    VideoLocation: String,
    VideoViews : {
        type: Number,
        default: 0 
    },
    LikedUsers:[
        {
            Username: String
        }
    ],
    UnlikedUsers:[
        {
            Username: String
        }
    ],
    LikesQuantity:{
        type: Number,
        default: 0
    },
    VideoDuration :{
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Video', videoSchema);