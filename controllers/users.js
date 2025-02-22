const User = require("../models/user.js");
// Signup render page;
module.exports.renderSignupform = (req,res)=>{
    res.render("users/signup.ejs");
};

//Signup route
module.exports.Signup = async(req,res)=>{
    try{

        let{username, email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wanderlust");
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
    
};

// render login page

module.exports.renderloginForm = (req,res)=>{
    res.render("users/login.ejs");
};


module.exports.login = async(req,res)=>{
    req.flash("success","Welcome to wonderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings"; 
    res.redirect(redirectUrl);
};

//logout User 
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("Success","you are logged out");
        res.redirect("/listings");
    });
};