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
import { RoleChecker } from "./components/RoleChecker";
import CourseDetail from "./pages/CourseDetail";
import ViewPurchaseCourse from "./pages/ViewPurchaseCourse";

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
              element:<RoleChecker allowedRoles={[]} allowedUser="not-logged-in"><Teacher /></RoleChecker> 
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
    element: <RoleChecker allowedRoles={["teacher"]} ><TeacherLayout /></RoleChecker> ,
    children: [
        {
            index: true,
            element:  <RoleChecker allowedRoles={["teacher"]} ><Dashboard /></RoleChecker>
        },
        {
            path: "create-course",
            element: <RoleChecker allowedRoles={["teacher"]} ><CreateCourse /></RoleChecker>
        },
    ]
},
  {
      path: "/login",
      element: <RoleChecker allowedRoles={[]} allowedUser="not-logged-in"><LoginPage /></RoleChecker> ,
      errorElement: <ErrorPage />,
  },
  {
    path: "course",
    element: <CourseDetail />
},
  {
      path: "/signup",
      element:<RoleChecker allowedRoles={[]} allowedUser="not-logged-in"><SignupPage /></RoleChecker> ,
      errorElement: <ErrorPage />,
  },
  {
      path: "/forgot-password",
      element: <RoleChecker allowedRoles={[]} allowedUser="not-logged-in"><VerifyOTPPage /></RoleChecker> ,
      errorElement: <ErrorPage />,
  },

  {
    path: "/dashboard",
    element: <RoleChecker allowedRoles={["admin"]} ><AdminLayout /></RoleChecker> ,
    children: [
        {
            index: true,
            element: <AdminDashboard />
        },
        {
            path: "course",
            element: <CourseDetail />
        },
        {
            path: "purchases",
            element: <ViewPurchaseCourse />
        },
    ]
},
  // Catch-all route for unknown paths
  {
      path: "*",
      element: <ErrorPage />,
  }
]);
