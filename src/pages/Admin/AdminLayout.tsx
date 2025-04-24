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
import { backendRequest } from "@/Helper/backendRequest";

function AdminLayout() {
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
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {/* Mobile Menu Button - Only on small screens */}
      {!isLargeScreen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2 rounded-full bg-gray-800 shadow-lg md:hidden text-white"
          aria-label="Toggle Sidebar"
        >
          <TbMenu2 size={24} />
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
                "h-full bg-gray-800 text-white" : 
                "absolute left-0 top-0 h-full w-64 bg-gray-800 shadow-xl"
              }
            `}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 h-full flex flex-col">
              {/* Header with close/collapse button */}
              <div className={`mb-6 flex ${isCollapsed ? 'justify-center' : 'justify-between items-center'}`}>
                {!isCollapsed && <div className="text-xl font-semibold rounded-full">Admin Dashboard</div>}
                <button
                  onClick={toggleSidebar}
                  className="p-1 rounded-md hover:bg-gray-700 text-gray-300"
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
                  { href: "/dashboard", label: "Dashboard", Icon: TbDashboard },
                  { href: "/dashboard/teachers", label: "Teachers", Icon: TbUser },
                  { href: "/dashboard/students", label: "Students", Icon: TbRobot },
                  { href: "/dashboard/settings", label: "Settings", Icon: TbSettings },
                ].map((item, i) => (
                  <NavLink
                    to={item.href}
                    key={i}
                    end={item.href === "/dashboard"}
                    className={({ isActive }) =>
                      `flex items-center py-3 px-3 rounded-lg transition-all duration-200
                      ${isActive ? "bg-custom_primary text-white" : "text-gray-300 hover:bg-gray-700"}
                      ${isCollapsed ? 'justify-center' : ''}`
                    }
                    onClick={() => !isLargeScreen && setShowSidebar(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <item.Icon className={`text-xl ${isActive ? "text-white" : "text-gray-300"}`} />
                        {!isCollapsed && (
                          <>
                            <span className="ml-3 font-medium">{item.label}</span>
                            {isActive && (
                              <span className="ml-auto w-1 h-6 bg-white rounded-full"></span>
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
                <div className={`flex items-center py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-all duration-200 ${isCollapsed ? 'justify-center px-3' : 'px-3'}`}>
                  <BiLogOut className="text-xl" />
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

export default AdminLayout;
