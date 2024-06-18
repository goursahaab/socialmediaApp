
const mongoose = require("mongoose");

exports.connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
};