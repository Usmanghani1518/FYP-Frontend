import {
  createBrowserRouter,
} from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/SignUp";
import VerifyOTPPage from "./pages/Auth/Forgot";
import Landing from "./pages/Landing/Landing";
import Layout from "./layout/Layout";
import Teacher from "./components/Teacher";
import AdminDashboard from "./pages/Admin/Dashboard";
import CreateCourse from "./pages/CreateCourse";
import Dashboard from "./pages/Teacher/Dashboard";
import TeacherLayout from "./pages/Teacher/Layout";
import ErrorPage from "./pages/Error"; // Import your ErrorPage
import AdminLayout from "./pages/Admin/AdminLayout";
import { LoginChecker } from "./components/LoginChecker";

export const router = createBrowserRouter([
  {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />, // Show ErrorPage for invalid paths inside Layout
      children: [
          {
              index: true,
              element: <Landing />,
          },
          {
              path: "login-teacher",
              element: <Teacher />
          },
         
         
         
          
      ],
  },
  
  {
      path: "/contact",
      element: <App />,
      errorElement: <ErrorPage />,
  },
  {
    path: "/teacher",
    element: <TeacherLayout />,
    children: [
        {
            index: true,
            element: <Dashboard />
        },
        {
            path: "create-course",
            element: <CreateCourse />
        },
    ]
},
  {
      path: "/login",
      element: <LoginChecker allowedUser="not-logged-in"><LoginPage /></LoginChecker> ,
      errorElement: <ErrorPage />,
  },
  {
      path: "/signup",
      element: <SignupPage />,
      errorElement: <ErrorPage />,
  },
  {
      path: "/forgot-password",
      element: <VerifyOTPPage />,
      errorElement: <ErrorPage />,
  },

  {
    path: "/dashboard",
    element: <AdminLayout />,
    children: [
        {
            index: true,
            element: <AdminDashboard />
        },
    ]
},
  // Catch-all route for unknown paths
  {
      path: "*",
      element: <ErrorPage />,
  }
]);
