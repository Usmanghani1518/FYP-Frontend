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
//   const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
//   const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 1024);
//   const [hoverSidebar, setHoverSidebar] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleResize = () => {
//       const lgScreen = window.innerWidth >= 1024;
//       setIsLargeScreen(lgScreen);
//       setShowSidebar(lgScreen);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   function logout() {
//     localStorage.clear();
//     navigate("/login");
//   }

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar - Fixed with full height */}
//       <div
//         className={`fixed h-screen bg-white shadow-lg transition-all duration-300 ease-in-out z-20
//           ${!isLargeScreen ? 
//             // Small screens: small sidebar that expands on hover
//             (!showSidebar ? "w-0" : (hoverSidebar ? "w-[250px]" : "w-[70px]")) : 
//             // Large screens: always full size
//             "w-[250px]"
//           }`}
//         onMouseEnter={() => setHoverSidebar(true)}
//         onMouseLeave={() => setHoverSidebar(false)}
//       >
//         <div className="p-4 h-full flex flex-col">
//           <div className="mb-6 mx-auto flex justify-center">
//             {/* Logo can go here */}
//             <div className="w-10 h-10 bg-indigo-600 rounded-full"></div>
//           </div>

//           {/* Navigation Links */}
//           <div className="space-y-2 flex-grow">
//             {[
//               { href: "/dashboard", label: "Dashboard", Icon: TbDashboard },
//               { href: "/contacts", label: "Contacts", Icon: TbPhoneCalling },
//               { href: "/assistants", label: "Assistants", Icon: TbRobot },
//               { href: "/setting", label: "Setting", Icon: TbSettings },
//             ].map((item, i) => (
//               <NavLink
//                 to={item.href}
//                 key={i}
//                 className={({ isActive }) =>
//                   `flex items-center py-3 px-3 rounded-md transition-all duration-200 overflow-hidden whitespace-nowrap
//                   ${isActive ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}`
//                 }
//               >
//                 <item.Icon className="text-xl min-w-[24px]" />
//                 <span className={`ml-3 transition-opacity duration-200 ${isLargeScreen || (showSidebar && hoverSidebar) ? 'opacity-100' : 'opacity-0'}`}>
//                   {item.label}
//                 </span>
//               </NavLink>
//             ))}
//           </div>

//           {/* Logout Button */}
//           <div
//             onClick={logout}
//             className="mt-auto px-3 cursor-pointer mb-4"
//           >
//             <div className="flex items-center py-3 px-3 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-200">
//               <BiLogOut className="text-xl min-w-[24px]" />
//               <span className={`ml-3 transition-opacity duration-200 ${isLargeScreen || (showSidebar && hoverSidebar) ? 'opacity-100' : 'opacity-0'}`}>
//                 Logout
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setShowSidebar(!showSidebar)}
//         className="fixed top-4 left-4 z-30 p-2 rounded-full bg-white shadow-md lg:hidden"
//       >
//         {showSidebar ? (
//           <TbX size={24} className="text-gray-700" />
//         ) : (
//           <TbMenu2 size={24} className="text-gray-700" />
//         )}
//       </button>

//       {/* Main Content - Scrollable */}
//       <div className={`flex-1 overflow-y-auto h-screen bg-slate-50 transition-all duration-300
//         ${isLargeScreen ? 
//           "ml-[250px]" : 
//           (!showSidebar ? "ml-0" : (hoverSidebar ? "ml-[250px]" : "ml-[70px]"))
//         }`}
//       >
//         <div className="p-6 min-h-screen">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DashboardLayout;


import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  TbDashboard,
  TbPhoneCalling,
  TbRobot,
  TbMenu2,
  TbSettings,
} from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import { backendRequest } from "@/Helper/backendRequest";

function DashboardLayout() {
  const navigate = useNavigate();

  async function logout() {
    localStorage.clear();
    const response = await backendRequest('GET', '/auth/logout');
    if (response.success){
      navigate("/login");
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Fixed with full height */}
      <div
        className="fixed h-screen bg-white shadow-lg transition-all duration-300 ease-in-out z-20 w-0  md:w-[250px] lg:w-[250px]"
      >
        <div className="p-4 h-full flex flex-col">
          <div className="mb-6 mx-auto flex justify-center">
            {/* Logo can go here */}
            <div className="w-10 h-10 bg-indigo-600 rounded-full"></div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2 flex-grow">
            {[{ href: "/dashboard", label: "Dashboard", Icon: TbDashboard },
              { href: "/contacts", label: "Contacts", Icon: TbPhoneCalling },
              { href: "/assistants", label: "Assistants", Icon: TbRobot },
              { href: "/setting", label: "Setting", Icon: TbSettings }]
              .map((item, i) => (
                <NavLink
                  to={item.href}
                  key={i}
                  className={({ isActive }) =>
                    `flex items-center py-3 px-3 rounded-md transition-all duration-200 overflow-hidden whitespace-nowrap
                    ${isActive ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <item.Icon className="text-xl min-w-[24px]" />
                  <span className="ml-3 transition-opacity duration-200 hidden sm:inline-block">
                    {item.label}
                  </span>
                </NavLink>
              ))}
          </div>

          {/* Logout Button */}
          <div onClick={logout} className="mt-auto px-3 cursor-pointer mb-4">
            <div className="flex items-center py-3 px-3 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-200">
              <BiLogOut  className="text-xl min-w-[24px]" />
              <span className="ml-3 transition-opacity duration-200 hidden sm:inline-block">
                Logout
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-30 p-2 rounded-full bg-white shadow-md lg:hidden"
        aria-label="Toggle Sidebar"
      >
        <TbMenu2 size={24} className="text-gray-700" />
      </button>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto h-screen bg-slate-50 transition-all duration-300 ml-0 md:ml-[250px]">
        <div className="p-6 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
