import { LogoutOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import React from "react";
import {
  Link,
  NavLink,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import History from "./pages/History";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Transaction from "./pages/Transaction";

const Navbar = () => {
  const { logout, user } = useAuth();
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const logoutContent = (
    <div className="text-center">
      <p className="mb-2">Are you sure you want to logout?</p>
      <div className="flex justify-center space-x-2">
        <Button type="primary" danger onClick={handleLogout}>
          Yes
        </Button>
        <Button type="default">No</Button>
      </div>
    </div>
  );

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-baseline py-4">
          {/* Logo */}
          <h1 className="text-2xl font-bold tracking-wide hover:text-gray-300">
            Digi Banking
          </h1>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-6">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `text-lg ${
                  isActive ? "text-yellow-300" : "hover:text-gray-300"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/transaction"
              className={({ isActive }) =>
                `text-lg ${
                  isActive ? "text-yellow-300" : "hover:text-gray-300"
                }`
              }
            >
              Transaction
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `text-lg ${
                  isActive ? "text-yellow-300" : "hover:text-gray-300"
                }`
              }
            >
              History
            </NavLink>
            {user ? (
              <Popover
                content={logoutContent}
                trigger="click"
                placement="bottomRight"
              >
                <Button
                  color="danger"
                  variant="solid"
                  icon={<LogoutOutlined />}
                >
                  Logout
                </Button>
              </Popover>
            ) : (
              <>
                <Link to={"/"}>
                  <Button
                    color="primary"
                    variant="outlined"
                    icon={<LogoutOutlined />}
                  >
                    Login
                  </Button>
                </Link>
                <Link to={"/register"}>
                  <Button
                    color="primary"
                    variant="outlined"
                    icon={<LogoutOutlined />}
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const App = () => (
  <AuthProvider>
    <div className="gradient" />
    <Router>
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  </AuthProvider>
);

export default App;
