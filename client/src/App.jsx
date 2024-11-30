import { createContext, useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import CreateLoan from "./components/CreateLoan";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export const AuthContext = createContext();

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const fetchUser = async (authToken) => {
    if (!authToken) return;
    try {
      console.log(authToken);
      const userDetails = await axios.get(
        "https://mini-loan-app-gfv3.onrender.com/api/v1/auth/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!userDetails.data) throw new Error("No user found");
      setUser(userDetails.data.user);
      setToken(authToken);
      setLoggedIn(true);
    } catch (err) {
      console.error(err);
      setLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    fetchUser(storedToken);
  }, []);

  const ProtectedRoutes = ({ component }) => {
    return isLoggedIn ? component : <Navigate to="/login" />;
  };

  const UnProtectedRoutes = ({ component }) => {
    return !isLoggedIn ? component : <Navigate to="/" />;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoutes component={<Home />} />,
    },
    {
      path: "/login",
      element: <UnProtectedRoutes component={<Login />} />,
    },
    {
      path: "/signup",
      element: <UnProtectedRoutes component={<Signup />} />,
    },
    {
      path: "/createLoan",
      element: <ProtectedRoutes component={<CreateLoan />} />,
    },
  ]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setLoggedIn,
        user,
        setUser,
        token,
        setToken,
      }}
    >
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
