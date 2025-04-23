import React, { useState, useRef, useEffect } from "react";
import { Bell, Settings, User, Menu } from "lucide-react"; // ✅ Import Menu icon
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    sessionStorage.clear();
    navigate("/Login");
  };

  return (
    <>
      <header className="flex items-center justify-between h-16 bg-white px-4 md:px-6 border-b relative">
        {/* Hamburger Menu */}
        <button className="md:hidden" onClick={toggleSidebar}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>

        <div className="flex items-center gap-4 relative" ref={menuRef}>
          <Bell className="w-5 h-5 cursor-pointer" />
          <Settings className="w-5 h-5 cursor-pointer" />
          <div className="relative">
            <User
              className="w-6 h-6 rounded-full cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-md z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
