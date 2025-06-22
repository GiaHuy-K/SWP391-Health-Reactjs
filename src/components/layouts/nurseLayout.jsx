import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  LogoutOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Dropdown,
  Layout,
  Menu,
  message,
  Space,
  theme,
} from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../config/AuthContext";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: Link ? <Link to={`/dashboardNurse/${key}`}>{label}</Link> : label,
  };
}
const items = [
  getItem("Sự kiện y tế", "event-Nurse", <PieChartOutlined />),
  getItem("Vật tư", "medicalSupply-Nurse", <DesktopOutlined />),
];

const NurseLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logout();
      message.success("Đã đăng xuất");

      navigate("/login");
    } else if (key === "profile") {
      navigate("/profile");

      navigate("/");

    }
  };

  const userMenu = {
    items: [
      {
        key: "profile",
        label: "Hồ sơ cá nhân",
        icon: <ProfileOutlined />,
      },
      {
        type: "divider",
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
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
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
            <strong>Y tá</strong>
          </div>
          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                style={{ backgroundColor: "#1890ff" }}
                icon={<UserOutlined />}
              />
              <span style={{ fontWeight: 500 }}>Y Tá</span>
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
export default NurseLayout;
