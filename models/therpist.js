const mongoose = require("mongoose");

const therpistSchema = new mongoose.Schema({
    nickname:{
        type:String,
        required:true,
        trim:true,
        min:3,
        max:10
    },

    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true,
        minlength:8
    },
    confirmPassword:{
        type:String,
        minlength:8
    },
    companyLicence:{
        type:String,
        required:true
    },

    sectorArea:{
        type:String,
        required:true
    },

    ageInterval:{
        type:String,
        required:true
    },
    resetLink:{
        data:String,
        default:""
    }

    
},
{timestamps:true}
);

// creating collection or model

const Thepist = mongoose.model("Therpist",therpistSchema);
module.exports = Thepist;