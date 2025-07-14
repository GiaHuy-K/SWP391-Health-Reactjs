import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
  DashboardOutlined,
  BranchesOutlined,
  InsuranceOutlined,
  HomeOutlined,
  SolutionOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Avatar, Dropdown, Space, message } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from "../../config/AuthContext";
import { isParentRole } from "../../config/AuthContext";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children, link = true) {
  return {
    key,
    icon,
    children,
    label: link ? <Link to={`/dashboardManager/${key}`}>{label}</Link> : label,
  };
}

const items = [
  getItem('Dashboard', 'dashboardM', <DashboardOutlined />),
  getItem('Quản lý sự cố', 'event-Manager', <PieChartOutlined />),
  getItem('Quản lý vật tư y tế', 'supply-Manager', <DesktopOutlined />),
  getItem('Chiến dịch tiêm chủng', 'vaccination-campaigns', <SafetyCertificateOutlined />),
  getItem('Quản lý Blog', 'manage-blogs', <FileTextOutlined />),
  //getItem('Tiêm chủng tại trường', 'vaccineAtSchoolM', <SolutionOutlined />),
  getItem(
    'Về trang chủ',
    'home',
    <HomeOutlined />,
    undefined,
    false
  ),
];

const ManagerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); 
  const { logout, user } = useAuth();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logout();
      message.success("Đã đăng xuất");
      navigate("/");
    } else if (key === "profile") {
      navigate("/profile");
    } else if (key === "dashboard") {
      navigate("/dashboardManager/event-Manager");
    } else if (key === "student-vaccination") {
      navigate("/dashboardManager/student-vaccination");
    } else if (key === "home") {
      navigate("/");
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
          Quản Lý
        </div>
        <Menu 
          theme="dark" 
          defaultSelectedKeys={['event-Manager']} 
          mode="inline" 
          items={items} 
          onClick={({ key }) => {
            if (key === "home") navigate("/");
            // các xử lý khác
          }}
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
            <strong>{user?.fullName || "Quản Lý"}</strong>

            
          </div>

          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                style={{ backgroundColor: "#1890ff" }}
                icon={<UserOutlined />}
              />
              <span style={{ fontWeight: 500 }}>Quản lý</span>
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