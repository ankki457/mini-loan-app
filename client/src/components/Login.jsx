import React, { useContext, useState } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken, setLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      if (!email || !password) throw "Please fill all fields!";
      const user = await axios.post(
        "https://mini-loan-app-gfv3.onrender.com/api/v1/auth/login",
        { email, password }
      );
      setUser(user.data.user);
      setToken(user.data.token);
      setLoggedIn(true);
      localStorage.setItem("token", user.data.token);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(`Can't login!\nError: ${error}`);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="bg-white p-4 rounded shadow w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4 text-primary">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-2">
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="mb-1">Don't have an account?</p>
          <a href="/signup" className="text-primary text-decoration-none">
            Create a new account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
