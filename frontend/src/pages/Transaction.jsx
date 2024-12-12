import React, { useState } from 'react';
import { Input, Button, notification } from 'antd';
import axios from '../axios';
import { useAuth } from '../context/AuthContext';

const Transaction = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleSendMoney = async () => {
    try {
      await axios.post('/transaction/send', { amount, recipient }, { headers: { Authorization: `Bearer ${user.token}` } });
      notification.success({ message: 'Transaction Successful' });
    } catch (error) {
      notification.error({ message: 'Transaction Failed' });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl">Send Money</h1>
      <Input
        className="mt-4"
        placeholder="Recipient Account"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <Input
        className="mt-4"
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button className="mt-4" onClick={handleSendMoney}>Send</Button>
    </div>
  );
};

export default Transaction;
