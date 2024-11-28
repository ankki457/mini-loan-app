import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      if (!name || !email || !password) throw "Fill all fields!";
      const response = await axios.post(
        "https://loan-app-be-onjz.onrender.com/api/v1/auth/signup",
        { name, email, password }
      );
      console.log(response);  // Log the response to check for more details
      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(`Can't sign up!\nError: ${error.response?.data?.message || error.message}`);
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full md:w-96">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        <form className="space-y-4">
          <div>
            <label className="block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            onClick={handleSignup}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
