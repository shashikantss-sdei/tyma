const express = require("express");
const router = express.Router();
const therpistController = require("../controller/therpistController");
//

// signup
router.post("/signup", therpistController.therpistSignUp);
// login
router.post("/Login", therpistController.therpistLogin);

// forget password
router.put("/forgetPassword", therpistController.forgetPassword);

// reset password
router.put("/resetPassowrd", therpistController.resetPassword);
module.exports = router;