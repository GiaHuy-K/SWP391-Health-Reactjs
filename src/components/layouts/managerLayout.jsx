import React, { useState } from "react";
import {
  PieChartOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
  DashboardOutlined,
  BranchesOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Avatar, Dropdown, Space, message } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../config/AuthContext";
import { isParentRole } from "../../config/AuthContext";

const { Header, Content, Footer, Sider } = Layout;

const ManagerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: "dashboardM",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "event-Manager",
      icon: <PieChartOutlined />,
      label: "Quản lý sự cố",
    },
    {
      key: "supply-Manager",
      icon: <MedicineBoxOutlined />,
      label: "Quản lý vật tư y tế",
    },
    {
      key: "student-vaccination",
      icon: <BranchesOutlined />,
      label: "Thông tin tiêm chủng học sinh",
    },
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "Về trang chủ",
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "home") {
      navigate("/");
    } else {
      navigate(`/dashboardManager/${key}`);
    }
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === "logout") {
      logout();
      message.success("Đã đăng xuất");
      navigate("/");
    } else if (key === "profile") {
      navigate("/profile");
    } else if (key === "dashboard") {
      navigate("/dashboardManager/event-Manager");
    }
  };

  const userMenu = {
    items: isParentRole(user)
      ? [
          {
            key: "profile",
            label: "Hồ sơ",
            icon: <ProfileOutlined />,
          },
          {
            key: "logout",
            label: "Đăng xuất",
            icon: <LogoutOutlined />,
            danger: true,
          },
        ]
      : [
          {
            key: "dashboard",
            label: "Dashboard",
            icon: <DashboardOutlined />,
          },
          {
            key: "profile",
            label: "Hồ sơ",
            icon: <ProfileOutlined />,
          },
          {
            key: "logout",
            label: "Đăng xuất",
            icon: <LogoutOutlined />,
            danger: true,
          },
        ],
    onClick: handleUserMenuClick,
  };

  // Lấy key đang active từ URL path
  const currentPath = location.pathname.split("/")[2] || "event-Manager";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Quản lý
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentPath]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 22 }}>👋</span> Xin chào,{" "}
            <strong>{user?.fullName || "Quản lý"}</strong>
          </div>

          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                style={{ backgroundColor: "#1890ff" }}
                icon={<UserOutlined />}
              />
              <span style={{ fontWeight: 500 }}>
                {user?.fullName || "Quản lý"}
              </span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;
