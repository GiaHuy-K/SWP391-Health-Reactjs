import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import LoginPage from "./page/login/index.jsx";
import RegisterPage from "./page/register/index.jsx";
import HomePage from "./page/home/HomePage.jsx";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage></HomePage>,
  },
  {
    path: "/login",
    element: <LoginPage></LoginPage>,
  },
  {
    path: "/register",
    element: <RegisterPage></RegisterPage>,
  },
]);

createRoot(document.getElementById("root")).render(
  <>
  <RouterProvider router={router} />
  <ToastContainer></ToastContainer>
  </>
);
