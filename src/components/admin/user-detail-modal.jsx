import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Spin, message, Tag } from "antd";
import api from "../../config/axios";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LinkOutlined,
  StopOutlined,
} from "@ant-design/icons";

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
          <Descriptions.Item label="Số điện thoại">
            {user.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            {(() => {
              let color = "default";
              let label = user.role;

              switch (user.role) {
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
                default:
                  color = "default";
                  label = user.role;
              }

              return <Tag color={color}>{label}</Tag>;
            })()}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            <Tag
              color={user.isActive ? "green" : "red"}
              icon={
                user.isActive ? (
                  <CheckCircleOutlined />
                ) : (
                  <CloseCircleOutlined />
                )
              }
            >
              {user.isActive ? "Hoạt động" : "Bị khóa"}
            </Tag>
          </Descriptions.Item>

          {/* Chỉ hiện với phụ huynh */}
          {user.role === "Phụ huynh" && (
            <Descriptions.Item label="Liên kết học sinh">
              <Tag
                color={user.linkedToStudent ? "green" : "red"}
                icon={
                  user.linkedToStudent ? <LinkOutlined /> : <StopOutlined />
                }
              >
                {user.linkedToStudent ? "Có" : "Không"}
              </Tag>
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
    </Modal>
  );
};

export default UserDetailModal;
