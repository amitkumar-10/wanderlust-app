//Why we need to make wrapAsyanc function --> because try catch method is not afficent way to catch errors
module.exports = (fn)=>{ // this is direct function for export wrapAsync function to app.js file
        return (req,res,next)=>{
            fn(req,res,next)
            .catch(next);
        }
    }





// function wrapAsync(fn){ // this is actual way to write: wrapAsyanc function 
//     return function(req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }