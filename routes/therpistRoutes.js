const express = require("express");
const router = express.Router();
const therpistController = require("../controller/therpistController");
//

// signup
router.post("/signup", therpistController.therpistSignUp);
// login
router.post("/Login", therpistController.therpistLogin);

// forget password
router.post("/forgetPassword", therpistController.forgetPassword);

// reset password
router.get("/reset_Passowrd", therpistController.reset_Password);
module.exports = router;