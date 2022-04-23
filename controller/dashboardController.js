const Dash = require("../models/dashboardModel");
const Otp = require("../models/otpModel");
const Phone = require("../models/otpPhone");
const bcrypt = require("bcrypt");
const _ = require("lodash");  
const Jwt = require("jsonwebtoken");
config = require("../config.json");
const validator = require("validator");
const  SingleFile = require("../models/fileUploads/singlefileModel");
const MultipleFile = require("../models/fileUploads/multiplefilemodel");
const generateOTP = require("otp-generator");
const dashboardController = {
    SignUp:async(req,res)=>{
        try{
         console.log(req.body);
         const {name, email, password} = req.body;
         const user = await Dash.findOne({email});
         if(user){
             return res.status(400).json({msg:"User already exists"});
         }
 
        const passwordHash = await bcrypt.hash(password, 10);
         const newUser = new Dash({
             name:name,
             email:email,
             password:passwordHash,
             
            
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
    Login:async(req,res)=>{
      try{
       console.log(req.body);
       const {email, password} = req.body;
       const validate = validator.isEmail(email);
       if(!validate){
           return res.status(400).json({message:"email format is not valid"
         });
       }
       const user = await Dash.findOne({email});
       if(!user){
           return res.status(400).json({message:"User is not exists"});
       }
       const isMatch = await bcrypt.compare(password,user.password);
       if(!isMatch){
           return res.status(400).json({message:"password does not matched"});
       }
       const Token  = Jwt.sign({
        id:user._id,

    },config.SECRET_KEY,{expiresIn:"7d"});
       return res.status(200).json({
           message:"Login success",
           data:user,
           token:Token
       });
       }catch(err){
         return res.status(500).json({err:err.message}); 
      }
    },
 
   //login with mobile otp
   login_with_otp:async(req,res)=>{
       try{
    console.log(req.body.phoneN);
    const user = await Phone.findOne({
        phoneN: req.body.phoneN
      });
      if(user){
        return res.status(400).json({msg:"phone number  already exists"})
      }
     
      const OTP = generateOTP.generate(7,{
        digits:true,
        // alphabets:false,
        // upperCase:false,
        // specialChars:false
      });
      const phoneN = req.body.phoneN;
      console.log(OTP);
      console.log(phoneN);
      const otp = new Otp({phoneN:phoneN,otp:OTP});
      const salt = await bcrypt.genSalt(10);
       otp.otp =  await bcrypt.hash(otp.otp,salt);
      await otp.save();
      return res.status(200).json({msg:"Otp successfully send"});
 
       }catch(err){
           return res.status(500).json({err:{message:"Some error ocuured!"}});
       }
   },

   // verifyOtp
   verifyOtp:async(req,res)=>{
    try{
     // console.log(req.body.phoneN);
      const otpHolder = await Otp.find({
        phoneN:req.body.phoneN
      })
      
      if(otpHolder.length === 0) return res.status(400).send("You use an expired otp");
      const rightOtp = otpHolder[otpHolder.length -1];
      const validUser = await bcrypt.compare(req.body.otp, rightOtp.otp);
      if(rightOtp.phoneN === req.body.phoneN && validUser){
        const user = new Phone(_.pick(req.body,["phoneN"]));
        const token = user.generateJwt();
        const result = await user.save();
        const otpDelete = await Otp.deleteMany({
          phoneN:rightOtp.phoneN
        });
        console.log(result);
        console.log(token);
        return res.status(200).send({
          msg:" login Successful",
          token:token,
          data:result
        });
      }else{
        return res.status(400).json({msg:"Your otp was wrong"});
      }
    }catch(err){
      return res.status(500).json({msg:err.message});
    }
   
  },

   /// single document upload
   singleDocumentUpload:async(req,res, next)=>{
    try{
        const file = new SingleFile({
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
        });
        await file.save();
        res.status(201).json({
           message: 'Document Uploaded Successfully'});

    }catch(err){
        return res.status(500).json({message:err.message});
    }
},

//MultipleFile document upload
multipleUploadDcoment
:async(req,res,next)=>{
    try{
        let filesArray = [];
        req.files.forEach(element => {
            const file = {
                fileName: element.originalname,
                filePath: element.path,
                fileType: element.mimetype,
                fileSize: fileSizeFormatter(element.size, 2)
            }
            filesArray.push(file);
        });
        const multipleFiles = new MultipleFile({
            title: req.body.title,
            files: filesArray 
        });
        await multipleFiles.save();
        res.status(201).send('Document Uploaded Successfully');
    }catch(err){
       return res.status(500).json({
           message:err.message
       });
    }
},

}

const fileSizeFormatter = (bytes, decimal) => {
    if(bytes === 0){
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];

}

module.exports = dashboardController;