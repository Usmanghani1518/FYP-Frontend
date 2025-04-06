import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import logo from '../../../public/imagies/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/redux/app.hooks';

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSidebarOpen]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="mx-auto px-4 py-3 flex items-center justify-between relative">
        {/* Mobile Header */}
        <div className="flex items-center justify-between w-full md:hidden">
          <Button variant="ghost" size="icon" className="text-gray-500" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          {!isSearchActive && (
            <Link to="/" className="text-2xl font-bold">
              <img src={logo} className="w-24" alt="Logo" />
            </Link>
          )}
          <div className="flex items-center space-x-2">
            {!isSearchActive ? (
              <>
                <Button variant="ghost" size="icon" className="text-gray-500" onClick={() => setIsSearchActive(true)}>
                  <Search className="h-5 w-5" />
                </Button>
                <Link to="/student/cart" className="relative p-1">
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <Button variant="ghost" size="icon" className="text-gray-500" onClick={() => setIsSearchActive(false)}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {isSearchActive && (
          <div className="absolute inset-x-0 top-0 bg-white p-2 md:hidden">
            <div className="relative flex">
              <Input
                type="search"
                placeholder="Search for anything"
                className="w-full shadow-none pl-10 pr-10 py-2 rounded-3xl border border-b-2 outline-none"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Button variant="ghost" size="icon" className="absolute right-2" onClick={() => setIsSearchActive(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Desktop Header */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-3xl font-bold">
            <img src={logo} className="w-28" alt="Logo" />
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="#" className="text-sm hover:text-custom_primary">
                  Categories
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-grow mx-4 hidden md:block">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search for anything"
              className="w-full pl-10 pr-4 py-2 rounded-3xl border border-black"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {/* <Link to="#" className="text-sm hover:text-custom_primary">
            EduConnect Business
          </Link> */}
          <Link to="/login-teacher" className="text-sm hover:text-custom_primary">
            Teach on EduConnect
          </Link>
          <Link to="/student/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1 ring-2 ring-white">
                {totalItems}
              </span>
            )}
          </Link>
          <Button onClick={() => navigate("/login")} variant="outline">Log in</Button>
          <Button onClick={() => navigate("/signup")}>Sign up</Button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transition-transform duration-300 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <span className="text-xl font-bold">Menu</span>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="p-4 space-y-4">
            <Input
              type="search"
              placeholder="Search for anything"
              className="w-full pl-10 pr-4 py-2 rounded-3xl border border-black"
            />
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="block py-2 hover:text-custom_primary rounded">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="#" className="block py-2 hover:bg-gray-100 hover:text-custom_primary rounded">
                    EduConnect Business
                  </Link>
                </li>
                <li>
                  <Link to="#" className="block py-2 hover:bg-gray-100 hover:text-custom_primary rounded">
                    Teach on EduConnect
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cart Items: {totalItems}</span>
              <Link to="/cart" className="text-sm text-blue-600 hover:underline">
                View Cart
              </Link>
            </div>
            <Button
              onClick={() => navigate("/signup")}
              variant={"default"}
              className="w-full bg-custom_primary_hover"
            >
              Sign up
            </Button>
            <Button onClick={() => navigate("/login")} variant="outline" className="w-full">
              Log in
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}