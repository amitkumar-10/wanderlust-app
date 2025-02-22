const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj,owner:"67b99010bec5e78ea57c1fd0"}));//to add regesterd user in data base for make owner of all listings;
  initData.data = initData.data.map((obj) => ({ ...obj, category: 'Trending' }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();