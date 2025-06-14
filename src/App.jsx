import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./page/login/index.jsx";
import RegisterPage from "./page/register/index.jsx";
import HomePage from "./page/home/HomePage.jsx";
import UserProfile from "./page/userprofile/UserProfile.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./config/AuthContext";
import AdminLayout from "./components/layouts/adminLayout.jsx";
import ManageStaff from "./page/admin/manage-staff.jsx";
import ManageParent from "./page/admin/manage-parent.jsx";
import ManageNurse from "./page/admin/manage-nurse.jsx";
import AddAccount from "./page/admin/add-account.jsx";
import Unauthorized from "./page/error/Unauthorized.jsx";
import DashboardOverview from "./page/admin/dashboard-overview.jsx";

// Component bảo vệ route yêu cầu đăng nhập
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== "SchoolAdmin") return <Navigate to="/unauthorized" />;
  return children;
};

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/unauthorized", element: <Unauthorized /> },

  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Navigate to="overview" replace /> },

      // 👇 Trang tổng quan chuyển thành path rõ ràng
      { path: "overview", element: <DashboardOverview /> },
      { path: "/dashboard/staff", element: <ManageStaff /> },
      { path: "/dashboard/parent", element: <ManageParent /> },
      { path: "/dashboard/nurse", element: <ManageNurse /> },
      { path: "/dashboard/add-account", element: <AddAccount /> },
    ],
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <UserProfile />
      </PrivateRoute>
    ),
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </AuthProvider>
  );
}
