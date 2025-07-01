import { Table, message, Switch, Tag, Button } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import UserDetailModal from "../admin/user-detail-modal";

function DashboardTemplate({ columns, uri }) {
  const [newColumns, setNewColumns] = useState();
  const [data, setData] = useState([]);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // hàm vô hiệu hóa người dùng theo id khi clich vào
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
  // màu cho 3 role
  const formatRole = (role) => {
    let color = "gray";
    let label = role;

    switch (role) {
      case "Nhân viên Y tế":
        color = "green";
        label = "Y tá";
        break;
      case "Phụ huynh":
        color = "purple";
        label = "Phụ huynh";
        break;
      case "Quản lý Nhân sự/Nhân viên":
        color = "volcano";
        label = "Quản Lý";
        break;
    }

    return <Tag color={color}>{label}</Tag>;
  };

  const handleViewDetail = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const formattedColumns = columns.map((col) =>
      col.dataIndex === "role" ? { ...col, render: formatRole } : col
    );

    const tableColumns = [
      ...formattedColumns,
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

      const raw = response.data;
      const content = Array.isArray(raw.content) ? raw.content : [];

      setData(content);
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
      setData([]);
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
        rowKey="userId"
        onRow={(record) => ({
          onClick: (event) => {
            const tagName = event.target.tagName;
            const className = event.target.className;

            // Nếu người dùng click vào Switch, Button, Tag... thì không mở modal
            if (
              tagName === "BUTTON" ||
              tagName === "INPUT" || // Switch là input
              tagName === "SPAN" || // Một số component con trong Switch
              String(className).includes("ant-switch") ||
              String(className).includes("ant-btn") ||
              String(className).includes("ant-tag")
            ) {
              return;
            }

            // Ngược lại mới mở modal
            handleViewDetail(record.userId);
          },
        })}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          defaultPageSize: 10,
        }}
      />
      {/* Modal xem chi tiết */}
      <UserDetailModal
        userId={selectedUserId}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default DashboardTemplate;
