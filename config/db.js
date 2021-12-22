const mongoose = require('mongoose');
const config = require('config');
const mongoURI = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB is Connected');
    } catch (err) {
        console.log('Error ==>> ', err.message);
        process.exit(1);
    }
}

module.exports = connectDB;