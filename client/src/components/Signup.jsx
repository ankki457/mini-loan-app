import React, { useContext, useState } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { setLoggedIn, setToken, setUser } = useContext(AuthContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password || !confirmPassword || !name) {
        throw "Please fill all fields!";
      }
      if (password !== confirmPassword) {
        throw "Passwords do not match!";
      }

      const user = await axios.post(
        "https://mini-loan-app-gfv3.onrender.com/api/v1/auth/signup",
        { email, password, name }
      );
      setUser(user.data.user);
      setToken(user.data.token);
      setLoggedIn(true);
      localStorage.setItem("token", user.data.token);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(`Can't create account!\nError: ${error}`);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="bg-white p-4 rounded shadow w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Signup</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              placeholder="Re-enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Signup
          </button>
        </form>
        <div className="text-center mt-3">
          <a href="/login" className="text-decoration-none">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
