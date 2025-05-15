import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BarChart4,
  Bell,
  Settings,
  Upload,
  X,
} from "lucide-react";
import logo from "./assets/logo.png";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Upload Documents", icon: Upload, path: "/upload" },
  { name: "Reports", icon: FileText, path: "/dashboard/reports" },
  { name: "Analytics", icon: BarChart4, path: "/dashboard/analytics" },
  { name: "Notifications", icon: Bell, path: "/dashboard/notifications" },
  { name: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r shadow-md">
      <div className="flex items-center justify-between px-4 py-3.5 border-b">
        {!collapsed && <img src={logo} alt="Logo" className="w-24" />}
        <button
          onClick={() =>
            window.innerWidth < 768 ? setIsOpen(false) : setCollapsed(!collapsed)
          }
          className="p-1 rounded hover:bg-gray-100"
        >
          {window.innerWidth < 768 ? <X size={20} /> : <span className="text-lg">≡</span>}
        </button>
      </div>

      <nav className="mt-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-auto">
        <aside className={`${collapsed ? "w-20" : "w-64"} h-full transition-all duration-300`}>
          <SidebarContent />
        </aside>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>
          <aside className="absolute left-0 top-0 w-64 h-full bg-white shadow-md z-50">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
