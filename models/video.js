const mongoose = require('mongoose');
//Try Some Form of Databse Optimisations
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
    },
    ModerationStatus :{
        type: Boolean
    },
    ReportStatus:{
        type: Boolean
    },
}, { timestamps: true })

module.exports = mongoose.model('Video', videoSchema);