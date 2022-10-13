const express = require("express");
const router = express.Router();
const {homePage,loginPage,processLogin,signupPage,processSignup,logoutPage} = require("../controllers/user");

router.get("/",homePage); // Home page

router.get("/login",loginPage); // Login page

router.post("/login",processLogin); // Process login

router.get("/signup",signupPage); // Signup page

router.post("/signup",processSignup); // Process signup

router.get("/logout",logoutPage); // Logout

module.exports = router;