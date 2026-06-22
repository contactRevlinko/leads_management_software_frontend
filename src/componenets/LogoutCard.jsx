import { LogOut, ShieldCheck } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

const LogoutCard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 md:p-8 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-red-500" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Logout
          </h3>
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mt-0.5">
            Securely sign out from your account
          </p>
        </div>
      </div>

      <div className="flex justify-center my-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border-4 border-white shadow-sm"></div>
          <LogOut className="w-10 h-10 text-red-500 ml-1" />
        </div>
      </div>

      <p className="text-slate-500 mb-8 mx-auto text-center w-full md:w-2/3 text-sm">
        Click the button below to end your current session.
      </p>

      <div className="flex justify-center">
        <button
          onClick={handleLogout}
          className="w-full sm:w-auto px-8 py-2.5 bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout Account
        </button>
      </div>
    </div>
  );
};

export default LogoutCard;