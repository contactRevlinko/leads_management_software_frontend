import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import Topbar from "./Topbar";
import { Outlet, Navigate, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const Layout = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSideBar = () => {
    setShowSideBar((prev) => !prev);
  };

  useEffect(() => {
    const checkStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/auth/check-status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403 || res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    

    checkStatus();
 
    const interval = setInterval(checkStatus, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);

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