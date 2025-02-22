const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const{listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// validate listingSchema to protect our website from server side "example hoppscotch, postman" are send wrong data to crash website
const validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    
    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};


// index Route(.get), Create route(.post), 
router.route("/")
.get(
   wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),// uploade imge;
    wrapAsync(listingController.createListing)
);

//New Route,
router.get("/new",isLoggedIn,(listingController.renderNewForm));
router.get("/mountInfo", listingController.categoryListings);
router.post("/findListings", listingController.findListings);


// Show Route(.get), update route(.put), delete route(.delete)
router.route("/:id") 
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"), 
    wrapAsync(listingController.Updatelisting))
.delete(
    isLoggedIn,wrapAsync(listingController.DeleteListings)
);


// edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.EditListings));


module.exports = router;