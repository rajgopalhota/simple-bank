import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { Table } from 'antd';
import { useAuth } from '../context/AuthContext';

const History = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/transactions/history', { headers: { Authorization: `Bearer ${user.token}` } });
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions');
      }
    };

    fetchTransactions();
  }, [user]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Recipient',
      dataIndex: 'recipient',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl">Transaction History</h1>
      <Table dataSource={transactions} columns={columns} rowKey="id" />
    </div>
  );
};

export default History;
