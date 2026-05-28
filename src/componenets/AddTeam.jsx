import React, { useState } from "react";
import { User } from "lucide-react";
import CustomDropDown from "./CustomDropDown";
const BASE_URL = import.meta.env.VITE_API_URL;
const AddTeam = ({ setOpenAddTeam }) => {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        role: "Executive",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSaveTeam = async () => {
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
                alert(result.message || "failed to add team member");
            }
            alert("added team member successfully ");
            console.log("add team data ", result.data);
            setForm({
                name: "",
                phone: "",
                email: "",
                password: "",
                role: "Executive",
            });
            setOpenAddTeam(false);
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <div className="lg:w-[35%] md:w-[80%] w-[95%] md:m-auto  bg-white border-2 rounded-4xl  border-gray-200 ">
            <div className=" m-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900">
                            Add Team Member
                        </h1>

                        <p className="mt-2 text-sm sm:text-base text-gray-500">
                            Create a new team member and assign roles for lead management and follow-ups.
                        </p>
                    </div>

                    <button
                        onClick={() => setOpenAddTeam(false)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        X
                    </button>
                </div>

                <div className="lg:my-5 md:my-3 md:text-lg my-2 w-full">
                    <p className="text-sm md:mb-2 mb-1 font-medium"> Member Name </p>
                    <div className="flex  border border-gray-300 gap-2 p-2 rounded-md">
                        <User size={17} />
                        <input
                            type="text"
                            onChange={handleChange}
                            className=" outline-none  w-full rounded  text-sm"
                            name="name"
                            placeholder="Enter Full Name"
                            value={form.name}
                        />
                    </div>
                </div>
                <div className="lg:my-5 md:my-3 md:text-lg my-2 w-full">
                    <p className="text-sm md:mb-2 mb-1 font-medium"> Phone </p>
                    <input
                        type="text"
                        onChange={handleChange}
                        className=" outline-none  w-full text-sm  border border-gray-300 gap-2 p-2 rounded-md"
                        name="phone"
                        placeholder="enter your mobile number"
                        value={form.phone}
                    />
                </div>

                <div className="lg:my-5 md:my-3 md:text-lg my-2 w-full">
                    <p className="text-sm md:mb-2 mb-1 font-medium"> Email </p>
                    <input
                        type="email"
                        onChange={handleChange}
                        className=" outline-none  w-full text-sm  border border-gray-300 gap-2 p-2 rounded-md"
                        name="email"
                        placeholder="abcd123@gmail.com"
                        value={form.email}
                    />
                </div>
                <div>
                    <p className="text-sm mb-1 font-medium">Role </p>
                    <div className="w-full   text-sm flex  border border-gray-300 gap-2 p-2 rounded-md">
                        <CustomDropDown
                            value={form.role}
                            onChange={(value) => setForm({ ...form, role: value })}
                            options={["Sales Person", "Junior Sales", "Executive"]}
                        />
                    </div>
                </div>

                <div className="lg:my-5 md:my-3 md:text-lg my-2 w-full">
                    <p className="text-sm md:mb-2 mb-1 font-medium"> Password </p>
                    <input
                        onChange={handleChange}
                        className=" outline-none  w-full   text-sm flex  border border-gray-300 gap-2 p-2 rounded-md"
                        name="password"
                        placeholder="password"
                        value={form.password}
                        type="password"
                    />
                </div>

                <button
                    onClick={handleSaveTeam}
                    className="text-white w-[30%]  mt-5 py-1 px-2  border-2 border-gray-300 md:py-2 bg-indigo-700 md:px-3 lg:py-1 lg:px-2 cursor-pointer  rounded-xl  hover:bg-indigo-800 hover:font-medium hover:text-white  "
                >
                    Save team
                </button>
            </div>
        </div>
    );
};

export default AddTeam;
