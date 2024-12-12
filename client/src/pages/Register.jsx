import React, { useState } from 'react';
import { Button, Input, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('/auth/register', { email, password });
      notification.success({ message: 'Registration successful' });
      navigate('/login');
    } catch (error) {
      notification.error({ message: 'Registration failed' });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl">Register</h1>
      <Input
        className="mt-4"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input.Password
        className="mt-4"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button className="mt-4" onClick={handleRegister}>Register</Button>
    </div>
  );
};

export default Register;
