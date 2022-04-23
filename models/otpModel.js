const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    phoneN:{
        type: String,
        required:true
    },

    otp:{
        type:String,
        required:true
    },
    createdAt:{type:Date, default:Date.now,index:{expiresIn:300}}
   // After 5 minutes it deleted automatically from the database
},
{timestamps:true}
);

// creating model

const Otp = new mongoose.model("Otp", otpSchema);
module.exports = Otp;