require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log("MongoDB connection with SUCCESS");


    } catch (e) {
        console.error("MongoDB connection FAIL");
        process.exit(1);
    }
}

module.exports = connectDB;