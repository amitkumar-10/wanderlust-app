const { query } = require("express");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


//index route for searching
module.exports.index = async(req,res,)=>{ 
    const allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
             
};

//new route
module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};


//show route
module.exports.showListing= async(req,res)=>{
    let{id} =req.params;
    const listing = await Listing.findById(id)
      .populate({//to print review author;
        path:"reviews",
        populate:{ //extrate author for review;
            path: "author",
        },
    })
      .populate("owner")//populate("owner")to show owner bellow listing;
    
    
    if(!listing){
        req.flash("error", "Listing you request for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};


//create new listing
module.exports.createListing = async(req,res,next)=>{
    let response= await geocodingClient
        .forwardGeocode({
        query: req.body.listing.location, 
        limit:1,
    })
    .send();

        
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id; 
    newlisting.image ={url, filename};

    newlisting.geometry = response.body.features[0].geometry;

    let savedlisting = await newlisting.save();
    console.log(savedlisting);

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

//Catagory
module.exports.categoryListings = async (req, res) => {
    let { category } = req.query;
    let listings = await Listing.find();
    let listingCategory = listings.filter(listing => listing.category === category);
    res.render("listings/listingCategory", { listingCategory })
}


// Search/find listings;
module.exports.findListings = async (req, res) => {
    let listLocation = req.body.list.location;
    let findListings = await Listing.find();
    let foundListings = findListings.filter(listing => listing.location === listLocation);
    if (foundListings.length === 0) {
        req.flash("error", "No listings found in this location");
        return res.redirect("/listings");
    }
    res.render("listings/foundListings.ejs", { foundListings });
}


//edit route
module.exports.EditListings = async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let origenalImageurl = listing.image.url;
    origenalImageurl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing});
};


//update route
module.exports.Updatelisting = async(req,res)=>{
    let{id} = req.params;
    let listings = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if( typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listings.image = {url, filename};
    await listings.save();
    }
    req.flash("success", "Update Successful");
    res.redirect(`/listings/${id}`);
};


// delete listings
module.exports.DeleteListings = async(req,res)=>{
    let{id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};