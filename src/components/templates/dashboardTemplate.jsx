import {
  Button,
  Form,
  Table,
  message,
  Switch,

} from "antd";
import React, { useEffect, useState } from "react";
import api from "../../config/axios";

function DashboardTemplate({columns, uri }) {

  const [newColumns, setNewColumns] = useState();
  const [data, setData] = useState([]);
  
  const handleToggleActivation = async (userId, newStatus) => {
    try {
      await api.put(
        `/admin/users/${userId}/activation`,
        { isActive: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      message.success(
        `Đã ${newStatus ? "kích hoạt" : "vô hiệu hóa"} tài khoản`
      );
      fetchData();
    } catch (error) {
      console.error("Lỗi đổi trạng thái:", error);
      message.error("Thay đổi trạng thái thất bại");
    }
  };

  useEffect(() => {
    const tableColumns = [
      ...columns,
      {
        title: "Trạng thái",
        dataIndex: "isActive",
        key: "isActive",
        render: (isActive, record) => (
          <Switch
            checked={isActive}
            checkedChildren="Đang hoạt động"
            unCheckedChildren="Bị khóa"
            onChange={() => handleToggleActivation(record.userId, !isActive)}
          />
        ),
      },
    ];
    setNewColumns(tableColumns);
  }, [columns]);

  const fetchData = async () => {
    try {
      const response = await api.get(uri);
      console.log("Dữ liệu từ API:", response.data);

      // Vì BE trả về kiểu: { content: [...] }
      const raw = response.data;
      const content = Array.isArray(raw.content) ? raw.content : [];

      setData(content);
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
      setData([]); // tránh lỗi render
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Table
        columns={newColumns}
        dataSource={data}
        rowKey="userId" // rất quan trọng để tránh warning "each child should have a unique key"
      />
    </div>
  );
}

export default DashboardTemplate;
