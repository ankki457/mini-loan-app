import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Auth from "./models/auth.js"; // Adjust the path based on your project structure
import * as dotenv from "dotenv";

dotenv.config();

const addAdminUser = async () => {
  try {
    // Check connection string
    console.log("CONNECTION_URL:", process.env.CONNECTION_URL);

    // Connect to MongoDB
    const CONNECTION_URL = process.env.CONNECTION_URL;
    await mongoose.connect(CONNECTION_URL);
    console.log("Connected to database");

    // Hash the password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin user
    const adminUser = new Auth({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      user_type: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error adding admin user:", error);
  }
};

addAdminUser();
