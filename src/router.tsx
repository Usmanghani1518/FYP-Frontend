import {
    createBrowserRouter,
  } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/SignUp";
import VerifyOTPPage from "./pages/Auth/Forgot";


  export const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    //   errorElement: <ErrorPage />,
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
