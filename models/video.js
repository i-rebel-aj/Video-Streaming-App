/*        This is the Video Schema
 *        VideoLoction Implies the place from which video was uploaded from
 *
 */

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
    VideoLocation: {
        type: String
    },
    LikedUsers:[
        {
            Username: String
        }
    ],
    ModerationStatus :{
        type: Boolean
    },
    ReportStatus:{
        type: Boolean
    },
}, { timestamps: true })

module.exports = mongoose.model('Video', videoSchema);