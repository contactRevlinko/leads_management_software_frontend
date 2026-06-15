import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserRoundSearch,
  Calendar,
  BellRing,
  ChartLine,
  Users,
  Settings,
  X,
} from "lucide-react";

const SideBar = ({ showSideBar, handleSideBar }) => {
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200
    ${isActive
      ? "bg-indigo-100 text-indigo-700 font-semibold border-r-4 border-indigo-600"
      : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
    }`;

  return (
    <div
      className={`
        fixed left-0 top-0 h-screen w-72
        bg-white
        p-5 border-r border-gray-200 z-50
        transition-transform duration-300
        ${showSideBar ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-indigo-700">LeadPro</h1>
          <p className="text-gray-500 text-sm">Enterprise CRM</p>
        </div>

        <button
          onClick={handleSideBar}
          className="lg:hidden bg-indigo-600 text-white w-9 h-9 rounded-full flex items-center justify-center"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <NavLink to="/dashboard" className={navClass}>
          <LayoutDashboard size={22} />
          Dashboard
        </NavLink>

        <NavLink to="/leads" className={navClass}>
          <UserRoundSearch size={22} />
          Leads
        </NavLink>

        <NavLink to="/followups" className={navClass}>
          <Calendar size={22} />
          Follow Ups
        </NavLink>

        <NavLink to="/reminders" className={navClass}>
          <BellRing size={22} />
          Reminders
        </NavLink>

        <NavLink to="/analytics" className={navClass}>
          <ChartLine size={22} />
          Analytics
        </NavLink>

        <NavLink to="/team" className={navClass}>
          <Users size={22} />
          Team
        </NavLink>

        <NavLink to="/settings" className={navClass}>
          <Settings size={22} />
          Settings
        </NavLink>
      </div>
    </div>
  );
};


// const SideBar = () => {
//   return <div>Sidebar Working</div>;
// };
export default SideBar;