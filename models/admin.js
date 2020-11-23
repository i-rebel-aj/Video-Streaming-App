var mongoose = require("mongoose");
var AdminSchema = new mongoose.Schema({
    AdminName: {
        type: String,
        required: true
    },
    AdminEmail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    ApproovedStatus: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });
module.exports = mongoose.model("Admin", AdminSchema);