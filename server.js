const config = require("./config.json");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

//db connection
mongoose.connect(config.MONGO_URL).then((data)=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log("no connection");
});

// configration 
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

// routes
//therpist routes
app.use("/api/therpistRoutes", require("./routes/therpistRoutes"));
//dashboard routes
app.use("/api/dashRoutes",require("./routes/dashboardRoutes"));


app.listen(config.PORT,(req,res)=>{
    console.log(`server is runninng on the:http://localhost:${config.PORT}`);
});