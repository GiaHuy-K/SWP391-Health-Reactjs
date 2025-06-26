import React, { useState } from "react";
import {
  UserOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  SolutionOutlined,
  UserSwitchOutlined,
  TeamOutlined,
  PlusOutlined,
  PieChartOutlined,
  ProfileOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Avatar, Dropdown, Space, message } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../config/AuthContext";
import { isParentRole } from "../../config/AuthContext";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children, link = true) {
  return {
    key,
    icon,
    children,
    label: link ? <Link to={`/dashboard/${key}`}>{label}</Link> : label, // lấy thông tin để chuyển trang khi nhấn vào
    // item bên dưới (key quan trọng)
  };
}

const items = [
  getItem("Tổng quan", "overview", <PieChartOutlined />),
  getItem(
    "Người dùng",
    "users",
    <SolutionOutlined />,
    [
      getItem("Quản Lý", "staff", <TeamOutlined />),
      getItem("Y Tá", "nurse", <MedicineBoxOutlined />),
      getItem("Phụ Huynh", "parent", <UserSwitchOutlined />),
      getItem("Tạo tài khoản", "add-account", <PlusOutlined />),
    ],
    false
  ), // dùng false để chữ người dùng không phải là một trang liên kết hay chuyển trang
  getItem("Học Sinh", "student", <UserSwitchOutlined />),
];

const AdminLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { isAuthenticated, logout, user } = useAuth();
  
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logout();
      message.success("Đã đăng xuất");
      navigate("/");
    } else if (key === "profile") {
      navigate("/profile");
    } else if (key === "dashboard") {
      navigate("/dashboard/overview");
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
    onClick: handleMenuClick,
  };

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
          Admin
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname.split("/")[2] || "staff"]}
          mode="inline"
          items={items}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: colorBgContainer,
            padding: "0 24px",
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
            <strong>Admin</strong>
          </div>

          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                style={{ backgroundColor: "#1890ff" }}
                icon={<UserOutlined />}
              />
              <span style={{ fontWeight: 500 }}>Admin</span>
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

export default AdminLayout;
