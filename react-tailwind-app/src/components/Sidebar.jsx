import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    BarChart4,
    Bell,
    Settings,
    ChevronDown,
    ChevronRight,
    List,
} from "lucide-react";

const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    // { name: "Reports", icon: FileText, path: "/dashboard/reports" },
    // { name: "Analytics", icon: BarChart4, path: "/dashboard/analytics" },
    // { name: "Notifications", icon: Bell, path: "/dashboard/notifications" },
    // { name: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const masters = [
    { label: "Center", basePath: "/dashboard/masters/center" },
    { label: "School", basePath: "/dashboard/masters/school" },
    { label: "Teacher", basePath: "/dashboard/masters/teacher" },
    { label: "Student", basePath: "/dashboard/masters/student" },
];

const reportItems = [
    { label: "School List", path: "/dashboard/reports/school-list" },
    { label: "Center List", path: "/dashboard/reports/center-list" },
    { label: "School Wise Result List", path: "/dashboard/reports/school-wise-results" },
    { label: "Center Wise Result List", path: "/dashboard/reports/center-wise-results" },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const [openMasters, setOpenMasters] = useState(false);
    const [openReports, setOpenReports] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState({});

    const toggleSubMenu = (label) => {
        setOpenSubmenus((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    return (
        <aside
            className={`
    fixed z-40 inset-y-0 left-0 transform bg-white border-r w-64 shadow-md
    transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:static md:translate-x-0

    h-screen overflow-y-auto
  `}
        >




            {/* Sidebar Header */}
            <div className="flex items-center justify-between mb-6 md:hidden">
                <span className="text-xl font-bold">Dashboard</span>
                <button onClick={() => setIsOpen(false)} className="text-gray-600 text-lg">&times;</button>
            </div>

            <div className="hidden md:flex items-center gap-2 mb-6">
                <div className="h-10 w-10 bg-black text-white flex items-center justify-center rounded-lg text-lg font-bold">
                    D
                </div>
                <span className="text-xl font-bold">Dashboard</span>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium ${isActive
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}

                {/* Masters Dropdown */}
                <div>
                    <button
                        onClick={() => setOpenMasters(!openMasters)}
                        className="flex items-center justify-between w-full px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md font-medium"
                    >
                        <div className="flex items-center gap-3">
                            <Settings className="w-5 h-5" />
                            Masters
                        </div>
                        {openMasters ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </button>

                    {openMasters && (
                        <div className="pl-10 mt-1 space-y-1">
                            {masters.map((item) => (
                                <div key={item.label}>
                                    <button
                                        onClick={() => toggleSubMenu(item.label)}
                                        className="flex items-center justify-between w-full px-2 py-1 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-md font-medium"
                                    >
                                        {item.label}
                                        {openSubmenus[item.label] ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                    </button>

                                    {openSubmenus[item.label] && (
                                        <div className="pl-4 mt-1 space-y-1 text-sm">
                                            <Link
                                                to={`${item.basePath}/add`}
                                                onClick={() => setIsOpen(false)}
                                                className="block px-3 py-1 rounded-md text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                Add {item.label}
                                            </Link>
                                            <Link
                                                to={`${item.basePath}/view`}
                                                onClick={() => setIsOpen(false)}
                                                className="block px-3 py-1 rounded-md text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                View {item.label}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* All Reports Dropdown */}
                <div>
                    <button
                        onClick={() => setOpenReports(!openReports)}
                        className="flex items-center justify-between w-full px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md font-medium"
                    >
                        <div className="flex items-center gap-3">
                            <List className="w-5 h-5" />
                            All Reports
                        </div>
                        {openReports ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </button>

                    {openReports && (
                        <div className="pl-10 mt-1 space-y-1 text-sm">
                            {reportItems.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-1 rounded-md text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
