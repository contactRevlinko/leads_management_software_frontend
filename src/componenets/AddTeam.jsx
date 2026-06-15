import React, { useState } from "react";
import { Eye, EyeOff, User } from "lucide-react";
import CustomDropDown from "./CustomDropDown";
import { useDispatch, useSelector } from "react-redux";
const BASE_URL = import.meta.env.VITE_API_URL;
import { fetchTeamList } from "../redux/teamSlice";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { validateEmail, validatePassword } from "../utils/validation";

const AddTeam = ({ setOpenAddTeam }) => {
  const dispatch = useDispatch();
  const { teamList } = useSelector((state) => state.team);

  const [showPassword, setShowPassword] = useState(false);
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
      setOpenAddTeam(false);
      dispatch(fetchTeamList());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="lg:w-[35%] md:w-[80%] w-[95%] md:m-auto p-2 bg-white border-2 rounded border-gray-200 relative  z-50">
      <div className=" m-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 ">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900">
              Add Team Member
            </h1>

            <p className="mt-2 text-sm sm:text-base text-gray-500">
              Create a new team member and assign roles for lead management and
              follow-ups.
            </p>
          </div>

          <button
            onClick={() => setOpenAddTeam(false)}
            className="bg-indigo-100 text-indigo-700 font-medium md:w-12 md:h-12 lg:w-10 lg:h-10 w-7 h-7 hover:bg-indigo-200 rounded-lg flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <div className="lg:my-5 md:my-3 text-gray-600 md:text-lg my-2 w-full">
          <p className="text-sm md:mb-2 mb-1 font-medium"> Member Name </p>
          <div
            className={` ${form.name ? "bg-indigo-50 " : "bg-white "} flex  border border-gray-300 gap-2 p-2 rounded-xl`}
          >
            <User size={17} />
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="outline-none w-full  text-sm"
              name="random_team_name_999"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Enter full name"
            />
          </div>
        </div>

        <div className="flex gap-10">
          <div className="w-full ">
            <p className="text-sm md:mb-2 mb-1 font-medium text-gray-600">Work phone</p>
            <input
              className={`${form.phone1 ? "bg-indigo-50" : "bg-white"} outline-none w-full text-sm border border-gray-300 p-2 rounded-xl`}
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
              spellCheck={false} />
            <p className="text-sm md:mb-2 mb-1 font-medium text-gray-600">   Alternate phoner</p>
            <input
              className={`${form.phone2 ? "bg-indigo-50" : "bg-white"} outline-none w-full text-sm border border-gray-300 p-2 rounded-xl`}
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

          <div className="">
            <p className="text-sm mb-1 text-gray-600 font-medium">Role </p>

            <CustomDropDown
              value={form.role}
              onChange={(value) => setForm({ ...form, role: value })}
              options={["Sales Person", "Junior Sales", "Executive"]}
            />
          </div>
        </div>

        <div className="lg:my-5 md:my-3 md:text-lg my-2 w-full">
          <p className="text-sm md:mb-2 mb-1 font-medium text-gray-600 ">
            Work Email
          </p>
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
            className={`${form.email ? "bg-indigo-50" : "bg-white"} outline-none  w-full text-sm  border border-gray-300  p-2 rounded-xl`}

          />
        </div>

        <div className=" relative lg:my-5 md:my-3 md:text-lg my-2 w-full">
          <p className="text-sm md:mb-2 mb-1 font-medium text-gray-600">

            Password
          </p>
          <input
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={`${form.password ? "bg-indigo-50" : "bg-white"} outline-none  w-full text-sm  border border-gray-300  p-2 rounded-xl`}
            autoComplete="new-password"
            name="team_secret_839204"
            placeholder="Password"
            value={form.password}
            type={showPassword ? "text" : "password"}
          />
          {showPassword ? <Eye
            className="absolute right-3 top-12 -translate-y-1/2 text-gray-500 cursor-pointer"
            size={20} onClick={() => setShowPassword(!showPassword)}

          /> :
            <EyeOff className="absolute right-3 top-12 -translate-y-1/2 text-gray-500 cursor-pointer"
              size={20} onClick={() => setShowPassword(!showPassword)}
            />
          }
        </div>




        <button
          onClick={handleSaveTeam}
          className="
    w-full
    mt-5
    py-3 px-4
    bg-indigo-600
    text-white
    font-medium
    rounded-xl
    shadow-md
    transition-all duration-200
    hover:bg-indigo-700
    hover:shadow-lg
    active:scale-[0.98]
    cursor-pointer
  "
        >
          Save Team
        </button>
      </div>
    </div>
  );
};

export default AddTeam;
