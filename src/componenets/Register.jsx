import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import CustomDropDown from "./CustomDropDown";



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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
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
      if (res.ok) {
        navigate("/login");
      } else {
        navigate("/register");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-indigo-100  min-h-screen flex justify-center items-center">
      <div className="bg-white lg:w-1/4 w-[90%] md:w-1/2 rounded-2xl ">
        <h1 className="font-bold text-3xl text-indigo-700  mt-8 mb-4 text-center">
          Sign Up
        </h1>
        <div className="flex flex-col items-start px-8 gap-5 ">
          <div className="w-full ">
            <h1 className="font-medium mb-1 text-gray-700">name</h1>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="outline-none border-2 border-gray-300 hover:border-gray-400 rounded px-2 py-2 w-full"
              type="string"
              placeholder="Enter your full name"
            />
          </div>
          <div className="w-full ">
            <h1 className="font-medium mb-1  text-gray-700">phone</h1>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="outline-none border-2 border-gray-300  hover:border-gray-400  rounded px-2 py-2 w-full"
              type="string"
              placeholder="Mobile number "
            />
          </div>
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
            <h1 className="font-medium mb-1  text-gray-700">business Type</h1>

            <div className="outline-none border-2  border-gray-300  hover:border-gray-400  rounded px-2 py-2 w-full">
              <CustomDropDown value={businessType} options={businessTypes}
                onChange={setBusinessType} />
            </div>
          </div>
          <div className="w-full ">
            <h1 className="font-medium mb-1  text-gray-700">password</h1>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="outline-none border-2 border-gray-300  hover:border-gray-400  rounded px-2 py-2 w-full"
              type="password"
              placeholder="type unique password"
            />
          </div>
        </div>
        <div className="text-center my-10    px-8">
          <button
            className="bg-indigo-700 text-white px-4 py-2 rounded w-full"
            onClick={handleRegister}
          >
            Sign Up
          </button>
          <p
            className="cursor-pointer text-blue-700 mt-2 font-medium hover:underline"
            onClick={() => navigate("/login")}
          >
            click here for login{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
