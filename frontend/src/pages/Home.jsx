import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, notification, Card, Col, Row } from 'antd';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth(); // User data from context
  const [showBalance, setShowBalance] = useState(false);
  const [mpin, setMpin] = useState('');
  const [isMpinModalVisible, setIsMpinModalVisible] = useState(false);

  // Error handling for user data
  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-semibold text-gray-700">User data not found. Please log in again.</h1>
      </div>
    );
  }

  const handleShowBalance = () => {
    setIsMpinModalVisible(true);
  };

  const handleMpinSubmit = () => {
    if (mpin === user.mpin) { // Validate MPIN against stored one in user data
      setShowBalance(true);
      setIsMpinModalVisible(false);
    } else {
      notification.error({ message: 'Invalid MPIN' });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-red-700">Welcome, {user.username}</h1>

      <Row gutter={16} className="mt-6">
        <Col span={12}>
          <Card title="User Information" bordered={false}>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Balance:</strong> {showBalance ? user.balance : '****'}</p>
          </Card>
        </Col>
      </Row>

      <Button onClick={handleShowBalance} className="mt-4 bg-gray-500 text-white hover:bg-gray-600">
        Show Balance
      </Button>

      <Modal
        title="Enter MPIN"
        open={isMpinModalVisible}
        onOk={handleMpinSubmit}
        onCancel={() => setIsMpinModalVisible(false)}
        okText="Submit"
        cancelText="Cancel"
      >
        <Input
          type="password"
          value={mpin}
          onChange={(e) => setMpin(e.target.value)}
          placeholder="Enter MPIN"
          maxLength={6}
        />
      </Modal>
    </div>
  );
};

export default Home;
