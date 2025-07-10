import React, { useState, useEffect } from "react";
import { Badge } from "antd";
import api from "../../config/axios";

const NotificationIcon = ({ onClick, className = "" }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications", {
        params: {
          page: 0,
          size: 1,
          sort: "createdAt,DESC",
        },
      });
      const totalElements = res.data.totalElements || 0;
      
      // Lấy số thông báo chưa đọc
      const unreadRes = await api.get("/notifications", {
        params: {
          page: 0,
          size: totalElements,
          sort: "createdAt,DESC",
        },
      });
      const unreadCount = (unreadRes.data.content || []).filter(n => !n.read).length;
      setUnreadCount(unreadCount);
    } catch (err) {
      console.error("Lỗi tải số thông báo:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Polling để cập nhật số thông báo mỗi 30 giây
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Badge count={unreadCount} size="small" offset={[-5, 5]}>
      <button
        onClick={onClick}
        className={`relative p-2 text-gray-600 hover:text-primary transition-colors ${className}`}
      >
        <i className="ri-notification-3-line ri-xl"></i>
      </button>
    </Badge>
  );
};

export default NotificationIcon; 