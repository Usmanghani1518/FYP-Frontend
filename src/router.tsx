import {
    createBrowserRouter,
  } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/SignUp";
import VerifyOTPPage from "./pages/Auth/Forgot";
import Landing from "./pages/Landing/Landing";
import Layout from "./layout/Layout";


  export const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
    //   errorElement: <ErrorPage />,
    children: [
        {
          index: true,
          element: <Landing />,
        },
      ],
    },
    {
      path: "/contact",
      element: <App />,
    //   errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    //   errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    //   errorElement: <ErrorPage />,
    },
    {
      path: "/forgot-password",
      element: <VerifyOTPPage />,
    //   errorElement: <ErrorPage />,
    },
   
  ]);
