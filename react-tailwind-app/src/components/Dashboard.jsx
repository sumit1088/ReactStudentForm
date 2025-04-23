import React from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  School,
  Building2, 
  UserRoundPen,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
      <p className="text-gray-600">Welcome to your dashboard, here's an overview of your data.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        {/* Total Users */}
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between">
            <p className="text font-bold">Total Centers</p>
            <div className="bg-blue-500 p-2 rounded-md">
              <Building2  className="text-white w-4 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-2">1,274</h3>
          {/* <p className="text-xs text-gray-500 mt-1">+12% from last month</p> */}
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between">
            <p className="text font-bold">Total Schools</p>
            <div className="bg-green-500 p-2 rounded-md">
              <School className="text-white w-4 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-2">775</h3>
          {/* <p className="text-xs text-gray-500 mt-1">+3.1% from last week</p> */}
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between">
            <p className="text font-bold">Total Students</p>
            <div className="bg-purple-500 p-2 rounded-md">
              <Users className="text-white w-4 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-2">4751</h3>
          {/* <p className="text-xs text-gray-500 mt-1">+8% from yesterday</p> */}
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between">
            <p className="text font-bold">Total Teachers</p>
            <div className="bg-orange-400 p-2 rounded-md">
              <UserRoundPen className="text-white w-4 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-2">354</h3>
          {/* <p className="text-xs text-gray-500 mt-1">+19% from last month</p> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
