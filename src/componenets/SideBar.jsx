import React from "react";
import { NavLink } from "react-router";
import {  
  LayoutDashboard,
  UserRoundSearch,
  Calendar,
  BellRing,
  ChartLine,
  Users,
  Settings,
} from "lucide-react";

const SideBar = ({ showSideBar, setShowSideBar, handleSideBar }) => {
  return (
    <div
      className={`
    fixed left-0 top-0 h-screen w-72
    bg-indigo-50 p-5 border-r border-gray-300 z-20
    transition-transform duration-300
    ${showSideBar ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-indigo-700">LeadPro</h1>
          <p className="text-gray-500 text-sm">Enterprise CRM</p>
        </div>

        {showSideBar && (
          <button
            onClick={handleSideBar}
            className="lg:hidden bg-indigo-600 text-white w-8 h-8 rounded-full"
          >
            X
          </button>
        )}
      </div>

      <div className="flex flex-col  lg:gap-2 gap-5">
        <NavLink
          to="/"
          className="flex items-center gap-3  focus:border-r-2 hover:border-r-2 focus:bg-indigo-100 focus:text-indigo-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg p-2"
        >
          <LayoutDashboard size={22} />
          Dashboard
        </NavLink>

        <NavLink
          to="/leads"
          className="flex items-center gap-3 focus:border-r-2 hover:border-r-2 focus:bg-indigo-100 focus:text-indigo-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg p-2"
        >
          <UserRoundSearch size={22} />
          Leads
        </NavLink>
        <NavLink
          to="/followups"
          className="flex items-center gap-3   focus:border-r-2 hover:border-r-2  focus:bg-indigo-100 focus:text-indigo-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg p-2"
        >
          <Calendar size={22} />
          follow ups
        </NavLink>
        <NavLink
          to="/reminders"
          className="flex items-center gap-3  focus:border-r-2 hover:border-r-2 focus:bg-indigo-100 focus:text-indigo-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg p-2"
        >
          <BellRing size={22} />
          Reminders
        </NavLink>
        <NavLink
          to="/analytics"
          className="flex items-center gap-3 focus:border-r-2 hover:border-r-2 focus:bg-indigo-100 focus:text-indigo-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg p-2"
        >
          <ChartLine size={22} />
          Analytics
        </NavLink>
        <NavLink
          to="/team"
          className="flex items-center gap-3  focus:border-r-2 hover:border-r-2 focus:bg-indigo-100 focus:text-indigo-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg p-2"
        >
          <Users size={22} />
          Team
        </NavLink>
        <NavLink
          to="/settings"
          className="flex items-center gap-3   focus:border-r-2 hover:border-r-2 focus:bg-indigo-100 focus:text-indigo-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg p-2"
        >
          <Settings size={22} />
          Setting
        </NavLink>
      </div>
    </div>
  );
};

export default SideBar;
