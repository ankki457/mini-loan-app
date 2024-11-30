import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRET_KEY || "iuhadfjk";

export const createToken = (payload) => {
  return jwt.sign(payload.toJSON(), secretKey, { expiresIn: "5h" });
};

export const verifyLogin = async (req, res, next) => {
  try {
    // Extract Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ err: "Authorization header is missing!" });
    }

    // Ensure the token is in the "Bearer <token>" format
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ err: "Token is missing!" });
    }

    // Verify the token
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach user data to the request object for later use
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(400).json({ err: "Login expired!\nPlease login again!" });
  }
};
