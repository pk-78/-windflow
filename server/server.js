import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import productRoutes from "./routes/productRoutes.js"


dotenv.config();

const Port = process.env.PORT || 6500;
const app = express();

app.use(express.json());
app.use(cors());

app.use(bodyParser.json());

// Database connection
connectDB();

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/product", productRoutes)

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(Port, () => {
  console.log(`Server started on http://localhost:${Port}`);
});

//set default route
app.get("/", (req, res) => {
  res.send("hello jee");
});
app.get("/api/v1/user/getAllOrders/:id")