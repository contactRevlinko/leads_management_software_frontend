import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "./UserContext";
const BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const { user, setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({

          email,
          password,
        }),
      });
      const result = await res.json();
      console.log("login user", result);
      if (res.ok) {
        localStorage.setItem("token", result.token);
        setUser(result.user)
        navigate("/")
      }
      else {
        navigate("/login")
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-indigo-100  min-h-screen flex justify-center items-center">
      <div className="bg-white lg:w-1/4  w-[80%] max-w-md rounded-2xl ">
        <h1 className="font-bold text-3xl text-indigo-700  mt-8 lg:mb-4 text-center">
          log In
        </h1>
        <div className="flex flex-col items-start px-8 gap-5 ">

          <div className="w-full ">
            <h1 className="font-medium mb-1  text-gray-700">email</h1>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="outline-none border-2 border-gray-300  hover:border-gray-400  rounded px-2 py-2 w-full"
              type="email"
              placeholder="username123@gamil.com"
            />
          </div>
          <div className="w-full ">
            <h1 className="font-medium mb-1  text-gray-700">password</h1>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="outline-none border-2 border-gray-300  hover:border-gray-400  rounded px-2 py-2 w-full"
              type="password"
              placeholder="type a password"
            />
          </div>
        </div>
        <div className="text-center my-10  px-8">
          <button
            className="bg-indigo-700 text-white px-4 py-2 rounded w-full"
            onClick={handleLogin}
          >
            log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
