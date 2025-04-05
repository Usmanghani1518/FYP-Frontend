import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { TbBell, TbSearch, TbSettings, TbUser, TbBook } from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import { backendRequest } from "@/Helper/backendRequest";
import logo from "../../../public/imagies/Logo.png";
import { ShoppingCart } from "lucide-react";

function StudentLayout() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for dropdown

  async function logout() {
    localStorage.clear();
    const response = await backendRequest("GET", "/auth/logout");
    if (response.success) {
      navigate("/login");
    }
  }

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center w-full px-20 fixed top-0 left-0 z-20">
        
        <Link to="/student" className="text-2xl font-bold">
          <img src={logo} className="w-24" alt="" />
        </Link>

        <div className="relative w-1/3 max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <TbSearch className="absolute right-3 top-3 text-gray-500" size={20} />
        </div>
        
        <div className="flex items-center space-x-6">
          <ShoppingCart size={24} className="text-gray-700 cursor-pointer" />
          
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-custom_primary text-white rounded-full focus:outline-none"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <TbUser size={20} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2">
                <NavLink to="/student/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                  <TbUser className="mr-2" /> My Profile
                </NavLink>
                <NavLink to="/courses" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                  <TbBook className="mr-2" /> Courses
                </NavLink>
                <NavLink to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                  <TbSettings className="mr-2" /> Settings
                </NavLink>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <BiLogOut className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Page Content */}
      <div className="flex-1 overflow-y-auto pt-16 bg-slate-50">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StudentLayout;
