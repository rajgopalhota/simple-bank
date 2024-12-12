import React, { useState } from "react";
import { Button, Input, notification } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "../axios"; // Assuming this is configured to point to your backend
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Send a GET request with username and password as query parameters
      const response = await axios.post(
        `/api/users/login?username=${username}&password=${password}`
      );

      if (response.data) {
        login(response.data); // Assuming the response contains user details without the password
        navigate("/home");
      } else {
        notification.error({ message: "Invalid credentials" });
      }
    } catch (error) {
      notification.error({ message: "Login failed" });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl">Login</h1>
      <Input
        className="mt-4"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input.Password
        className="mt-4"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button className="mt-4" onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
};

export default Login;
