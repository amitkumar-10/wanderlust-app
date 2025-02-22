const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController = require("../controllers/users.js");


// Signup render page(.get), Signup route(.post)
router.route("/signup")
.get(
    UserController.renderSignupform )
.post(
    wrapAsync(UserController.Signup)
);

//render login page(.get), login user router(.post)
router.route("/login")
.get(
    UserController.renderloginForm)
.post(
    saveRedirectUrl,passport.authenticate("local", {
    failureRedirect: "/login", 
    failureFlash: true
   }),
    UserController.login
);


//logout user
router.get("/logout",UserController.logout );


module.exports = router;