const mongoose = require("mongoose")


const connectDB = async () => {
    try{
         await mongoose.connect(process.env.MONGO_ATLAS_URL);
        console.log("connected to mongo db");
    }catch(err){
        console.log(" could not connect to mongodb", err);
        process.exit(1);
    }
}

module.exports = connectDB;