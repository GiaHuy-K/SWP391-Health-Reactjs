import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Avatar, Dropdown, Space, message } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: Link ? <Link to={`/dashboardManager/${key}`}>{label}</Link> : label,
  };
}

const items = [
  getItem('Quản lý sự cố', 'event-Manager', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
];

const ManagerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      message.success("Đã đăng xuất");
      navigate("/login");
    } else if (key === "profile") {
      navigate("/profile");
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div
          style={{
            height: 32,
            margin: 16,
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Manager
        </div>
        <Menu theme="dark" defaultSelectedKeys={['event-Manager']} mode="inline" items={items} />
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
            <strong>Manager</strong>
          </div>

          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                style={{ backgroundColor: "#52c41a" }}
                icon={<UserOutlined />}
              />
              <span style={{ fontWeight: 500 }}>Manager</span>
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
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;