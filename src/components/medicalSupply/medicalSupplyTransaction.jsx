import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { getMedicalSupplyTransactions } from "../../services/api.medicalSupply";

const MedicalSupplyTransaction = ({ supplyId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!supplyId) return;
      setLoading(true);
      try {
        const data = await getMedicalSupplyTransactions(supplyId);
        setTransactions(data); 
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [supplyId]);

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "transactionDateTime",
      key: "transactionDateTime",
      render: (text) => new Date(text).toLocaleString("vi-VN"),
    },
    {
      title: "Loại giao dịch",
      dataIndex: "supplyTransactionType",
      key: "supplyTransactionType",
      render: (type) => {
        let color = type === "RECEIVED" ? "green" : type === "ISSUED" ? "red" : "orange";
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Người thực hiện",
      dataIndex: "performedBy",
      key: "performedBy",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ];

  return (
    <Table
      rowKey="transactionId"
      columns={columns}
      dataSource={transactions}
      loading={loading}
      pagination={5} 
    />
  );
};

export default MedicalSupplyTransaction;
