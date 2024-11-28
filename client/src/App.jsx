import { createContext, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import CreateLoan from "./components/CreateLoan";

export const AuthContext = createContext();

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  const navigate = (path) => {
    // Use navigate from react-router instead of window.location
    window.location.href = path;
  };

  const fetchUser = async (token) => {
    if (!token) return;
    try {
      const userDetails = await axios.get(
        "https://loan-app-be-onjz.onrender.com/api/v1/auth/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!userDetails.data) throw "No user found";
      setUser(userDetails.data.user);
      setToken(token);
      setLoggedIn(true);
    } catch (err) {
      console.error(err);
      setLoggedIn(false);
      setUser(null);
      localStorage.removeItem("token"); // Clear invalid token from local storage
      navigate("/login"); // Redirect to login if token is invalid
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchUser(token);
  }, []);

  // A reusable ProtectedRoute component
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Login />;
  };

  // A reusable UnprotectedRoute component
  const UnProtectedRoute = ({ children }) => {
    return !isLoggedIn ? children : <Home />;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><Home /></ProtectedRoute>,
    },
    {
      path: "/login",
      element: <UnProtectedRoute><Login /></UnProtectedRoute>,
    },
    {
      path: "/signup",
      element: <UnProtectedRoute><Signup /></UnProtectedRoute>,
    },
    {
      path: "/createLoan",
      element: <ProtectedRoute><CreateLoan /></ProtectedRoute>,
    },
  ]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, user, setUser, token, setToken }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
