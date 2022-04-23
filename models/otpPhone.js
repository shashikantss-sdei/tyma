const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../config.json");
const phoneSchema = new mongoose.Schema({
   
    phoneN:{
        type: String,
        required:true
    },

    
},
    { timestamps: true }
);

phoneSchema.methods.generateJwt = ()=>{
    const  token = jwt.sign({
        _id: this._id,
        phoneN:this.phoneN
    }, config.JWT_SECRET);
    return token;
 }

// creating model
const Phone = new mongoose.model("Phone",phoneSchema);
module.exports = Phone;