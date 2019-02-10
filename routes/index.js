var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    middleware = require("../middleware")

// landing page
router.get("/", function(req, res){
	res.render("landing");
});


//=============
// AUTH ROUTES
//=============

// show the register form 
router.get("/register", function(req, res){
	res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		} 	
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

// show the login form
router.get("/login",  function(req, res){
	res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(){
});

// logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});


module.exports = router