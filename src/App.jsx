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
import ForgotPassword from "./page/forgot-password/forgot-password.jsx";
import ResetPassword from "./page/forgot-password/reset-password.jsx";
import ManageStudent from "./page/admin/manage-student.jsx";
import ManagerLayout from "./components/layouts/managerLayout.jsx";
import NurseLayout from "./components/layouts/nurseLayout.jsx";
import ManageEvent from "./page/schoolnurse/manage-event.jsx";

import ManageMedicalSupply from "./page/schoolnurse/manage-medicalSupply.jsx";
import ManageEventM from "./page/manager/manage-event.jsx";

// Component bảo vệ route yêu cầu đăng nhập
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};
// bảo vệ trang dashboard của admin
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
  { path: "/unauthorized", element: <Unauthorized /> }, // trang khi người dùng cố tình vào đường dẫn không cho phép
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },

  //dashboard của manager
  { path: "/dashboardManager", element: <ManagerLayout />, children: [
    {path: "event-Manager", element: <ManageEventM/>},
  ] },
  //dashboard của nurse
  { path: "/dashboardNurse", element: <NurseLayout />, children: [

    {path:"event-Nurse", element:<ManageEvent/>},
    {path :"medicalSupply-Nurse", element: <ManageMedicalSupply/>}
  ] },

  //dashboard của admin 
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Navigate to="overview" replace /> }, // lần đầu vào trang sẽ cho coi overview
      { path: "overview", element: <DashboardOverview /> },
      { path: "staff", element: <ManageStaff /> },
      { path: "parent", element: <ManageParent /> },
      { path: "nurse", element: <ManageNurse /> },
      { path: "student", element: <ManageStudent /> },
      { path: "add-account", element: <AddAccount /> },
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
