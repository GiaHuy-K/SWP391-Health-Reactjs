import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { RouterProvider } from "react-router";
import LoginPage from "./page/login/index.jsx";
import RegisterPage from "./page/register/index.jsx";
import HomePage from "./page/home/HomePage.jsx";
import UserProfile from "./page/userprofile/UserProfile.jsx";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./config/AuthContext";
import { useAuth } from "./config/AuthContext";
import AdminLayout from "./components/layouts/adminLayout.jsx";
import ManageStaff from "./page/admin/manage-staff.jsx";
import ManageParent from "./page/admin/manage-parent.jsx";
import ManageNurse from "./page/admin/manage-nurse.jsx";
import AddAccount from "./page/admin/add-account.jsx";

// Component để bảo vệ các route yêu cầu đăng nhập
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: <AdminLayout />,
    children: [
      {
        path : "/dashboard/staff",
        element: <ManageStaff></ManageStaff>
      },
      {
        path : "/dashboard/parent",
        element: <ManageParent></ManageParent>
      },
      {
        path : "/dashboard/nurse",
        element: <ManageNurse></ManageNurse>
      },
      {
        path: "/dashboard/add-account",
        element: <AddAccount />,
      }
    ]
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

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
    <ToastContainer />
  </AuthProvider>
);
