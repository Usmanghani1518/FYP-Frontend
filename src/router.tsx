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
  import CourseManagement from "./pages/Teacher/CourseMangement";
  import StudentLayout from "./pages/Student/Layout";
  import StudentPage from "./pages/Student/StudentPage";
  import Profile from "./pages/Student/Profile";
  import { CoursesTable } from "./pages/Teacher/CourseList";
  import CartPage from "./pages/Cart";
  import ViewCourses from "./pages/Student/ViewCourse";
  import ResumeCourse from "./pages/ResumeCourse";
  
  export const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <RoleChecker allowedRoles={['admin', 'student', 'teacher']} isHomePage>
          <Layout />
        </RoleChecker>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Landing />,
        },
        {
          path: "login-teacher",
          element: <RoleChecker allowedRoles={[]} allowedUser="not-logged-in"><Teacher /></RoleChecker>
        },
      ],
    },
    
    {
      path: "/contact",
      element: <App />,
      errorElement: <ErrorPage />,
    },
    
    // Student Routes
    {
      path: "/student",
      element: <RoleChecker allowedRoles={["student", "admin"]}><StudentLayout /></RoleChecker>,
      children: [
        {
          index: true,    
          element: <StudentPage />
        },
        {
          path: "profile",
          element: <Profile />
        },
        {
          path: "course-list",
          element: <CourseManagement />
        },
        {
          path: "cart",
          element: <CartPage />
        },
        {
          path: "view/:courseId",
          element: <ViewCourses />
        },
        {
          path: "course/:courseId",
          element: <CourseDetail />
        },
        {
          path: "course-resume/:courseId",
          element: <ResumeCourse />
        },
      ]
    },
    
    // Teacher Routes
    {
      path: "/teacher",
      element: <RoleChecker allowedRoles={["teacher", "admin"]}><TeacherLayout /></RoleChecker>,
      children: [
        {
          path: "dashboard",    
          element: <Dashboard />
        },
        {
          path: "create-course",
          element: <CreateCourse />
        },
        {
          path: "all-courses",
          element: <CoursesTable />
        },
        {
          path: "all-courses/:courseId",
          element: <CourseManagement />
        },
        {
          path: "course-cart",
          element: <CartPage />
        },
      ]
    },
    
    // Auth Routes
    {
      path: "/login",
      element: <RoleChecker allowedRoles={[]} allowedUser="not-logged-in"><LoginPage /></RoleChecker>,
    },
    {
      path: "/signup",
      element: <RoleChecker allowedRoles={[]} allowedUser="not-logged-in"><SignupPage /></RoleChecker>,
    },
    {
      path: "/forgot-password",
      element: <RoleChecker allowedRoles={[]} allowedUser="not-logged-in"><VerifyOTPPage /></RoleChecker>,
    },
    
    // Public Course Route
    {
      path: "course",
      element: <CourseDetail />
    },
    
    // Admin Routes
    {
      path: "/dashboard",
      element: <RoleChecker allowedRoles={["admin"]}><AdminLayout /></RoleChecker>,
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


