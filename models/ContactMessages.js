var mongoose=require("mongoose");
var ContactMessageSchema=new mongoose.Schema({
        
    FromName: String,
        
    FromEmail: String,
        
    Message: String
},{ timestamps: true });
module.exports=mongoose.model("ContactMessage", ContactMessageSchema);
   