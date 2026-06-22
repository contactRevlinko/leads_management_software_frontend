import { LockKeyhole } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { validateEmail, validatePassword } from "../utils/validation";

const BASE_URL = import.meta.env.VITE_API_URL;

const SecurityCard = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const changePassword = async () => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!validatePassword(password)) {
      toast.error(
        "Password must contain 8+ characters, uppercase, lowercase, number and special character"
      );
      return;
    }
    try {
      if (form.newPassword !== form.confirmPassword) {
        return alert("Password do not match");
      }

      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        setForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 md:p-8 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
          <LockKeyhole className="w-6 h-6 text-orange-500" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Change Password
          </h3>
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mt-0.5">
            Update your account password
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="w-full">
          <h1 className="font-semibold mb-1.5 block text-slate-700 text-sm">
            Current Password
          </h1>
          <input
            value={form.currentPassword}
            onChange={handleChange}
            name="currentPassword"
            className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
            type="password"
            placeholder="Enter Current Password"
          />
        </div>

        <div className="w-full">
          <h1 className="font-semibold mb-1.5 block text-slate-700 text-sm">
            New Password
          </h1>
          <input
            value={form.newPassword}
            onChange={handleChange}
            name="newPassword"
            className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
            type="password"
            placeholder="Enter New Password"
          />
        </div>

        <div className="w-full">
          <h1 className="font-semibold mb-1.5 block text-slate-700 text-sm">
            Confirm Password
          </h1>
          <input
            value={form.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
            type="password"
            placeholder="Enter Confirm Password"
          />
        </div>
      </div>

      <button
        onClick={changePassword}
        className="mt-8 w-full sm:w-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
      >
        <LockKeyhole className="w-5 h-5" />
        Update Password
      </button>
    </div>
  );
};

export default SecurityCard;