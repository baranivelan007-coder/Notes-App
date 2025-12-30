const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URL;
        if (!uri) {
            console.error('MONGO_URL is not set. Please add MONGO_URL to your .env file.');
            process.exit(1);
        }
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;