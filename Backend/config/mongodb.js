import mongoose from "mongoose";

const connectDB=async()=>{
try {
    await mongoose.connect(process.env.MONGODB);
    console.log("Connected to Database");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error.message);
    process.exit(1);
  }
};

export default connectDB