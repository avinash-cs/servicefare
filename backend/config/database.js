const mongoose = require('mongoose');

const connectDB = async () => {
    const res = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Database connected successfully to ${res.connection.host}`);
}

module.exports = connectDB;