import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  TbDashboard,
  TbRobot,
  TbMenu2,
  TbX,
  TbSettings,
  TbUser,
} from "react-icons/tb";
import { useState, useEffect } from "react";
import { BiLogOut } from "react-icons/bi";

function AdminLayout() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 1024);
  const [hoverSidebar, setHoverSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const lgScreen = window.innerWidth >= 1024;
      setIsLargeScreen(lgScreen);
      setShowSidebar(lgScreen);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
      <div
        className={`fixed h-screen shadow-lg transition-all duration-300 z-20 bg-gray-800
          ${
            !isLargeScreen
              ? !showSidebar
                ? "w-0"
                : hoverSidebar
                ? "w-[250px]"
                : "w-[70px]"
              : "w-[250px]"
          }`}
        onMouseEnter={() => setHoverSidebar(true)}
        onMouseLeave={() => setHoverSidebar(false)}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="mb-6 mx-auto flex justify-center">
            <div className="px-6 py-2t font-bold text-xl rounded-md">Admin Dashboard</div>
          </div>

          <div className="space-y-2 flex-grow">
            {[
              {
                href: "/dashboard",
                label: "Dashboard",
                Icon: TbDashboard,
              },
              {
                href: "/dashboard/teachers",
                label: "Teacher",
                Icon: TbUser,
              },
              {
                href: "/assistants",
                label: "Assistants",
                Icon: TbRobot,
              },
              {
                href: "/setting",
                label: "Setting",
                Icon: TbSettings,
              },
            ].map((item, i) => (
              <NavLink
                to={item.href}
                key={i}
                end={item.href === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center py-3 px-3 rounded-md transition-all duration-200 overflow-hidden whitespace-nowrap
                  ${
                    isActive
                      ? "bg-custom_primary text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`
                }
              >
                <item.Icon className="text-xl min-w-[24px]" />
                <span
                  className={`ml-3 transition-opacity duration-200 ${
                    isLargeScreen || (showSidebar && hoverSidebar)
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  {item.label}
                </span>
              </NavLink>
            ))}
          </div>

          <div onClick={logout} className="mt-auto px-3 cursor-pointer mb-4">
            <div
              className="flex items-center py-3 px-3 rounded-md transition-all duration-200 text-gray-300 hover:bg-gray-700"
            >
              <BiLogOut className="text-xl min-w-[24px]" />
              <span
                className={`ml-3 transition-opacity duration-200 ${
                  isLargeScreen || (showSidebar && hoverSidebar)
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                Logout
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="fixed top-4 left-4 z-30 p-2 rounded-full shadow-md lg:hidden bg-gray-800 text-white"
      >
        {showSidebar ? <TbX size={24} /> : <TbMenu2 size={24} />}
      </button>

      <div
        className={`flex-1 overflow-y-auto h-screen transition-all duration-300 ${
          isLargeScreen ? "ml-[250px]" : "ml-0"
        }`}
      >
        <div className="p-6 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
