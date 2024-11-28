import Auth from "../models/auth.js";
import bcrypt from "bcrypt";
import { createToken } from "./utils.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      throw new Error("Incomplete details");
    }

    // Check for existing user
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      throw new Error("Account already exists! Please log in.");
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 5);
    const user = await Auth.create({ name, email, password: hashedPassword });

    // Remove sensitive data and create token
    const userWithoutPassword = { ...user.toJSON(), password: undefined };
    const token = createToken(userWithoutPassword);

    res.status(201).json({
      message: "Account successfully created",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Incomplete details");
    }

    const user = await Auth.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const userWithoutPassword = { ...user.toJSON(), password: undefined };
    const token = createToken(userWithoutPassword);

    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(400).json({ error: error.message });
  }
};
