import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_URL);
    // const connect = await mongoose.connect(process.env.DB_URL+process.env.DB_NAME);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;