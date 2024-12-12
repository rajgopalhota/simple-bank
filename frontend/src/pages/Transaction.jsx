import React, { useState } from 'react';
import { Input, Button, notification, Modal } from 'antd';
import axios from '../axios';
import { useAuth } from '../context/AuthContext';

const Transaction = () => {
  const { user } = useAuth();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isRecipientValid, setIsRecipientValid] = useState(false);
  const [mpinModalVisible, setMpinModalVisible] = useState(false);
  const [mpin, setMpin] = useState(['', '', '', '', '', '']);

  const handleRecipientCheck = async () => {
    try {
      const response = await axios.get(`/api/users/check/${recipient}`);
      if (response.data) {
        setIsRecipientValid(true);
        notification.success({
          message: 'Recipient Valid',
          description: `The username "${recipient}" is valid.`,
        });
      } else {
        notification.error({
          message: 'Recipient Not Found',
          description: `The username "${recipient}" does not exist.`,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'An error occurred while checking the recipient.',
      });
    }
  };

  const handleSendMoney = async () => {
    if (mpin.join('') !== user.mpin) {
      notification.error({
        message: 'Incorrect MPIN',
        description: 'The MPIN entered is incorrect.',
      });
      return;
    }

    try {
      const data = {
        fromUser: user.username,
        toUser: recipient,
        amount: parseFloat(amount),
        mpin: mpin.join(''),
      };
      await axios.post('/api/transactions/transfer', data);
      notification.success({
        message: 'Success',
        description: 'Money sent successfully!',
      });
      setRecipient('');
      setAmount('');
      setMpin(['', '', '', '', '', '']);
      setIsRecipientValid(false);
    } catch (error) {
      notification.error({
        message: 'Transaction Failed',
        description: 'An error occurred while processing the transaction.',
      });
    } finally {
      setMpinModalVisible(false);
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
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-6">Send Money</h1>
      <Input
        className="mt-4 w-full max-w-lg border-blue-500 shadow-lg"
        placeholder="Recipient Username"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        disabled={isRecipientValid}
      />
      {!isRecipientValid && (
        <Button
          type="primary"
          className="mt-4 w-full max-w-lg text-lg py-3"
          size="large"
          onClick={handleRecipientCheck}
        >
          Check Recipient
        </Button>
      )}
      {isRecipientValid && (
        <>
          <Input
            className="mt-4 w-full max-w-lg border-blue-500 shadow-lg"
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            type="primary"
            className="mt-4 w-full max-w-lg text-lg py-3"
            size="large"
            onClick={() => setMpinModalVisible(true)}
          >
            Pay
          </Button>
        </>
      )}
      <Modal
        title={<span className="text-xl font-bold text-blue-600">Enter MPIN</span>}
        visible={mpinModalVisible}
        onCancel={() => setMpinModalVisible(false)}
        footer={null}
      >
        <div className="grid grid-cols-6 gap-2">
          {mpin.map((digit, index) => (
            <Input
              key={index}
              id={`mpin-${index}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleMpinChange(e.target.value, index)}
              className="w-full h-14 text-center text-2xl font-bold border border-blue-500 focus:ring-2 focus:ring-blue-400 shadow-md"
            />
          ))}
        </div>
        <Button
          type="primary"
          className="mt-6 w-full text-lg py-3"
          size="large"
          onClick={handleSendMoney}
        >
          Confirm Payment
        </Button>
      </Modal>
    </div>
  );
};

export default Transaction;
