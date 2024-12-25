import {
    createBrowserRouter,
  } from "react-router-dom";
import App from "./App";


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
   
  ]);
