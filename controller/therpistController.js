const Therpist = require("../models/therpist");
const config = require("../config.json");
const validator = require("validator");
const bcrypt  = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

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

////////////////////forget password
    forgetPassword:async(req,res)=>{
      try{ 
          console.log(req.body);
          const email = req.body.email
          const user = await Therpist.findOne({email:email});
          if(user){
              const randomString = randomstring.generate();
              sendEmailResetPasswordMail(user.name,user.email,randomString)
              const data =await Therpist.updateOne({email:email},{$set:{resetLink:randomString}});
              return res.status(200).json({
                  message:"Please check your mail box and reset  your password",
                  data:data
              })
          }else{
              return res.status(400).json({err:{message:"this email deos not exists"}});
          }
      }catch(err){
          return res.status(500).json({err:{message:"Some error occured!"}});
      }
  },

  ///////////////reset password

  reset_Password:async(req,res)=>{
    try{
      const token = req.query.resetLink;
      const tokenData = await User.findOne({token:resetLink});
      if(tokenData){
          password = req.body.password;
           const newPassword = await bcrypt.hash(password,10);
           const updateData = await User.findByIdAndUpdate({_id:tokenData._id},{$set:{password:newPassword, token:''}},{new:true});
           return res.status(200).json({
               message:"Password has been reset successfully",
               data:updateData,
               token:token
           })
      }
      else{
          return res.status(400).json({message:"Token link has been expired or incorrect token "});
      }
    }catch(err){
        return res.status(500).json({
            err:{
                message:"Some error occured",
            }
        })
    }
 },

}


const sendEmailResetPasswordMail= async(name,email,resetLink)=>{
  try{
  const transporter =  nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        auth:{
            user:config.emailUser,
            pass:config.userPass,
        }

    });

    const mailOptions = {
        from:config.emailUser,
        to:email,
        subject:'reset passowrd',
        html:`<h1> ${name} please reset your password for use of the given url: ${config.client_url}/reset_Password/${resetLink}</h1>`
    }
    transporter.sendMail(mailOptions,(error,response)=>{
      if(error){
          console.log(error);
      }
      else{
          console.log("Mail has been sent", response.response);
      }
    });
      
  }catch(err){
      return res.status(400).json({err:{message:err.message}})
  }

}

module.exports = therpistController;