var express = require("express"),
    app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),	
    methodOverride = require("method-override"),
	LocalStrategy = require("passport-local"),
	// Comment = require("./models/comment"),
	// Campground = require("./models/campground"),
	User = require("./models/user")
	// seedDB = require("./seeds");
	// seedDB();

//requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/index")


mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true });
// mongoose.connect("mongodb+srv://myusername:mypassword123@cluster0-vgedy.mongodb.net/yelp_camp?retryWrites=true",{ useNewUrlParser: true });


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "This is a secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// use routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", authRoutes);


app.listen(3000, function () {
  console.log('My YelpCamp SERVER IS RUNNING');
});