const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const{reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");



const validateReview = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    
    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};

// Reviews 
// Post Route 
router.post("/",isLoggedIn, validateReview, wrapAsync (reviewController.createReview));
 
//Delete Review route
 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.DeleteReview));

module.exports = router;