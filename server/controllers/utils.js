import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "supersecretkey";

export const createToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: "5h" });
};

export const verifyLogin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Authorization token missing");

    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error in verifyLogin:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
