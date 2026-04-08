const mongoose = require("mongoose")
const dns = require("dns")

dns.setServers(["1.1.1.1", "8.8.8.8"])

const connectDB = async () => {
    try{
        console.log(process.env.MONGO_ATLAS_URL)
         await mongoose.connect(process.env.MONGO_ATLAS_URL);
        console.log("connected to mongo db");
    }catch(err){
        console.log(" could not connect to mongodb", err);
        process.exit(1);
    }
}

module.exports = connectDB;