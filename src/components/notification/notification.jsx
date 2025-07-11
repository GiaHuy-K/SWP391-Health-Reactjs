import React, { useEffect, useState } from "react";
import {
  List,
  Typography,
  Avatar,
  Badge,
  Tooltip,
  Pagination,
  Spin,
  message,
} from "antd";
import { BellOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import styles from "../../page/home/HomePage.module.css";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../config/AuthContext";
import { useNavigate } from "react-router-dom";
import HomeHeader from "../../page/home/header/HomeHeader";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Title, Text } = Typography;

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [showDropdown, setShowDropdown] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");

  const handleProfileClick = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  const handleDashboardClick = () => {
    switch (user?.role) {
      case "Quản trị viên Trường học":
        navigate("/dashboard");
        break;
      case "Quản lý Nhân sự/Nhân viên":
        navigate("/dashboardManager");
        break;
      case "Nhân viên Y tế":
        navigate("/dashboardNurse");
        break;
      default:
        break;
    }
    setShowDropdown(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowDropdown(false);
  };

  const handleLogoClick = () => navigate("/");

  const fetchNotifications = async (pageIndex = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/notifications", {
        params: {
          page: pageIndex - 1,
          size: pageSize,
          sort: "createdAt,DESC",
        },
      });
      setNotifications(res.data.content || []);
      setTotal(res.data.totalElements || 0);
    } catch (err) {
      console.error("Lỗi tải thông báo:", err);
      message.error("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Không thể đánh dấu đã đọc:", err);
    }
  };

  const handleNotificationClick = async (item) => {
    if (!item.read) {
      await markAsRead(item.id);
      setNotifications((prev) =>
        prev.map((noti) => (noti.id === item.id ? { ...noti, read: true } : noti))
      );
    }

    // if (item.link && typeof item.link === "string" && item.link.startsWith("/")) {
    //   window.open(item.link, "_blank");
    // }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  return (
    <div style={{ padding: 24 }}>
      <HomeHeader hideNavLinks={true} />

      <Title level={4}>
        Thông báo{" "}
        <Badge count={notifications.filter((n) => !n.read).length} size="small" />
      </Title>

      {loading ? (
        <Spin style={{ display: "block", marginTop: 80 }} />
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            locale={{
              emptyText: (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <BellOutlined style={{ fontSize: 40, color: "#ccc" }} />
                  <div style={{ marginTop: 16, color: "#999" }}>
                    Không có thông báo nào
                  </div>
                </div>
              ),
            }}
            renderItem={(item) => (
              <List.Item
                style={{
                  backgroundColor: item.read ? "#fff" : "#f0f5ff",
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 12,
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: !item.read
                    ? "0 2px 8px rgba(24,144,255,0.1)"
                    : "none",
                }}
                onClick={() => handleNotificationClick(item)}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={!item.read} offset={[-2, 2]}>
                      <Avatar
                        icon={<BellOutlined />}
                        style={{
                          backgroundColor: item.read ? "#d9d9d9" : "#1890ff",
                        }}
                      />
                    </Badge>
                  }
                  title={
                    <Text strong={!item.read}>
                      {item.fromUserFullName || "Hệ thống"}
                    </Text>
                  }
                  description={
                    <>
                      <div>{item.content}</div>
                      <Tooltip
                        title={dayjs(item.createdAt)
                          .tz("Asia/Ho_Chi_Minh")
                          .format("HH:mm:ss DD/MM/YYYY")}
                      >
                        <Text style={{ fontStyle: "italic", color: "#999" }}>
                          {dayjs(item.createdAt)
                            .tz("Asia/Ho_Chi_Minh")
                            .fromNow()}
                        </Text>
                      </Tooltip>
                    </>
                  }
                />
              </List.Item>
            )}
          />

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              showSizeChanger={false}
              onChange={(p) => setPage(p)}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Notification;
