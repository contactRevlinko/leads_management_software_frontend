import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "./UserContext";
import { Eye, EyeOff, TrendingUp } from "lucide-react";

import { validateEmail, validatePassword } from "../utils/validation";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const { user, setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

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
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/dashboard", { replace: true });
      } else {

        if (result.paymentRequired) {
          toast.error("Please complete payment first");

          navigate("/pricing", {
            replace: true,
            state: {
              userId: result.user._id,
              name: result.user.name,
              email: result.user.email,
              phone: result.user.phone,
            },
          });
          return;

        
        
        }

        toast.error(result.message || "Login failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="bg-slate-100  min-h-screen flex flex-col">
      <div className="flex justify-between bg-white  items-center py-5 px-10  ">
        <div className="flex gap-5 text-indigo-600   font-bold text-2xl">
          <TrendingUp className="w-10 h-10" />
          <h1>LMS</h1>
        </div>
        <div className="flex  lg:gap-3  flex-col ">
          <p className="text-gray-500">Don't have an account?</p>
          <button
            className="text-indigo-600 font-medium cursor-pointer "
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>
        </div>

      </div>

      <div className="bg-white  flex flex-col justify-center m-auto w-[80%] max-w-md rounded-lg ">
        <div className="flex flex-col justify-between items-center px-5">
          <h1 className="font-bold text-3xl text-black  mt-8 lg:mb-4 text-center">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-center mb-3">
            Sign in to access your dashboard, manage leads, track customer
            interactions, and grow your business with confidence.
          </p>
        </div>
        <div className="flex flex-col items-start px-8 gap-5 ">
          <div className="w-full mt-5 ">
            <h1 className="font-medium text-sm mb-1  text-gray-500">
              Work Email
            </h1>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="outline-none border border-gray-300 text-sm    rounded-xl px-2 py-2 w-full"
              type="email"
              placeholder="username123@gamil.com"
              name="user_name_45"
              autoComplete="off"
              autoCorrect="off"


            />
          </div>
          <div className="w-full relative">
            <h1 className="font-medium mb-1 text-sm text-gray-700">Password</h1>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="outline-none border border-gray-300 text-sm    rounded-xl px-2 py-2 w-full"
              type={showPassword ? "text" : "password"}
              placeholder="Type a password"
            />

            {showPassword ? <Eye
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              size={20} onClick={() => setShowPassword(!showPassword)}

            /> :
              <EyeOff className="absolute  right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                size={20} onClick={() => setShowPassword(!showPassword)}
              />
            }
            <p className="text-sm text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-indigo-600 font-medium hover:text-indigo-700"
              >
                Forgot Password?
              </Link>
            </p>

          </div>
        </div>
        <div className="text-center my-5 pb-5 px-8">
          <button
            className="bg-indigo-700 text-white px-4 py-2 mb-2 rounded w-full"
            onClick={handleLogin}
          >

            Log In
          </button>


        </div>
      </div>

      <div className="flex flex-col text-sm lg:justify-between bg-white  lg:items-center gap-2 py-5 px-10 text-gray-500">
        <div>
          <p>@ 2026 LeadScale Systems Inc. All right reserved</p>
        </div>
        <ul className="flex gap-5">
          <li>Privacy Police</li>
          <li>Terms of Service</li>
          <li>Help Center</li>
        </ul>
      </div>
    </div>
  );
};

export default Login;
