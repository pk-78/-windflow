// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.YOUR_CLOUD_NAME,
  api_key: process.env.YOUR_API_KEY,
  api_secret: process.env.YOUR_API_SECRET,
});

console.log("Cloudinary config:", {
  cloud_name: process.env.YOUR_CLOUD_NAME,
  api_key: process.env.Your_API_KEY,
  api_secret: process.env.Your_API_SECRET,
});

export default cloudinary;
