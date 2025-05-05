const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        const dbConnction = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected successfully ${dbConnction.connection.host}`);
    } catch (e) {
        console.log(`Error connecting to database ${e}`);
        process.exit(1);
    }
};

module.exports = connectDB;
