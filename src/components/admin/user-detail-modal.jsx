import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Spin, message } from "antd";
import api from "../../config/axios";

const UserDetailModal = ({ userId, open, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !userId) return;

    setLoading(true);
    api
      .get(`/admin/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch(() => message.error("Không lấy được thông tin người dùng"))
      .finally(() => setLoading(false));
  }, [userId, open]);

  return (
    <Modal
      title="Chi tiết người dùng"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      {loading ? (
        <Spin />
      ) : (
        <Descriptions column={1}>
          <Descriptions.Item label="Họ tên">{user.fullName}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{user.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">{user.role}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">{user.isActive ? "Hoạt động" : "Bị khóa"}</Descriptions.Item>
          <Descriptions.Item label="Liên kết học sinh">
            {user.linkedToStudent ? "✅ Có" : "🚫 Không"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default UserDetailModal;
