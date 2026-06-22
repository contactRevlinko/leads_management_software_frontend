import React, { useEffect, useState } from "react";
import { Phone, Mail, UsersRound, MessageSquareText } from "lucide-react";
import toast from "react-hot-toast";
import CustomCalendar from "./CustomCalender";
import { X } from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;

const AddFollowUps = ({ lead, setShowFollowUps }) => {
  const [selectedtype, setSelectedType] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const [form, setForm] = useState({
    leadId: "",
    followUpDate: today,
    followUpTime: currentTime,
    followUpType: "",
    notes: "",
    nextFollowupDate: today,
  });



  const handleChange = (e) => {
    console.log(e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const setFollowUpType = (type) => {
    setSelectedType(type);
    setForm({
      ...form,
      followUpType: type,
    });
    console.log(type);
  };

  const handleSubmit = async () => {
    if (!form.followUpType || !form.followUpDate || !form.followUpTime) {
      alert("please fill all required fields");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const finalData = { ...form, leadId: lead._id };
      const res = await fetch(`${BASE_URL}/followups/create-followups`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalData),
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setShowFollowUps(false);
        toast.success("followedup added successfully");
      }

      setForm({
        leadId: lead.id || "",
        followUpDate: today,
        followUpTime: currentTime,
        followUpType: "Call",
        notes: "",
        nextFollowupDate: today,
      });

      setSelectedType("");
    } catch (err) {
      console.log(err);
      toast.error("Error in  adding follow up");
    }
  };

  return (
    <div className="lg:w-[35%] w-[95%] md:m-auto bg-white border border-slate-200/60 rounded-2xl shadow-xl relative z-50 p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Schedule Follow Up
          </h1>
          <p className="mt-2 text-sm font-medium text-indigo-700 bg-indigo-50 inline-block px-2.5 py-1 rounded-md">
            Lead: {lead?.name}
          </p>
        </div>
        <button
          onClick={() => setShowFollowUps(false)}
          className="bg-slate-100 text-slate-500 hover:text-slate-700 font-medium w-10 h-10 hover:bg-slate-200 rounded-lg flex items-center justify-center shrink-0 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      <div>
        <div>
          <label className="text-sm mb-2.5 font-semibold text-slate-700 block">
            Follow-up type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <button
              onClick={() => setFollowUpType("Call")}
              className={`flex flex-col items-center justify-center gap-2 h-20 rounded-xl transition-all ${selectedtype === "Call" ? "text-white bg-indigo-600 shadow-sm shadow-indigo-100" : "text-slate-700 border border-slate-200 hover:bg-slate-50"}`}
            >
              <Phone size={20} />
              <p className="text-sm font-medium">phone</p>
            </button>
            <button
              onClick={() => setFollowUpType("Email")}
              className={`flex flex-col items-center justify-center gap-2 h-20 rounded-xl transition-all ${selectedtype === "Email" ? "text-white bg-indigo-600 shadow-sm shadow-indigo-100" : "text-slate-700 border border-slate-200 hover:bg-slate-50"}`}
            >
              <Mail size={20} />
              <p className="text-sm font-medium">Email</p>
            </button>
            <button
              onClick={() => setFollowUpType("Meeting")}
              className={`flex flex-col items-center justify-center gap-2 h-20 rounded-xl transition-all ${selectedtype === "Meeting" ? "text-white bg-indigo-600 shadow-sm shadow-indigo-100" : "text-slate-700 border border-slate-200 hover:bg-slate-50"}`}
            >
              <UsersRound size={20} />
              <p className="text-sm font-medium">Meeting</p>
            </button>
            <button
              onClick={() => setFollowUpType("WhatsApp")}
              className={`flex flex-col items-center justify-center gap-2 h-20 rounded-xl transition-all ${selectedtype === "WhatsApp" ? "text-white bg-indigo-600 shadow-sm shadow-indigo-100" : "text-slate-700 border border-slate-200 hover:bg-slate-50"}`}
            >
              <MessageSquareText size={20} />
              <p className="text-sm font-medium">WhatsApp</p>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
          <div className="w-full">
            <label className="text-sm mb-1.5 font-semibold text-slate-700 block">Date</label>
            <CustomCalendar
              value={form.followUpDate}
              onChange={handleChange}
              name="followUpDate"
              placeholder="Select date"
              className={`w-full outline-none text-sm px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                form.followUpDate ? "bg-indigo-50/50 border-indigo-200" : "bg-slate-50/50 hover:bg-slate-50 focus:bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />
          </div>
          <div className="w-full">
            <label className="text-sm mb-1.5 font-semibold text-slate-700 block">Time</label>
            <input
              value={form.followUpTime}
              onChange={handleChange}
              name="followUpTime"
              type="time"
              className={`w-full outline-none text-sm px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                form.followUpTime ? "bg-indigo-50/50 border-indigo-200" : "bg-slate-50/50 hover:bg-slate-50 focus:bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />
          </div>
        </div>
        <div className="w-full mt-5">
          <label className="text-sm mb-1.5 font-semibold text-slate-700 block">
            Next FollowUp Date 
          </label>
          <CustomCalendar
            value={form.nextFollowupDate}
            onChange={handleChange}
            name="nextFollowupDate"
            className={`w-full outline-none text-sm px-4 py-2.5 rounded-xl border transition-all duration-200 ${
              form.nextFollowupDate ? "bg-indigo-50/50 border-indigo-200" : "bg-slate-50/50 hover:bg-slate-50 focus:bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            }`}
          />
        </div>
        <div className="mt-5">
          <label className="text-sm mb-1.5 font-semibold text-slate-700 block">Remarks</label>
          <textarea
            name="notes"
            value={form.notes}
            rows={2}
            style={{
              minHeight: "24px",
              maxHeight: "192px", // 8 lines × 24px
            }}
            onChange={(e) => {
              handleChange(e);

              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(
                e.target.scrollHeight,
                192
              )}px`;
            }}
            placeholder="Add important followup remarks..."
            className={`w-full outline-none text-sm px-4 py-2.5 rounded-xl border transition-all duration-200 resize-none overflow-y-auto ${
              form.notes ? "bg-indigo-50/50 border-indigo-200" : "bg-slate-50/50 hover:bg-slate-50 focus:bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            }`}
          />
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmit}
          className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-xl shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md active:scale-[0.98] cursor-pointer"
        >
          Schedule Follow Up
        </button>
      </div>
    </div>
  );
};

export default AddFollowUps;
