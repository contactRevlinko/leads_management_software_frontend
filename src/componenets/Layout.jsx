import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import Topbar from "./Topbar";
import { Outlet, useNavigate } from "react-router";

const Layout = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const navigate = useNavigate();
  const handleSideBar = () => {
    setShowSideBar((prev) => !prev);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="bg-indigo-50 min-h-screen overflow-x-hidden">
      {showSideBar && (
        <div className="fixed backdrop-blur-sm inset-0 bg-black/40 " />
      )}
      <SideBar
        handleSideBar={handleSideBar}
        showSideBar={showSideBar}
        setShowSideBar={setShowSideBar}
      />

      <div className="lg:ml-72 min-h-screen">
        <Topbar handleSideBar={handleSideBar} />

        <main className="mt-24  mx-5   overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
