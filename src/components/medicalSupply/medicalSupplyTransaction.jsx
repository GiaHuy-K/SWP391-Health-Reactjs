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

  const typeMap = {
    "Nhập kho mới": { color: "green" },
    "Sử dụng cho sự cố": { color: "red" },
    "Điều chỉnh giảm": { color: "orange" },
    "Điều chỉnh tăng": { color: "blue" },
    "Trả lại từ sự cố": { color: "purple" },
    "Loại bỏ hết vì hết hạn": { color: "magenta" },
  };

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
        const info = typeMap[type] || { color: "gray" };
        return <Tag color={info.color}>{type}</Tag>;
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
      pagination={{  showSizeChanger: true, pageSizeOptions: ["5","10", "20", "50"] }}
    />
  );
};

export default MedicalSupplyTransaction;
