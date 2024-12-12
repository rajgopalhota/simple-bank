import React, { useState, useEffect } from "react";
import axios from "../axios";
import { Table } from "antd";
import { useAuth } from "../context/AuthContext";

const History = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`/api/transactions/user/${user.id}`);
        const parsedTransactions = response.data
          .map((transaction) => ({
            id: transaction.id,
            amount: transaction.amount,
            type: transaction.type,
            status: transaction.status,
            description: transaction.description,
            date: new Date(transaction.timestamp).toLocaleString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          }))
          .reverse();
        setTransactions(parsedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [user]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text, record) => (
        <span
          className={
            record.type === "CREDIT" ? "text-green-500" : "text-red-500"
          }
        >
          {record.type === "CREDIT" ? `+₹${text}` : `-₹${text}`}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span
          className={text === "SUCCESS" ? "text-green-600" : "text-red-600"}
        >
          {text}
        </span>
      ),
    },
  ];

  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold mb-5">Transaction History</h1>
      <Table
        dataSource={transactions}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
        className="bg-white shadow-sm"
      />
    </div>
  );
};

export default History;
