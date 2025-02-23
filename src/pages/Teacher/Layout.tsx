



// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import {
//   TbDashboard,
//   TbPhoneCalling,
//   TbRobot,
//   TbMenu2,
//   TbX,
//   TbSettings,
// } from "react-icons/tb";
// import { useState, useEffect } from "react";
// import { BiLogOut } from "react-icons/bi";

// function DashboardLayout() {
//   const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 1024);
//   const [hoverSidebar, setHoverSidebar] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleResize = () => {
//       setShowSidebar(window.innerWidth >= 1024);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   function logout() {
//     localStorage.clear();
//     navigate("/login");
//   }

//   return (
//     <div className="flex  relative">
//       {/* Sidebar */}
//       <div
//         className={` ${showSidebar && hoverSidebar?"fixed":"relative"}   left-0 z-20 top-0  bg-white p-4 shadow-lg transition-all duration-300 
//             ${
//               showSidebar
//                 ? "w-[250px]" // Full sidebar for lg screens
//                 : hoverSidebar
//                 ? "w-[250px]" // Expand on hover
//                 : "w-[70px]" // Icon-only mode for md screens and below
//             }`}
//         onMouseEnter={() => setHoverSidebar(true)}
//         onMouseLeave={() => setHoverSidebar(false)}
//       >
//         <div className="mb-6 mx-auto flex justify-center">
//           {/* Logo Placeholder */}
//         </div>

//         {/* Sidebar Links */}
//         {[
//           { href: "/dashboard", label: "Dashboard", Icon: TbDashboard },
//           { href: "/contacts", label: "Contacts", Icon: TbPhoneCalling },
//           { href: "/assistants", label: "Assistants", Icon: TbRobot },
//           { href: "/setting", label: "Setting", Icon: TbSettings },
//         ].map((item, i) => (
//           <NavLink
//             to={item.href}
//             key={i}
//             className={({ isActive }) =>
//               `flex items-center py-2 px-3 rounded-md transition-all ${
//                 isActive ? "bg-custom_primary text-white" : "text-gray-700 hover:bg-gray-100"
//               }`
//             }
//             onClick={() => setShowSidebar(window.innerWidth >= 1024)}
//           >
//             <item.Icon className="text-xl" />
//             {hoverSidebar || showSidebar ? <span className="ml-3">{item.label}</span> : null}
//           </NavLink>
//         ))}

//         {/* Logout Button */}
//         {/* <div
//           onClick={logout}
//           className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center text-custom_primary cursor-pointer"
//         >
//           <BiLogOut className="text-xl" />
//           {hoverSidebar || showSidebar ? (
//             <button className="py-2 px-2 ml-2 cursor-pointer rounded-md transition">Logout</button>
//           ) : null}+
//         </div> */}
//       </div>

//       {/* Toggle Button for Small Screens */}
//       {/* {!showSidebar && (
//         <button
//           onClick={() => setShowSidebar(true)}
//           className="fixed top-4 left-4 z-50 p-2 rounded-full shadow-md lg:hidden"
//         >
//           <TbMenu2 size={24} className="text-gray-700" />
//         </button>
//       )} */}

//       {/* Content Section */}
//       <div
//         className={`w-full transition-all p-6 duration-300 ${
//           showSidebar ? "lg:w-[calc(100%-250px)]" : "lg:w-full"
//         } bg-slate-50 overflow-auto`}
//       >
//         <Outlet />
//       </div>
//     </div>
//   );
// }

// export default DashboardLayout;


// // export default DashboardLayout


import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  TbDashboard,
  TbPhoneCalling,
  TbRobot,
  TbMenu2,
  TbX,
  TbSettings,
} from "react-icons/tb";
import { useState, useEffect } from "react";
import { BiLogOut } from "react-icons/bi";

function DashboardLayout() {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 1024);
  const [hoverSidebar, setHoverSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative left-0 z-20 top-0 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out
          ${!showSidebar ? "w-[70px]" : "w-[70px] hover:w-[250px]"}`}
        onMouseEnter={() => setHoverSidebar(true)}
        onMouseLeave={() => setHoverSidebar(false)}
      >
        <div className="p-4">
          <div className="mb-6 mx-auto flex justify-center">
            {/* Logo can go here */}
            <div className="w-10 h-10 bg-indigo-600 rounded-full"></div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            {[
              { href: "/dashboard", label: "Dashboard", Icon: TbDashboard },
              { href: "/contacts", label: "Contacts", Icon: TbPhoneCalling },
              { href: "/assistants", label: "Assistants", Icon: TbRobot },
              { href: "/setting", label: "Setting", Icon: TbSettings },
            ].map((item, i) => (
              <NavLink
                to={item.href}
                key={i}
                className={({ isActive }) =>
                  `flex items-center py-3 px-3 rounded-md transition-all duration-200 overflow-hidden whitespace-nowrap
                  ${isActive ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}`
                }
              >
                <item.Icon className="text-xl min-w-[24px]" />
                <span className={`ml-3 transition-opacity duration-200 ${showSidebar && hoverSidebar ? 'opacity-100' : 'opacity-0'}`}>
                  {item.label}
                </span>
              </NavLink>
            ))}
          </div>

          {/* Logout Button */}
          <div
            onClick={logout}
            className="absolute bottom-4 left-0 right-0 px-4 cursor-pointer"
          >
            <div className="flex items-center py-3 px-3 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-200">
              <BiLogOut className="text-xl min-w-[24px]" />
              <span className={`ml-3 transition-opacity duration-200 ${showSidebar && hoverSidebar ? 'opacity-100' : 'opacity-0'}`}>
                Logout
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="fixed top-4 left-4 z-30 p-2 rounded-full bg-white shadow-md lg:hidden"
      >
        {showSidebar ? (
          <TbX size={24} className="text-gray-700" />
        ) : (
          <TbMenu2 size={24} className="text-gray-700" />
        )}
      </button>

      {/* Main Content */}
      <div className="flex-1 lg:ml-[70px] bg-slate-50 min-h-screen overflow-x-hidden">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;