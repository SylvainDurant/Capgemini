require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true, 
            useNewUrlParser: true
        });
        console.log("MongoDB connection with SUCCESS");


    } catch (e) {
        console.error("MongoDB connection FAIL");
        process.exit(1);
    }
}

module.exports = connectDB;