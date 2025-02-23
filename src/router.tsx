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
          {
              path: "admin",
              element: <AdminDashboard />
          },
          {
              path: "create-course",
              element: <CreateCourse />
          },
          {
              path: "teacher-dashboard",
              element: <Dashboard />
          },
          {
              path: "dashboard",
              element: <TeacherLayout />,
              children: [
                  {
                      index: true,
                      element: <AdminDashboard />
                  },
              ]
          }
      ],
  },
  {
      path: "/contact",
      element: <App />,
      errorElement: <ErrorPage />,
  },
  {
      path: "/login",
      element: <LoginPage />,
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
  // Catch-all route for unknown paths
  {
      path: "*",
      element: <ErrorPage />,
  }
]);
