var express = require("express"),
	router = express.Router(),
	Campground = require("../models/campground"),
	methodOverride = require("method-override"),
	middleware = require("../middleware")
// =============
// Campgrounds
// =============

// INDEX - show all campgrounds
router.get("/", function(req, res){
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

// CREATE - add new campground to DB
router.post("/", function(req,res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name:name, price: price, image: image, description: description, author: author};
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			res.redirect("/campgrounds");
		}
	})
});
 
// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT Campground route
// show the edit form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err)
		} else{
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});
// In the views/edit.ejs we need to change the name to be campground[name], campground[image], so on
// so that we can use req.body.campground to pass in the data rather than use req.body.name, req.body.image ...

// UPDATE Campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
	})
})

module.exports = router;