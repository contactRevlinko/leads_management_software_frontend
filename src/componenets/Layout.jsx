import React, { useState } from "react";
import SideBar from "./SideBar";
import Topbar from "./Topbar";
import { Outlet, Navigate } from "react-router-dom";

const Layout = () => {
  const [showSideBar, setShowSideBar] = useState(false);

  const token = localStorage.getItem("token");

  const handleSideBar = () => {
    setShowSideBar((prev) => !prev);
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-indigo-50/50 min-h-screen overflow-x-hidden">
      {showSideBar && (
        <div className="fixed inset-0 z-10 bg-black/40 backdrop-blur-sm" />
      )}

      <SideBar
        handleSideBar={handleSideBar}
        showSideBar={showSideBar}
        setShowSideBar={setShowSideBar}
      />

      <div className="lg:ml-72 min-h-screen">
        <Topbar handleSideBar={handleSideBar} />

        <main className="pt-24 mx-5 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;