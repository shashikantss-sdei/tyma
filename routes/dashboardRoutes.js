const express = require("express");
const router = express.Router();
const upload = require("../uploadDocuments/uploadDocument");
const dashboardController = require("../controller/dashboardController");

//sign up
router.post("/signUp", dashboardController.SignUp);

// login
router.post("/login",dashboardController.Login);

// single document upload
router.post("/singleDocument", upload.single('file'),dashboardController.singleDocumentUpload);
// multiple document
router.post("/multipleDocument",upload.array('files'), dashboardController.multipleUploadDcoment);

//login with Otp
router.post("/loginOtp", dashboardController.login_with_otp)

// verify otp
router.post("/verifyOtp", dashboardController.verifyOtp);
module.exports = router;