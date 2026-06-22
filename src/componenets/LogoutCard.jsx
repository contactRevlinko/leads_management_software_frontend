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
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 md:p-6 lg:p-8 hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4 md:gap-5">
        <div className="min-w-12 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-100 flex mt-5 items-center justify-center">
          <ShieldCheck className="w-6 h-6 md:w-7 md:h-7  text-red-500" />
        </div>

        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            Logout
          </h3>

          <p className="text-sm md:text-base text-gray-500 mt-1">
            Securely sign out from your CRM account and end your current
            session.
          </p>
        </div>
      </div>

      <div className="flex justify-center my-6 md:my-8">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
          <LogOut className="w-10 h-10 md:w-14 md:h-14 text-red-500" />
        </div>
      </div>

      <p className="text-gray-400 mb-8 md:mb-10 mx-auto text-center w-full md:w-2/3 text-sm md:text-base">
        Click the button below to securely logout from your account.
      </p>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-200 flex items-center justify-center gap-2"
      >
        <LogOut size={18} />
        Logout Account
      </button>
    </div>
  );
};

export default LogoutCard;