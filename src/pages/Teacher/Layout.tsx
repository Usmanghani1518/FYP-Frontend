


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
// import { backendRequest } from "@/Helper/backendRequest";

// function DashboardLayout() {
//   const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
//   const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 1024);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleResize = () => {
//       const lgScreen = window.innerWidth >= 1024;
//       setIsLargeScreen(lgScreen);
//       setShowSidebar(lgScreen);
//       if (!lgScreen) setIsCollapsed(false);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   async function logout() {
//     localStorage.clear();
//     const response = await backendRequest('GET', '/auth/logout');
//     if (response.success) {
//       navigate("/login");
//     }
//   }

//   const toggleSidebar = () => {
//     if (isLargeScreen) {
//       setIsCollapsed(!isCollapsed);
//     } else {
//       setShowSidebar(!showSidebar);
//     }
//   };

//   const sidebarWidth = isCollapsed ? "w-20" : "w-64";
//   const contentMargin = isCollapsed ? "ml-20" : "ml-64";

//   // Navigation items array
//   const navItems = [
//     { href: "/dashboard", label: "Dashboard", Icon: TbDashboard },
//     { href: "/contacts", label: "Contacts", Icon: TbPhoneCalling },
//     { href: "/assistants", label: "Assistants", Icon: TbRobot },
//     { href: "/setting", label: "Settings", Icon: TbSettings },
//   ];

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50">
//       {/* Sidebar */}
//       <div
//         className={`fixed h-screen bg-white shadow-lg transition-all duration-300 ease-in-out z-20
//           ${isLargeScreen ? sidebarWidth : showSidebar ? "w-64" : "w-0"}
//           ${isCollapsed ? "items-center" : ""}`}
//       >
//         <div className="p-4 h-full flex flex-col">
//           {/* Logo */}
//           <div className={`mb-8 flex ${isCollapsed ? "justify-center" : "justify-between items-center"}`}>
//             {!isCollapsed && (
//               <div className="w-10 h-10 bg-indigo-600 rounded-full"></div>
//             )}
//             {isLargeScreen && (
//               <button
//                 onClick={() => setIsCollapsed(!isCollapsed)}
//                 className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
//               >
//                 {isCollapsed ? (
//                   <TbMenu2 size={20} />
//                 ) : (
//                   <TbX size={20} />
//                 )}
//               </button>
//             )}
//           </div>

//           {/* Navigation Links */}
//           <div className="space-y-2 flex-grow">
//             {navItems.map((item, i) => (
//               <NavLink
//                 to={item.href}
//                 key={i}
//                 className={({ isActive }) =>
//                   `flex items-center py-3 px-3 rounded-lg transition-all duration-200 overflow-hidden whitespace-nowrap
//                   ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}
//                   ${isCollapsed ? "justify-center" : ""}`
//                 }
//               >
//                 {({ isActive }) => (
//                   <>
//                     <item.Icon className={`text-xl ${isActive ? "text-indigo-600" : "text-gray-500"}`} />
//                     {!isCollapsed && (
//                       <span className="ml-3 font-medium">{item.label}</span>
//                     )}
//                     {isActive && !isCollapsed && (
//                       <span className="ml-auto w-1 h-6 bg-indigo-600 rounded-full"></span>
//                     )}
//                   </>
//                 )}
//               </NavLink>
//             ))}
//           </div>

//           {/* Logout Button */}
//           <div
//             onClick={logout}
//             className={`mt-auto cursor-pointer mb-4 ${isCollapsed ? "px-0" : "px-3"}`}
//           >
//             <div className={`flex items-center py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200 ${isCollapsed ? "justify-center px-3" : "px-3"}`}>
//               <BiLogOut className="text-xl text-gray-500" />
//               {!isCollapsed && (
//                 <span className="ml-3 font-medium">Logout</span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu Button */}
//       {!isLargeScreen && (
//         <button
//           onClick={toggleSidebar}
//           className="fixed top-4 left-4 z-30 p-2 rounded-full bg-white shadow-md lg:hidden"
//           aria-label="Toggle Sidebar"
//         >
//           {showSidebar ? (
//             <TbX size={24} className="text-gray-700" />
//           ) : (
//             <TbMenu2 size={24} className="text-gray-700" />
//           )}
//         </button>
//       )}

//       {/* Main Content */}
//       <div
//         className={`flex-1 overflow-y-auto h-screen transition-all duration-300
//           ${isLargeScreen ? contentMargin : showSidebar ? "ml-64" : "ml-0"}`}
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
  TbX,
  TbSettings,
} from "react-icons/tb";
import { MdCreateNewFolder } from "react-icons/md";
import { useState, useEffect } from "react";
import { BiLogOut } from "react-icons/bi";
import { backendRequest } from "@/Helper/backendRequest";
import { FaTableList } from "react-icons/fa6";

function DashboardLayout() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const largeScreen = window.innerWidth >= 768;
      setIsLargeScreen(largeScreen);
      if (!largeScreen) {
        setIsCollapsed(false); // Reset collapse on small screens
        setShowSidebar(false); // Hide sidebar by default on mobile
      } else {
        setShowSidebar(true); // Always show on large screens
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function logout() {
    localStorage.clear();
    const response = await backendRequest('GET', '/auth/logout');
    if (response.success) navigate("/login");
  }

  const toggleSidebar = () => {
    if (isLargeScreen) {
      setIsCollapsed(!isCollapsed);
    } else {
      setShowSidebar(!showSidebar);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 ">
      {/* Mobile Menu Button - Only on small screens */}
      {!isLargeScreen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2 rounded-full  bg-gray-900 shadow-lg md:hidden"
          aria-label="Toggle Sidebar"
        >
          <TbMenu2 size={24} className="text-gray-700" />
        </button>
      )}

      {/* Sidebar - Different behavior based on screen size */}
      {((isLargeScreen && showSidebar) || (!isLargeScreen && showSidebar)) && (
        <div
          className={`
            ${isLargeScreen ? 
              `fixed left-0 top-0 h-full ${isCollapsed ? 'w-20' : 'w-64'} shadow-lg transition-all duration-300` : 
              "fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
            }
          `}
          onClick={!isLargeScreen ? toggleSidebar : undefined}
        >
          <div 
            className={`
              ${isLargeScreen ? 
                "h-full bg-gray-950 text-white" : 
                "absolute left-0 top-0 h-full w-64 bg-gray-900 shadow-xl"
              }
            `}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 h-full flex flex-col">
              {/* Header with close/collapse button */}
              <div className={`mb-6 flex ${isCollapsed ? 'justify-center' : 'justify-between items-center'}`}>
                {!isCollapsed && <div className=" text-xl text-purple-600 font-semibold rounded-full">Teacher Dashboard</div>}
                <button
                  onClick={toggleSidebar}
                  className="p-1 rounded-md hover:bg-gray-600 text-gray-300"
                >
                  {isLargeScreen ? (
                    isCollapsed ? <TbMenu2 size={20} /> : <TbX size={20} />
                  ) : (
                    <TbX size={20} />
                  )}
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2 flex-grow">
                {[
                  { href: "/teacher/dashboard", label: "Dashboard", Icon: TbDashboard },
                  { href: "/teacher/create-course", label: "Create Course", Icon: MdCreateNewFolder },
                  { href: "/teacher/all-courses", label: "All Courses", Icon: FaTableList },
                  { href: "/setting", label: "Settings", Icon: TbSettings },
                ].map((item, i) => (
                  <NavLink
                    to={item.href}
                    key={i}
                    className={({ isActive }) =>
                      `flex items-center py-3 px-3 rounded-lg transition-all duration-200
                      ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-300"}
                      ${isCollapsed ? 'justify-center' : ''}`
                    }
                    onClick={() => !isLargeScreen && setShowSidebar(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <item.Icon className={`text-xl ${isActive ? "text-indigo-600" : "text-gray-500"}`} />
                        {!isCollapsed && (
                          <>
                            <span className="ml-3 font-medium">{item.label}</span>
                            {isActive && (
                              <span className="ml-auto w-1 h-6 bg-indigo-600 rounded-full"></span>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Logout Button */}
              <div
                onClick={logout}
                className={`mt-auto cursor-pointer mb-4 ${isCollapsed ? 'px-0' : 'px-3'}`}
              >
                <div className={`flex items-center py-3 rounded-lg text-gray-600 hover:bg-gray-200 transition-all duration-200 ${isCollapsed ? 'justify-center px-3' : 'px-3'}`}>
                  <BiLogOut className="text-xl text-gray-500" />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">Logout</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 overflow-y-auto h-full transition-all duration-300
          ${isLargeScreen ? (isCollapsed ? 'ml-20' : 'ml-64') : 'ml-0'}
        `}
      >
        <div className="p-6 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;