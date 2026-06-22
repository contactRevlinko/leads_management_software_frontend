import React, { useState } from "react";
import { Eye, EyeOff, User, Plus } from "lucide-react";
import CustomDropDown from "./CustomDropDown";
import { useDispatch, useSelector } from "react-redux";
const BASE_URL = import.meta.env.VITE_API_URL;
import { fetchTeamList } from "../redux/teamSlice";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { validateEmail, validatePassword } from "../utils/validation";

const DEFAULT_ROLES = ["Sales Person", "Junior Sales", "Executive"];

const AddTeam = ({ setOpenAddTeam }) => {
  const dispatch = useDispatch();
  const { teamList } = useSelector((state) => state.team);

  // Roles already saved in DB via existing team members
  const dbRoles = teamList
    ? teamList.map((m) => m.role).filter(Boolean)
    : [];

  const [showPassword, setShowPassword] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [customRole, setCustomRole] = useState("");
  const [localCustomRoles, setLocalCustomRoles] = useState([]);
  // DB roles the user hid via × — persisted in localStorage
  const [hiddenDbRoles, setHiddenDbRoles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hiddenCustomRoles") || "[]");
    } catch {
      return [];
    }
  });

  const hideDbRole = (role) => {
    const updated = [...hiddenDbRoles, role];
    setHiddenDbRoles(updated);
    localStorage.setItem("hiddenCustomRoles", JSON.stringify(updated));
    if (form.role === role) setForm((f) => ({ ...f, role: "" }));
  };

  // Non-default DB roles visible this session (de-duplicated, not hidden)
  const visibleDbRoles = Array.from(
    new Set(dbRoles.filter((r) => !DEFAULT_ROLES.includes(r) && !hiddenDbRoles.includes(r)))
  );

  const [form, setForm] = useState({
    name: "",
    phone1: "",
    phone2: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveTeam = async () => {
    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!validatePassword(form.password)) {
      toast.error(
        "Password must contain 8+ characters, uppercase, lowercase, number and special character"
      );
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/team/create-team-mem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        toast(result.message || "failed to add team member");
        return;
      }
      toast.success("Team member added successfully");
      console.log("add team data ", result.data);
      setForm({
        name: "",
        phone1: "",
        phone2: "",
        email: "",
        password: "",
        role: "",
      });
      setIsCustom(false);
      setCustomRole("");
      setOpenAddTeam(false);
      dispatch(fetchTeamList());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="lg:w-[35%] md:w-[60%] w-[95%] md:m-auto bg-white border border-slate-200/60 rounded-2xl shadow-xl relative z-50 p-6 md:p-8">
      <div>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Add Team Member
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Create a new team member and assign roles for lead management and follow-ups.
            </p>
          </div>

          <button
            onClick={() => setOpenAddTeam(false)}
            className="bg-indigo-100 text-indigo-700 font-medium w-10 h-10 hover:bg-indigo-200 rounded-lg flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-5 text-slate-700 w-full">
          <label className="text-sm mb-1.5 font-semibold block">Member Name</label>
          <div
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
              form.name ? "bg-indigo-50/50 border-indigo-200" : "bg-slate-50/50 hover:bg-slate-50 focus-within:bg-white border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10"
            }`}
          >
            <User size={18} className={form.name ? "text-indigo-500" : "text-slate-400"} />
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="outline-none w-full text-sm bg-transparent"
              name="random_team_name_999"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Enter full name"
            />
          </div>
        </div>

        {/* Role Dropdown — moved to top */}
        <div className="mb-5 text-slate-700 w-full">
          <label className="text-sm mb-1.5 font-semibold block">Role</label>
          <CustomDropDown
            value={form.role}
            onChange={(value) => {
              if (value === "Add Custom Role...") {
                setCustomRole("");
                setForm({ ...form, role: "" });
                setIsCustom(true);
              } else {
                setIsCustom(false);
                setForm({ ...form, role: value });
              }
            }}
            options={[
              "Add Custom Role...",
              ...DEFAULT_ROLES,
              // DB custom roles — deletable (persisted via localStorage)
              ...visibleDbRoles.map((r) => ({
                label: r,
                value: r,
                deletable: true,
                onDelete: () => hideDbRole(r),
              })),
              // Session-added custom roles — deletable (removed from state)
              ...localCustomRoles.map((r) => ({
                label: r,
                value: r,
                deletable: true,
                onDelete: () => {
                  setLocalCustomRoles((prev) => prev.filter((x) => x !== r));
                  if (form.role === r) setForm((f) => ({ ...f, role: "" }));
                },
              })),
            ]}
          />

          {isCustom && (
            <div className="mt-3 flex gap-2 items-center">
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const trimmed = customRole.trim();
                    if (!trimmed) return;
                    setLocalCustomRoles((prev) => [...prev, trimmed]);
                    setForm({ ...form, role: trimmed });
                    setCustomRole("");
                    setIsCustom(false);
                  }
                }}
                placeholder="Enter custom role name"
                autoFocus
                className="outline-none flex-1 text-sm border border-gray-300 p-2.5 h-11 rounded-xl bg-indigo-50/20 focus:border-indigo-500 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => {
                  const trimmed = customRole.trim();
                  if (!trimmed) return;
                  setLocalCustomRoles((prev) => [...prev, trimmed]);
                  setForm({ ...form, role: trimmed });
                  setCustomRole("");
                  setIsCustom(false);
                }}
                className="h-11 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-1.5 text-sm font-medium transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
              >
                <Plus size={15} />
                Add
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {/* Work Phone */}
          <div>
            <label className="text-sm mb-1.5 text-slate-700 font-semibold block">Work phone</label>
            <input
              className={`w-full outline-none text-sm px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                form.phone1 ? "bg-indigo-50/50 border-indigo-200" : "bg-slate-50/50 hover:bg-slate-50 focus:bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
              type="text"
              name="field_839202"
              placeholder="Enter mobile number"
              value={form.phone1}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.startsWith("91") && value.length > 10) {
                  toast.error("Please enter mobile number without +91");
                  value = value.substring(2);
                }
                if (value.length > 10) {
                  toast.error("Only 10 digits allowed");
                }
                setForm({
                  ...form,
                  phone1: value.slice(0, 10),
                });
              }}
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>

          {/* Alternate Phone */}
          <div>
            <label className="text-sm mb-1.5 text-slate-700 font-semibold block">Alternate phone</label>
            <input
              className={`w-full outline-none text-sm px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                form.phone2 ? "bg-indigo-50/50 border-indigo-200" : "bg-slate-50/50 hover:bg-slate-50 focus:bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
              type="text"
              name="field_839202"
              placeholder="Enter mobile number"
              value={form.phone2}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.startsWith("91") && value.length > 10) {
                  toast.error("Please enter mobile number without +91");
                  value = value.substring(2);
                }
                if (value.length > 10) {
                  toast.error("Only 10 digits allowed");
                }
                setForm({
                  ...form,
                  phone2: value.slice(0, 10),
                });
              }}
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>

          {/* Work Email */}
          <div>
            <label className="text-sm mb-1.5 text-slate-700 font-semibold block">Work Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              name="work_mail_839203"
              type="text"
              inputMode="email"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              placeholder="username@gmail.com"
              className={`w-full outline-none text-sm px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                form.email ? "bg-indigo-50/50 border-indigo-200" : "bg-slate-50/50 hover:bg-slate-50 focus:bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm mb-1.5 text-slate-700 font-semibold block">Password</label>
            <input
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full outline-none text-sm px-4 py-2.5 pr-10 rounded-xl border transition-all duration-200 ${
                form.password ? "bg-indigo-50/50 border-indigo-200" : "bg-slate-50/50 hover:bg-slate-50 focus:bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
              autoComplete="new-password"
              name="team_secret_839204"
              placeholder="Password"
              value={form.password}
              type={showPassword ? "text" : "password"}
            />
            {showPassword ? (
              <Eye
                className="absolute right-3 top-[34px] text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
                size={18}
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <EyeOff
                className="absolute right-3 top-[34px] text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
                size={18}
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>

        </div>

        <button
          onClick={handleSaveTeam}
          className="w-full mt-8 py-3 px-4 bg-indigo-600 text-white font-medium rounded-xl shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md active:scale-[0.98] cursor-pointer"
        >
          Save Team Member
        </button>
      </div>
    </div>
  );
};

export default AddTeam;
