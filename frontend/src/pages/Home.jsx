import {
  DollarOutlined,
  EyeOutlined,
  MailOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  notification,
  Row
} from "antd";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";


const Home = () => {
  const { user } = useAuth(); // User data from context
  const [showBalance, setShowBalance] = useState(false);
  const [mpin, setMpin] = useState(["", "", "", "", "", ""]);
  const [isMpinModalVisible, setIsMpinModalVisible] = useState(false);

  // Error handling for user data
  if (!user) {
    return (
      <div className="mt-10 text-center">
        <h1 className="text-3xl font-semibold text-gray-700">
          User data not found. Please log in again.
        </h1>
      </div>
    );
  }

  const handleShowBalance = () => {
    setIsMpinModalVisible(true);
  };

  const handleMpinSubmit = () => {
    if (mpin.join("") === user.mpin) {
      // Validate MPIN against stored one in user data
      setShowBalance(true);
      setIsMpinModalVisible(false);
      setMpin(["", "", "", "", "", ""]);
    } else {
      notification.error({ message: "Invalid MPIN" });
    }
  };

  const handleMpinChange = (value, index) => {
    const newMpin = [...mpin];
    newMpin[index] = value.slice(-1); // Allow only the last digit entered
    setMpin(newMpin);

    if (value && index < mpin.length - 1) {
      const nextInput = document.getElementById(`mpin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <>
      <Row gutter={16} className="mt-6" align="middle">
        <Col span={12}>
          <img
            src="/bank.gif"
            alt="Bank"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </Col>
        <Col span={12}>
          <h1 className="text-4xl font-extrabold text-red-700 mb-6">
            Welcome, {user.username}
          </h1>
          <Card title="User Information" bordered={false} className="shadow-xl text-lg bg-blue-100">
            <p>
              <UserOutlined /> <strong>Username:</strong> {user.username}
            </p>
            <p>
              <MailOutlined /> <strong>Email:</strong> {user.email}
            </p>
            <p>
              <DollarOutlined /> <strong>Balance:</strong>{" "}
              {showBalance ? user.balance : "****"}
            </p>
          </Card>
          <Button
            onClick={handleShowBalance}
            className="mt-4 bg-gray-500 text-white hover:bg-gray-600 transition duration-200"
            icon={<EyeOutlined />}
          >
            Check Balance
          </Button>
        </Col>
      </Row>

      <Modal
        title={
          <span className="text-xl font-bold text-blue-600">Enter MPIN</span>
        }
        open={isMpinModalVisible}
        onOk={handleMpinSubmit}
        onCancel={() => setIsMpinModalVisible(false)}
        okText="Submit"
        cancelText="Cancel"
        className="mpin-modal"
      >
        <div className="grid grid-cols-6 gap-2">
          {mpin.map((digit, index) => (
            <Input
              key={index}
              id={`mpin-${index}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleMpinChange(e.target.value, index)}
              className="w-full h-14 text-center text-2xl font-bold border-2 border-blue-500 focus:ring-2 focus:ring-blue-400 shadow-md"
            />
          ))}
        </div>
      </Modal>
    </>
  );
};

export default Home;
