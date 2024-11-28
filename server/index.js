import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import loanRouter from "./routes/loanRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Database connection error:", err));

// Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/loans", loanRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
