const Therpist = require("../models/therpist");
const config = require("../config.json");
const validator = require("validator");
const bcrypt  = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

//const mailgun = require("mailgun.js");
//const DOMAIN = "";
//const mg = mailgun({api_key:config.Api_key, domain:DOMAIN});
const therpistController = {
   therpistSignUp:async(req,res)=>{
       try{
        console.log(req.body);
        const {nickname, email, password, confirmPassword,companyLicence,sectorArea,ageInterval} = req.body;
        const user = await Therpist.findOne({email});
        if(user){
            return res.status(400).json({msg:"User already exists"});
        }

       const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new Therpist({
            nickname:nickname,
            email:email,
            password:passwordHash,
            confirmPassword:undefined,
            companyLicence:companyLicence,
            sectorArea:sectorArea,
            ageInterval:ageInterval
        })
        await newUser.save();
        return res.status(201).json({
            messsage:" Register Successfully",
            data:newUser
        });
       }catch(err){
           return res.status(500).json({err:err.message});
       }
   },
// login
   therpistLogin:async(req,res)=>{
     try{
      console.log(req.body);
      const {email, password} = req.body;
      const validate = validator.isEmail(email);
      if(!validate){
          return res.status(400).json({message:"email format is not valid"
        });
      }
      const user = await Therpist.findOne({email});
      if(!user){
          return res.status(400).json({message:"User is not exists"});
      }
      const isMatch = await bcrypt.compare(password,user.password);
      if(!isMatch){
          return res.status(400).json({message:"password does not matched"});
      }
      const token = jwt.sign({_id:user._id}, config.JWT_SECRET,{expiresIn:"6"});

      return res.status(200).json({
          message:"Login success",
          data:user,
          token:token
      });
      }catch(err){
        return res.status(500).json({err:err.message}); 
     }
   },

    // Fotget Password
    forgetPassword:async(req,res)=>{
        try{
          const {email} = req.body;
          const user = await Therpist.findOne({email});
          if(user){
            return res.status(400).json({
              message:"User already exists"
            });
           }
          
           //
           // create token 
           const token = jwt.sign({_id:user._id}, config.ResetPassword_Key, {expiresIn:"15m"});
           const msg = {
       
               to: email, // Change to your recipient
               from: 'test@example.com', // Change to your verified sender
               subject: 'Account Activation Linnk',
               
               html: `<h2>Please active your email account link before 15 minutes</h2>
                    <p>${config.client_url}/resetPassword/${token}</p>
               `
             }
             return user.updateOne({resetLink:token},(err,data)=>{
               if(err){
                 return res.status(400).json({message:"password reset is not completed.."});
               }else{
               mg.message().send(msg, (error,body)=>{
                 if(error){
                   return res.status(400).json(error)
                 }
                 return res.status(200).json({
                   message:"Email has been sent: kindly follow the instruction"
                 })
               })
   
               }
             });

        }catch(err){
          return res.status(500).json({message:err.message});
        }
      },

      // reset password
      resetPassword:async(req,res)=>{
        try{
         const {resetLink,newPass} = req.body;
         if(resetLink){
          jwt.verify(resetLink, config.ResetPassword_Key,(err,decodedData)=>{
            if(err){
              return res.status(401).json({err:{message:"Incorrect token or it it expired"}})
            }
            const user =  Therpist.findOne({resetLink});
            if(!user){
              return res.status(400).json({message:"User does not exits"});
            }
            const obj = {
              password : newPass
            }
            user = _.extend(user,obj);
            user.save();
            return  res.status(200).json({message:"Your password has been changed successfuly"});
          })
         
         }
         else{
           return res.status(401).json({err:{message:"Authentication Error"}})
         }
        }catch(err){
          return res.status(500).json({err:{message:"Some server sidev error occured!"}});
        }
      },

}

module.exports = therpistController;