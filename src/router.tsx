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
  import ErrorPage from "./pages/Error";
  import AdminLayout from "./pages/Admin/AdminLayout";
  import { RoleChecker } from "./components/RoleChecker";
  import CourseDetail from "./pages/CourseDetail";
  import ViewPurchaseCourse from "./pages/ViewPurchaseCourse";
  import AllTeachers from "./components/admin/AllTeachers";
  import AllStudents from "./components/admin/AllStudents";
  // import CourseList from "./pages/Teacher/CourseList";
  import CourseManagement from "./pages/Teacher/CourseMangement";
  import StudentLayout from "./pages/Student/Layout";
  import StudentPage from "./pages/Student/StudentPage";
import Profile from "./pages/Student/Profile";
import { CoursesTable } from "./pages/Teacher/CourseList";
import CartPage from "./pages/Cart";
import ViewCourses from "./pages/Student/ViewCourse";
import ResumeCourse from "./pages/ResumeCourse";
  // import CourseDetailDummy from "./pages/Teacher/CourseDetail";
  // import AllTeachers from "./components/admin/AllTeachers";
  // import AllStudents from "./components/admin/AllStudents";
  
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
      path: "/student",
      element: <RoleChecker allowedRoles={["admin","teacher","student"]} ><StudentLayout /></RoleChecker> ,
      children: [
          {
              index: true,    
              element:  <RoleChecker allowedRoles={["admin","teacher","student"]} ><StudentPage /></RoleChecker>
          },
          {
              path: "profile",
              element: <RoleChecker allowedRoles={["admin","teacher","student"]} ><Profile /></RoleChecker>
          },
          {
              path: "course-list",
              element: <RoleChecker allowedRoles={["admin","teacher","student"]} ><CourseManagement /></RoleChecker>
          },
          {
            path: "cart",
            element: <RoleChecker allowedRoles={["admin","teacher","student"]} ><CartPage /></RoleChecker>
        },
          {
            path: "view/:courseId",
            element: <RoleChecker allowedRoles={["admin","teacher","student"]} ><ViewCourses /></RoleChecker>
        },
        {
            path: "course/:courseId",
            element: <RoleChecker allowedRoles={["admin","teacher","student"]} ><CourseDetail /></RoleChecker>
        },
        {
            path: "course-resume/:courseId",
            element: <RoleChecker allowedRoles={["admin","teacher","student"]} ><ResumeCourse /></RoleChecker>
        },
      ]
  },
    {
      path: "/teacher",
      element: <RoleChecker allowedRoles={["admin","teacher","student"]} ><TeacherLayout /></RoleChecker> ,
      children: [
          {
              path: "dashboard",    
              element:  <RoleChecker allowedRoles={["admin","teacher","student"]} ><Dashboard /></RoleChecker>
          },
          {
              path: "create-course",
              element: <RoleChecker allowedRoles={["admin","teacher","student"]} ><CreateCourse /></RoleChecker>
          },
          {
              path: "all-courses",
              element: <RoleChecker allowedRoles={["admin","teacher","student"]} ><CoursesTable /></RoleChecker>
            },
            {
                path: "all-courses/:courseId",
                element: <RoleChecker allowedRoles={["admin","teacher","student"]} ><CourseManagement /></RoleChecker>
            },
            {
                path: "course-cart",
                element: <RoleChecker allowedRoles={["admin","teacher","student"]} ><CartPage /></RoleChecker>
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
      element: <RoleChecker allowedRoles={["admin","teacher","student"]} ><AdminLayout /></RoleChecker> ,
      children: [
          {
              index: true,
              element: <AdminDashboard />
          },
          {
              path: "teachers",
              element: <AllTeachers />
          },
          {
              path: "students",
              element: <AllStudents />
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
  