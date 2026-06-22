import { UserCircle, Save } from "lucide-react";
import React, { useState, useEffect } from "react";
import CustomDropDown from "./CustomDropDown";
import toast from "react-hot-toast";
import { validateEmail, validatePassword } from "../utils/validation";

const BASE_URL = import.meta.env.VITE_API_URL;

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
    "Other",
];

const ProfileCard = () => {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        businessType: "",
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setForm({
                    name: user.name || "",
                    phone: user.phone || "",
                    email: user.email || "",
                    businessType: user.businessType || "",
                });
            } catch (e) {
                console.error("Error parsing user from localStorage", e);
            }
        }
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const updateProfile = async () => {
        if (!validateEmail(form.email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        if (!validatePassword(form.password)) {
            toast.error(
                "Password must contain 8+ characters, uppercase, lowercase, number and special character"
            )}
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${BASE_URL}/auth/update-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const result = await res.json();

            if (result.success) {
                localStorage.setItem("user", JSON.stringify(result.data));
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 md:p-8 hover:shadow-md transition-all duration-300">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <UserCircle className="w-6 h-6 text-indigo-600" />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-800">
                        Profile Information
                    </h3>

                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mt-0.5">
                        Update your personal account details
                    </p>
                </div>
            </div>


            <form autoComplete="off">
                <input type="text" name="fake_user" autoComplete="username" className="hidden" />
                <input type="password" name="fake_pass" autoComplete="current-password" className="hidden" />

                <div className="flex flex-col gap-5">
                    <div>
                        <label className="font-semibold mb-1.5 block text-slate-700 text-sm">
                            Full Name
                        </label>

                        <input
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                            name="field_839201"
                            type="text"
                            autoComplete="new-password"
                            autoCorrect="off"
                            spellCheck={false}
                            placeholder="Enter your full name"
                            className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="font-semibold mb-1.5 block text-slate-700 text-sm">
                            Phone Number
                        </label>

                        <input
                            value={form.phone}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    phone: e.target.value.replace(/\D/g, ""),
                                })
                            }
                            name="field_839202"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            autoComplete="new-password"
                            placeholder="Mobile number"
                            className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="font-semibold mb-1.5 block text-slate-700 text-sm">
                            Work Email
                        </label>

                        <input
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            name="field_839203"
                            type="email"
                            inputMode="email"
                            autoComplete="new-password"
                            autoCorrect="off"
                            spellCheck={false}
                            placeholder="username123@gmail.com"
                            className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="font-semibold mb-1.5 block text-slate-700 text-sm">
                            Business Type
                        </label>

                        <CustomDropDown
                            value={form.businessType}
                            options={businessTypes}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    businessType: value,
                                })
                            }
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={updateProfile}
                    className="mt-8 w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <Save size={18} />
                    Update Profile
                </button>
            </form>

        </div>
    );
};

export default ProfileCard;