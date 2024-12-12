import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to read user data from cookies
  const getUserFromCookies = () => {
    const cookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("user_data=")); // Find the cookie containing user data
    if (cookie) {
      const userData = JSON.parse(decodeURIComponent(cookie.split("=")[1])); // Decode and parse user data
      return userData;
    }
    return null;
  };

  // Function to save user data in cookies
  const setUserInCookies = (userData) => {
    document.cookie = `user_data=${encodeURIComponent(JSON.stringify(userData))}; path=/`; // Store user data in cookie
  };

  // On page load, check if user data is stored in cookies and set it
  useEffect(() => {
    const userData = getUserFromCookies();
    if (userData) {
      setUser(userData); // Set the user from cookies if it exists
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setUserInCookies(userData); // Save user data to cookies on login
  };

  const logout = () => {
    setUser(null);
    document.cookie =
      "user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // Clear user data cookie on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
