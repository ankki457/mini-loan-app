import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  user_type: { type: String, default: "user" },
});

const Auth = mongoose.model("Auth", authSchema);

export default Auth;
