// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import {
//   TbDashboard,
//   TbPhoneCalling,
//   TbRobot,
//   TbMenu2,
//   TbX,
//   TbSettings,
// } from "react-icons/tb";
// // import logo from "../assets/calling_agent.png";
// import { useState, useEffect } from "react";
// import { BiLogOut } from "react-icons/bi";

//  function DashboardLayout() {
//   const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 1024);
//   const navigate = useNavigate();
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setShowSidebar(true);
//       } else {
//         setShowSidebar(false);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   function logout() {
//     localStorage.clear();
//     navigate("/login");
//   }
//   return (
//     <div className="flex h-screen w-screen relative">
//       <div
//         className={`fixed lg:relative left-0 z-50 top-0 h-full w-[250px] bg-white p-4 shadow-lg transition-transform duration-300 
//                 ${
//                   showSidebar
//                     ? "translate-x-0"
//                     : "-translate-x-full lg:translate-x-0"
//                 }`}
//       >
//         <div className="mb-6 mx-auto flex justify-center">
//           {/* <img src={logo} alt="Logo" className="w-24 h-24 object-contain" /> */}
//         </div>

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
//               `flex gap-3 items-center py-2 px-3 rounded-md transition-colors 
//                             ${
//                               isActive
//                                 ? "bg-custom_primary text-white"
//                                 : "text-gray-700 hover:bg-gray-100"
//                             }`
//             }
//             onClick={() => setShowSidebar(window.innerWidth >= 1024)}
//           >
//             <item.Icon />
//             <span>{item.label}</span>
//           </NavLink>
//         ))}
//         <div onClick={logout} className="absolute bottom-5 hover:scale-105  text-custom_primary left-18 transform transition-transform duration-300 cursor-pointer -translate-x-1/2 flex items-center">
//           <BiLogOut className=" text-xl" />
//           <button  className=" py-2 px-2 cursor-pointer rounded-md transition">
//             Logout
//           </button>
//         </div>
//       </div>

//       {showSidebar && (
//         <button
//           onClick={() => setShowSidebar(false)}
//           className="fixed top-4 z-50 left-50 lg:hidden duration-300 p-2 rounded-full shadow-md"
//         >
//           <TbX size={24} className="text-gray-700" />
//         </button>
//       )}

//       <div
//         className={`w-full transition-all p-6 duration-300 ${
//           showSidebar ? "lg:w-[calc(100%-250px)]" : "lg:w-full"
//         } bg-blue-50 h-screen overflow-auto`}
//       >
//         <div className="p-4 flex items-center lg:hidden">
//           {!showSidebar && (
//             <button
//               onClick={() => setShowSidebar(true)}
//               className="text-gray-700"
//             >
//               <TbMenu2 size={24} />
//             </button>
//           )}
//         </div>

//         <Outlet />
//       </div>
//     </div>
//   );
// }



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
    <div className="flex h-screen  relative">
      {/* Sidebar */}
      <div
        className={` absolute lg:relative left-0 z-50 top-0 h-full bg-white p-4 shadow-lg transition-all duration-300 
            ${
              showSidebar
                ? "w-[250px]" // Full sidebar for lg screens
                : hoverSidebar
                ? "w-[250px]" // Expand on hover
                : "w-[70px]" // Icon-only mode for md screens and below
            }`}
        onMouseEnter={() => setHoverSidebar(true)}
        onMouseLeave={() => setHoverSidebar(false)}
      >
        <div className="mb-6 mx-auto flex justify-center">
          {/* Logo Placeholder */}
        </div>

        {/* Sidebar Links */}
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
              `flex items-center py-2 px-3 rounded-md transition-all ${
                isActive ? "bg-custom_primary text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
            onClick={() => setShowSidebar(window.innerWidth >= 1024)}
          >
            <item.Icon className="text-xl" />
            {hoverSidebar || showSidebar ? <span className="ml-3">{item.label}</span> : null}
          </NavLink>
        ))}

        {/* Logout Button */}
        {/* <div
          onClick={logout}
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center text-custom_primary cursor-pointer"
        >
          <BiLogOut className="text-xl" />
          {hoverSidebar || showSidebar ? (
            <button className="py-2 px-2 ml-2 cursor-pointer rounded-md transition">Logout</button>
          ) : null}+
        </div> */}
      </div>

      {/* Toggle Button for Small Screens */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-full shadow-md lg:hidden"
        >
          <TbMenu2 size={24} className="text-gray-700" />
        </button>
      )}

      {/* Content Section */}
      <div
        className={`w-full transition-all p-6 duration-300 ${
          showSidebar ? "lg:w-[calc(100%-250px)]" : "lg:w-full"
        } bg-blue-50 h-screen overflow-auto`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;


// export default DashboardLayout