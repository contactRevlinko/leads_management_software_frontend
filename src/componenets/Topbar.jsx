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
      console.log(event)
      console.log(boxRef.current)
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    }

  }, [])



  return (
    <div className="  justify-between lg:justify-end  fixed top-0 left-0 right-0 lg:left-64 h-20  lg:px-12 px-4  bg-indigo-50/50 border-b border-gray-300 z-10 flex items-center gap-3">
      <PanelRight
        onClick={handleSideBar}
        className="lg:hidden cursor-pointer text-gray-700 w-6 h-6"
      />{" "}
      {console.log(user)}
      <div className="flex gap-5  shrink-0">




        <div className="relative  " ref={boxRef}>
          <UserPlus className=" hover:m-1" onClick={() => setOpen(!open)} />
          {open && (
            <div className="absolute  rounded-2xl shadow flex flex-col justify-center items-center bg-white p-8 right-0 top-10">
              <div className="flex justify-between items-center flex-col">
                <div className="text-white text-xl mb-2 bg-indigo-700 rounded-full w-12 h-12 flex justify-center items-center">
                  {user?.name?.charAt(0)?.toUpperCase()}</div>
                <h1 className="font-medium mb-1 text-md">{user?.name}</h1>
                <h1 className=" text-md mb-1">{user?.phone}</h1>
                <h1 className=" text-md mb-1">{user?.businessType}</h1>
                <p className="text-sm mb-2">{user?.email}</p>
              </div>
              <button className="bg-red-700 w-full flex text-white gap-5 pl-2 py-1  rounded mt-2" onClick={handleLogout}>
                <Power className="mt-1" size={17} />
                LogOut
              </button>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};


export default Topbar;