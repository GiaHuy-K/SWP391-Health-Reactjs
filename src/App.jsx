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
import ManageMedicalSupplyM from "./page/manager/manage-medical-supply.jsx";
import StudentVaccinationPage from './page/manager/manage-student-inf-vc.jsx';

// Component bảo vệ route yêu cầu đăng nhập
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// bảo vệ trang dashboard của admin
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== "Quản trị viên Trường học") return <Navigate to="/unauthorized" />;
  return children;
};

// bảo vệ trang dashboard của manager
const ManagerRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== "Quản lý Nhân sự/Nhân viên") return <Navigate to="/unauthorized" />;
  return children;
};

// bảo vệ trang dashboard của nurse
const NurseRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== "Nhân viên Y tế") return <Navigate to="/unauthorized" />;
  return children;
};

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/unauthorized", element: <Unauthorized /> }, // trang khi người dùng cố tình vào đường dẫn không cho phép
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },

  //dashboard của manager (Quản lý Nhân sự/Nhân viên)
  { 
    path: "/dashboardManager", 
    element: (
      <ManagerRoute>
        <ManagerLayout />
      </ManagerRoute>
    ), 
    children: [
      {path: "event-Manager", element: <ManageEventM/>},
      {path: "supply-Manager", element: <ManageMedicalSupplyM/>},
      {path: "student-vaccination", element: <StudentVaccinationPage/>},
    ] 
  },
  
  //dashboard của nurse (Nhân viên Y tế)
  { 
    path: "/dashboardNurse", 
    element: (
      <NurseRoute>
        <NurseLayout />
      </NurseRoute>
    ), 
    children: [
      {path:"event-Nurse", element:<ManageEvent/>},
      {path :"medicalSupply-Nurse", element: <ManageMedicalSupply/>}
    ] 
  },

  //dashboard của admin (Quản trị viên Trường học)
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
