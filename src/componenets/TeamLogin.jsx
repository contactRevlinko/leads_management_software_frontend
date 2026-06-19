// import React, { useState } from "react";
// import { Eye, EyeOff, Users } from "lucide-react";
// import { useNavigate } from "react-router";
// import toast from "react-hot-toast";

// const BASE_URL = import.meta.env.VITE_API_URL;

// const TeamLogin = () => {
//     const navigate = useNavigate();

//     const [showPassword, setShowPassword] = useState(false);
//     const [form, setForm] = useState({
//         email: "",
//         password: "",
//     });

//     const handleLogin = async () => {
//         if (!form.email || !form.password) {
//             toast.error("Email and password required");
//             return;
//         }

//         try {
//             const res = await fetch(`${BASE_URL}/team/login`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(form),
//             });

//             const result = await res.json();

//             if (!res.ok || !result.success) {
//                 toast.error(result.message || "Login failed");
//                 return;
//             }

//             localStorage.setItem("token", result.token);
//             // localStorage.setItem("loginType", "team");
//             localStorage.setItem("teamMember", JSON.stringify(result.teamMember));
   
//             // localStorage.setItem("teamMember", JSON.stringify(result.data));

//             toast.success("Team login successful");

//             navigate("/dashboard", { replace: true });
//         } catch (err) {
//             console.log(err);
//             toast.error("Something went wrong");
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
//             <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

//                 <div className="flex justify-center mb-5">
//                     <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
//                         <Users className="text-indigo-700" size={34} />
//                     </div>
//                 </div>

//                 <h1 className="text-3xl font-bold text-center text-gray-900">
//                     Team Login
//                 </h1>

//                 <p className="text-center text-gray-500 mt-2">
//                     Login with your team account
//                 </p>

//                 <div className="mt-6">
//                     <p className="text-sm font-medium text-gray-600 mb-2">
//                         Email
//                     </p>

//                     <input
//                         type="email"
//                         placeholder="Enter email"
//                         value={form.email}
//                         onChange={(e) =>
//                             setForm({ ...form, email: e.target.value })
//                         }
//                         className="w-full border border-gray-300 rounded-xl p-3 outline-none text-sm focus:border-indigo-500"
//                     />
//                 </div>

//                 <div className="mt-4 relative">
//                     <p className="text-sm font-medium text-gray-600 mb-2">
//                         Password
//                     </p>

//                     <input
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Enter password"
//                         value={form.password}
//                         onChange={(e) =>
//                             setForm({ ...form, password: e.target.value })
//                         }
//                         onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                                 handleLogin();
//                             }
//                         }}
//                         className="w-full border border-gray-300 rounded-xl p-3 pr-11 outline-none text-sm focus:border-indigo-500"
//                     />

//                     {showPassword ? (
//                         <Eye
//                             size={20}
//                             onClick={() => setShowPassword(false)}
//                             className="absolute right-3 top-[43px] text-gray-500 cursor-pointer"
//                         />
//                     ) : (
//                         <EyeOff
//                             size={20}
//                             onClick={() => setShowPassword(true)}
//                             className="absolute right-3 top-[43px] text-gray-500 cursor-pointer"
//                         />
//                     )}
//                 </div>

//                 <button
//                     onClick={handleLogin}
//                     className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition active:scale-[0.98]"
//                 >
//                     Login
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default TeamLogin;



import React, { useState } from "react";
import { Eye, EyeOff, Users } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const TeamLogin = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleLogin = async () => {
        if (!form.email || !form.password) {
            toast.error("Email and password required");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/team/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const result = await res.json();
            console.log("TEAM LOGIN RESPONSE:", result);

            if (!res.ok || !result.success) {
                toast.error(result.message || "Login failed");
                return;
            }

            // IMPORTANT FIX
            localStorage.setItem("token", result.token);
            localStorage.setItem("loginType", "team");

            localStorage.setItem(
                "teamMember",
                JSON.stringify(result.data)
            );

            localStorage.removeItem("user");

            toast.success("Team login successful");

            navigate("/dashboard", { replace: true });
          
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        }
    };
   
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

                <div className="flex justify-center mb-5">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Users className="text-indigo-700" size={34} />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center text-gray-900">
                    Team Login
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Login with your team account
                </p>

                <div className="mt-6">
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-xl p-3 outline-none text-sm"
                    />
                </div>

                <div className="mt-4 relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-xl p-3 pr-11 outline-none text-sm"
                    />

                    {showPassword ? (
                        <Eye
                            size={20}
                            onClick={() => setShowPassword(false)}
                            className="absolute right-3 top-[14px] cursor-pointer"
                        />
                    ) : (
                        <EyeOff
                            size={20}
                            onClick={() => setShowPassword(true)}
                            className="absolute right-3 top-[14px] cursor-pointer"
                        />
                    )}
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default TeamLogin;