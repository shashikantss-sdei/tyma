const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:3,
        max:10
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    speciality:{
        type:String,
        default:""
    },
    Languages:{
        type:String,
        default:""
    },
    
},
{
    timestamps:true
}
);

// creating collection
module.exports = new mongoose.model("Dash", dashboardSchema);