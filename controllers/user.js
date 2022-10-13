const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.homePage = async function(req, res) {
    if (req.session.user) {
        // Get the user.
        let user = await User.findById(req.session.user);
        // Render the home page
        res.render("pages/home", {
            name: user.first_name + ' ' + user.last_name,
            isLoggedIn: true
        });
    } else {
        // Redirect to the login page
        res.redirect("/login");
    }
}

exports.loginPage = function(req,res){
     // check whether we have a session
     if(req.session.user){
        // Redirect to log out.
        res.redirect("/logout");
    }else{
        // Render the login page.
        res.render("pages/login",{
            "error":"",
            "isLoggedIn": false
        });
    }
}

exports.processLogin = async function(req,res){
    // get the data.
    let email = req.body.email;
    let password = req.body.password;
    // check if we have data.
    if(email && password){
        // check if the user exists.
        let existingUser = await User.findOne({email:email}).select('password');
        if(existingUser){
            // compare the password.
            let match = await bcrypt.compare(password,existingUser.password);
            if(match){
                // set the session.
                req.session.user = existingUser._id;
                // Redirect to the home page.
                res.redirect("/");
            }else{
                // return an error.
                res.render("pages/login",{
                    "error":"Invalid password",
                    isLoggedIn: false
                });
            }
        }else{
            // return an error.
            res.render("pages/login",{
                "error":"User with that email does not exist.",
                isLoggedIn:false
            });
        }
    }else{
        res.status(400);
        res.render("pages/login",{
            "error":"Please fill in all the fields.",
            isLoggedIn:false
        });
    }
}

exports.signupPage = function(req,res){
    // Check whether we have a session
    if(req.session.user){
        // Redirect to log out.
        res.redirect("/logout");
    } else {
        // Render the signup page.
        res.render("pages/signup",{
            "error":"",
            isLoggedIn:false
        });
    }
}

exports.processSignup = async function(req,res){
    // Get the data.
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let password = req.body.password;
    // Check the data.
    if(first_name && last_name && email && password){
        // Check if there is an existing user with that email.
        let existingUser = await User.findOne({email:email});
        if(!existingUser){
            // hash the password.
            let hashedPassword = bcrypt.hashSync(password,10);
            // create the user.
            let newUser = new User({
                first_name:first_name,
                last_name:last_name,
                email:email,
                password:hashedPassword
            });
            // save the user.
            newUser.save(function(err){
                if(err){
                    // return an error.
                    res.render("pages/signup",{
                        "error":"Something went wrong when creating account.",
                        isLoggedIn:false
                    });
                }else{
                    // set the session.
                    req.session.user = newUser._id;
                    // Redirect to the home page.
                    res.redirect("/");
                }
            });
        }else{
            // return an error.
            res.render("pages/signup",{
                "error":"User with that email already exists.",
                isLoggedIn:false
            });
        }
    }else{
        // Redirect to the signup page.
        res.render("pages/signup",{
            "error":"Please fill in all the fields.",
            isLoggedIn:false
        });
    }
}

exports.logoutPage = function(req,res){
    // clear the session.
    req.session.destroy();
    // Redirect to the login page.
    res.redirect("/login");    
}