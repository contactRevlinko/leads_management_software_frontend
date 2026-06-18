import React, { useEffect, useRef, useState } from "react";
import {
  BellDot,
  UserPlus,
  Search,
  Info,
  PanelRight,
  Power,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useUser } from "./UserContext";


const Topbar = ({ handleSideBar }) => {
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef()

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  return (
    <div className="  justify-between lg:justify-end  fixed top-0 left-0 right-0 lg:left-64 h-20  lg:px-12 px-4  bg-indigo-50/50 border-b border-gray-300 z-10 flex items-center gap-3">
      <PanelRight
        onClick={handleSideBar}
        className="lg:hidden cursor-pointer text-gray-700 w-6 h-6"
      />{" "}
      {console.log(user)}
      <div className="flex gap-5  shrink-0">




        <div className="relative  " ref={boxRef}>
          <UserPlus onClick={() => setOpen(!open)} />
          {open && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-3xl shadow-xl  border border-slate-100 p-4 z-50">

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-violet-500 text-white flex items-center justify-center font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>

                <h2 className="mt-2 text-sm font-semibold text-slate-700">
                  {user?.name}
                </h2>

                <div className="w-10 h-[1px] bg-slate-200 my-2"></div>
              </div>

              <div className="space-y-3">
                <div className="bg-indigo-50 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500 font-medium">
                    Phone
                  </span>

                  <span className="text-sm text-slate-800 font-semibold">
                    {user?.phone}
                  </span>
                </div>

                <div className="bg-indigo-50 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500 font-medium">
                    Business
                  </span>

                  <span className="text-sm text-slate-800 font-semibold">
                    {user?.businessType}
                  </span>
                </div>

                <div className="bg-indigo-50 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500 font-medium">
                    Email
                  </span>

                  <span className="text-xs text-slate-800 font-semibold max-w-[120px] truncate">
                    {user?.email}
                  </span>
                </div>

              </div>


              <button
                onClick={handleLogout}
                className="w-full mt-4 flex items-center justify-center gap-2 border border-red-200 text-red-500 text-sm font-medium py-2 rounded-lg transition-all duration-200 hover:bg-red-500 hover:text-white hover:border-red-500"
              >
                <Power size={15} />
                Logout
              </button>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};


export default Topbar;