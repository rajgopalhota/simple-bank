import {
  LogoutOutlined,
  HomeOutlined,
  TransactionOutlined,
  HistoryOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Popover } from "antd";
import { useAuth } from "../context/AuthContext";
import { NavLink, Link } from "react-router-dom";

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
    <nav className="bg-gradient-to-r from-sky-800 to-purple-600 text-white shadow-lg top-0 z-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-baseline py-4">
          {/* Logo */}
          <div className="flex items-center justify-evenly">
          <h1 className="text-2xl font-bold tracking-wide">
              Digi Banking
            </h1>
          </div>
          {/* Nav Links */}
          <div className="hidden md:flex space-x-6">
            
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `text-lg flex items-center ${
                  isActive ? "text-yellow-300" : "hover:text-gray-300"
                }`
              }
            >
              <HomeOutlined className="mr-1" /> Home
            </NavLink>
            <NavLink
              to="/transaction"
              className={({ isActive }) =>
                `text-lg flex items-center ${
                  isActive ? "text-yellow-300" : "hover:text-gray-300"
                }`
              }
            >
              <TransactionOutlined className="mr-1" /> Transaction
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `text-lg flex items-center ${
                  isActive ? "text-yellow-300" : "hover:text-gray-300"
                }`
              }
            >
              <HistoryOutlined className="mr-1" /> History
            </NavLink>
            {user ? (
              <Popover
                content={logoutContent}
                trigger="click"
                placement="bottomRight"
              >
                <Button type="primary" danger icon={<LogoutOutlined />}>
                  Logout
                </Button>
              </Popover>
            ) : (
              <>
                <Link to={"/"}>
                  <Button type="primary" icon={<LoginOutlined />}>
                    Login
                  </Button>
                </Link>
                <Link to={"/register"}>
                  <Button type="primary" icon={<UserAddOutlined />}>
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

export default Navbar;
