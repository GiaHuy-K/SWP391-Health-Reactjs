import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  LogoutOutlined,
  PieChartOutlined,
  UserOutlined,
  ProfileOutlined,
  DashboardOutlined,
  HomeOutlined,
  BranchesOutlined,
  InsuranceOutlined,
  FileTextOutlined,
  SolutionOutlined,
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
import { isParentRole } from "../../config/AuthContext";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: typeof label === "string" ? <Link to={`/dashboardNurse/${key}`}>{label}</Link> : label,
  };
}
const items = [
  getItem("Dashboard", "DashboardN", <DashboardOutlined />),
  getItem("Sự kiện y tế", "event-Nurse", <PieChartOutlined />),
  getItem("Vật tư", "medicalSupply-Nurse", <DesktopOutlined />),
  getItem('Thông tin tiêm chủng học sinh', 'student-vaccination', <BranchesOutlined />),
  getItem('Thông tin bệnh mãn tính học sinh', 'student-chronic-disease', <InsuranceOutlined />),
  getItem('Tạo Blog', 'blog/create', <FileOutlined />),
  getItem('Quản lý Blog', 'manage-blogs', <FileTextOutlined />),
  getItem('Tiêm chủng tại trường', 'vaccineAtSchoolN', <SolutionOutlined />),
  getItem(
    <Link to="/">Về trang chủ</Link>,
    "home",
    <HomeOutlined />,
    undefined
  ),
];

const NurseLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logout();
      message.success("Đã đăng xuất");
      navigate("/");
    } else if (key === "profile") {
      navigate("/profile");
    } else if (key === "dashboard") {
      navigate("/dashboardNurse/event-Nurse");
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
        <div
          style={{
            height: 32,
            margin: 16,
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Y Tá
        </div>
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
            <strong>{user?.fullName || "Y Tá"}</strong>
          </div>
          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                style={{ backgroundColor: "#1890ff" }}
                icon={<UserOutlined />}
              />
              <span style={{ fontWeight: 500 }}>
                {user?.fullName || "Y Tá"}
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
export default NurseLayout;
