import React, { createContext, useState, useContext, useEffect } from "react";
import { message } from "antd"; // For Ant Design alerts
import { useNavigate } from "react-router-dom"; // For redirecting to the homepage

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Function to read user data and expiration time from cookies
  const getUserFromCookies = () => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_data=")); // Find the cookie containing user data
    if (cookie) {
      const userData = JSON.parse(decodeURIComponent(cookie.split("=")[1])); // Decode and parse user data
      return userData;
    }
    return null;
  };

  // Function to save user data in cookies with expiration time (5 minutes)
  const setUserInCookies = (userData) => {
    const expirationTime = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes from now
    document.cookie = `user_data=${encodeURIComponent(
      JSON.stringify(userData)
    )}; path=/; expires=${expirationTime.toUTCString()}`; // Store user data in cookie
  };

  // On page load, check if user data is stored in cookies and set it
  useEffect(() => {
    const userData = getUserFromCookies();
    if (userData) {
      setUser(userData); // Set the user from cookies if it exists
    } else {
      // Show alert and redirect to home if user data does not exist
      message.warning("Session expired. Please log in again.");
      navigate("/"); // Redirect to homepage
    }
  }, []);

  // Function to log in the user and save user data in cookies
  const login = (userData) => {
    setUser(userData);
    setUserInCookies(userData); // Save user data to cookies on login
  };

  // Function to log out the user
  const logout = () => {
    setUser(null);
    document.cookie =
      "user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // Clear user data cookie on logout
    message.info("You have been logged out."); // Optional message when logging out
    navigate("/"); // Redirect to homepage on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
