import React, { useState, useEffect } from "react";
import { Badge, List, Avatar, Typography, Spin, message } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Text } = Typography;

const NotificationDropdown = ({ isVisible, onClose, onUnreadCountChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications", {
        params: {
          page: 0,
          size: 5,
          sort: "createdAt,DESC",
        },
      });
      const data = res.data.content || [];
      setNotifications(data);
      const newUnreadCount = data.filter(n => !n.read).length;
      setUnreadCount(newUnreadCount);
      if (onUnreadCountChange) {
        onUnreadCountChange(newUnreadCount);
      }
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
      setNotifications(prev =>
        prev.map(noti => noti.id === id ? { ...noti, read: true } : noti)
      );
      const newUnreadCount = Math.max(0, unreadCount - 1);
      setUnreadCount(newUnreadCount);
      if (onUnreadCountChange) {
        onUnreadCountChange(newUnreadCount);
      }
    } catch (err) {
      console.error("Không thể đánh dấu đã đọc:", err);
    }
  };

  const handleNotificationClick = async (item) => {
    if (!item.read) {
      await markAsRead(item.id);
    }

    if (item.link && typeof item.link === "string" && item.link.startsWith("/")) {
      window.open(item.link, "_blank");
    }
    onClose();
  };

  const handleViewAll = () => {
    navigate("/notifications");
    onClose();
  };

  useEffect(() => {
    if (isVisible) {
      fetchNotifications();
    }
  }, [isVisible]);

  return (
    <div 
      className={`absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 ${
        isVisible ? 'block' : 'hidden'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Thông báo</h3>
        <Badge count={unreadCount} size="small" />
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Spin size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8">
            <BellOutlined style={{ fontSize: 32, color: "#ccc", marginBottom: 8 }} />
            <div className="text-gray-500">Không có thông báo nào</div>
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !item.read ? 'bg-blue-50' : ''
                }`}
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
                        size="small"
                      />
                    </Badge>
                  }
                  title={
                    <Text strong={!item.read} className="text-sm">
                      {item.fromUserFullName || "Hệ thống"}
                    </Text>
                  }
                  description={
                    <div>
                      <div className="text-xs text-gray-600 mb-1 line-clamp-2">
                        {item.content}
                      </div>
                      <Text className="text-xs text-gray-400">
                        {dayjs(item.createdAt).tz("Asia/Ho_Chi_Minh").fromNow()}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={handleViewAll}
            className="w-full text-center text-sm text-primary hover:text-indigo-600 font-medium"
          >
            Xem tất cả thông báo
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown; 