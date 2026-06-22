import React, { useEffect, useState, useRef } from "react";
import {
  BellDot,
  UserPlus,
  Search,
  Info,
  PanelRight,
  Power,
} from "lucide-react";
import { useNavigate } from "react-router";


const Topbar = ({ handleSideBar }) => {




  const loginType = localStorage.getItem("loginType");

  let loggedUser = {};

  try {
    loggedUser =
      loginType === "team"
        ? JSON.parse(localStorage.getItem("teamMember") || "{}")
        : JSON.parse(localStorage.getItem("user") || "{}");
  } catch (err) {
    loggedUser = {};
  }



  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef(null);

  const handleLogout = () => {
    const type = localStorage.getItem("loginType");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("teamMember");
    localStorage.removeItem("loginType");

    if (type === "team") {
      navigate("/team-login", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
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
    <div className="backdrop-blur-md justify-between lg:justify-end fixed top-0 left-0 right-0 lg:left-72 h-20 lg:px-12 px-4 bg-white/80 border-b border-slate-200/80 shadow-sm z-40 flex items-center gap-3">
      <PanelRight
        onClick={handleSideBar}
        className="lg:hidden cursor-pointer text-gray-700 w-6 h-6"
      />{" "}
      {console.log(loggedUser)}
      <div className="flex gap-5  shrink-0">




        <div className="relative" ref={boxRef} >
          <UserPlus onClick={() => setOpen(!open)} />
          {open && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-3xl shadow-xl  border border-slate-100 p-4 z-50">

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-violet-500 text-white flex items-center justify-center font-semibold">
                  {loggedUser?.name?.charAt(0)?.toUpperCase()}
                </div>

                <h2 className="mt-2 text-sm font-semibold text-slate-700">
                  {loggedUser?.name}
                </h2>

                <div className="w-10 h-[1px] bg-slate-200 my-2"></div>
              </div>

              <div className="space-y-3">
                <div className="bg-indigo-50 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500 font-medium">
                    Phone
                  </span>

                  <span className="text-sm text-slate-800 font-semibold">
                    {loggedUser?.phone || loggedUser?.phone1 || "-"}
                  </span>
                </div>

                <div className="bg-indigo-50 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500 font-medium">
                    {loginType === "team" ? "Role" : "Business"}
                  </span>

                  <span className="text-sm text-slate-800 font-semibold">
                    {loginType === "team" ? loggedUser?.role : loggedUser?.businessType}
                  </span>
                </div>

                <div className="bg-indigo-50 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500 font-medium">
                    Email
                  </span>

                  <span className="text-xs text-slate-800 font-semibold max-w-[120px] truncate">
                    {loggedUser?.email}
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