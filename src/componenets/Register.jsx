import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import CustomDropDown from "./CustomDropDown";
import { Circle, Eye, EyeOff, MoveRight, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import { validateEmail, validatePassword } from "../utils/validation";

// const BASE_URL = "http://localhost:5000/api/auth";
const BASE_URL = import.meta.env.VITE_API_URL;

console.log(BASE_URL, "BASE_URL");
const businessTypes = [
  "Wholesaler",
  "Retailer",
  "Distributor",
  "Manufacturer",
  "Supplier",
  "Trader",
  "Importer",
  "Exporter",
  "Dealer",
  "Service Provider",
  "Agency",
  "Franchise",
  "Consultant",
  "Freelancer",
  "Startup",
  "other",
];

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessType, setBusinessType] = useState("")
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);



  const handleRegister = async (e) => {
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
    e.preventDefault();
    try {
      if (!agree) {
        toast.success("please agree to terms and privacy policy")
        return;
      }
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          businessType,
          password,
          
          
        }),
      });
      const result = await res.json();
      console.log("register user", result);
      if (result.success) {
        if (result.data.paymentVerified) {
          navigate("/login");
        } else {
          navigate("/pricing", {
            state: {
              userId: result.data._id,
              name: result.data.name,
              email: result.data.email,
              phone: result.data.phone,
            },
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-slate-100  min-h-screen flex flex-col  ">

      <div className="flex justify-between bg-white  items-center py-3 px-10  ">
        <div className="flex gap-5 text-indigo-600  font-bold text-2xl">
          <TrendingUp className="w-10 h-10" />
          <h1>LMS</h1>
        </div>
        <div className="flex lg:flex-row lg:gap-5 flex-col ">
          <p className="text-gray-500">Already have an account?</p>
          <button className="text-indigo-600 font-medium cursor-pointer "
            onClick={() => navigate("/login")}>Log In</button>
        </div>
      </div>


      <div className="flex  justify-center items-center mt-10 ">

        <div className="bg-white lg:w-1/3 w-[90%] md:w-1/2 rounded-lg  ">
          <div className="flex flex-col mb-3 ">
            <h1 className="font-bold text-3xl tex-black mt-6 mb-2 text-center ">
              Create Account
            </h1>
            <p className="text-gray-400 text-center ">Helping businesses streamline their workflow and boost productivity</p>
          </div>
          <div className="flex flex-col items-start px-8 gap-5 ">
            <div className="w-full ">
              <h1 className="font-medium mb-1 text-gray-600 text-sm">Full Name</h1>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="outline-none border border-gray-300 text-sm    rounded-xl px-2 py-2 w-full"
                type="string"
                inputMode="text"
                placeholder="Enter your full name"
                name="user_name_239"
                autoComplete="off"
                autoCorrect="off"
              />
            </div>
            <div className="w-full ">
              <h1 className="font-medium mb-1  text-gray-600 text-sm ">Phone Number</h1>
              <input
                className="outline-none border border-gray-300 text-sm    rounded-xl px-2 py-2 w-full"

                type="text"
                name="field_839202"
                placeholder="Mobile number"
                value={phone}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");

                  if (value.length > 10) {
                    if (value.length >= 12 && value.startsWith("91")) {
                      toast.error("Please enter 10 digit number without +91");
                    } else {
                      toast.error("Only 10 digits allowed");
                    }
                    return;
                  }

                  setPhone(value);
                }}
                autoComplete="new-password"
                autoCorrect="off"
                spellCheck={false}
                readOnly
                onFocus={(e) => e.target.removeAttribute("readonly")}
              />
            </div>
            <div className="w-full ">
              <h1 className="font-medium mb-1 text-sm text-gray-600">Work Email</h1>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="outline-none border border-gray-300 text-sm    rounded-xl px-2 py-2 w-full"
                type="email"
                placeholder="username123@gamil.com"
                name="user_email_@233"
                autoComplete="new-password"
                autoCorrect="off"
              />
            </div>

            <div className="w-full">
              <h1 className="font-medium mb-1 text-sm text-gray-600">Password</h1>

              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="outline-none border border-gray-300 text-sm    rounded-xl px-2 py-2 w-full"
                  type={showPassword ? "text" : "password"}
                  placeholder="Type unique password"
                />

                {showPassword ? <Eye
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  size={20} onClick={() => setShowPassword(!showPassword)}

                /> :
                  <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    size={20} onClick={() => setShowPassword(!showPassword)}
                  />
                }

              </div>
            </div>

            <div className="w-full ">
              <h1 className="font-medium mb-1 text-sm text-gray-600">Business Type</h1>

              <div className="text-sm rounded px-2 py-1 w-full">
                <CustomDropDown value={businessType} options={businessTypes}
                  onChange={setBusinessType} />
              </div>
            </div>


            <div className="flex text-gray-500 items-center gap-2">
              <button
                type="button"
                onClick={() => setAgree(!agree)}
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-200
      ${agree
                    ? "bg-gradient-to-br from-indigo-500 to-blue-700 border-indigo-600 "
                    : "bg-white border-gray-300 shadow-inner"
                  }`}
              >
                {agree && <div className="w-2 h-2 bg-white rounded-full" />}
              </button>

              <p className="text-sm">
                I agree to the{" "}
                <span className="text-indigo-600 font-medium">Terms of Service</span> and{" "}
                <span className="text-indigo-600 font-medium">Privacy Policy</span>
              </p>
            </div>

          </div>
          <div className="text-center lg:my-8  my-6 px-6  lg:px-8">
            <button
              disabled={!agree}
              className={`flex justify-center gap-5 text-white lg:px-4 lg:py-2 px-2 py-1 rounded w-full ${agree
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
                }`}
              onClick={handleRegister}
            >
              Create your account
              <MoveRight />
            </button>
          </div>

        </div>
      </div>


      <div className="flex  flex-col text-sm lg:flex-row lg:justify-between bg-white mt-10 items-center gap-2 py-5 px-10 text-gray-500">
        <div>
          <p>@ 2026 LeadScale Systems Inc. All right reserved</p>
        </div>
        <ul className="flex  gap-5">
          <li>Privacy Police</li>
          <li>Terms of Service</li>
          <li>Help Center</li>

        </ul>
      </div>


    </div>
  );
};

export default Register;
