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
    <div className="lg:w-[35%] w-[95%] md:m-auto px-2 bg-white border-2 rounded-lg  border-gray-200  ">
      <div className="flex  justify-between m-5">
        <div className="p-1 md:p-4">
          <h1 className="text-xl sm:text-2xl lg:text-xl font-bold text-gray-900 mb-2">
            Schedule Follow Up
          </h1>
          <p className="text-sm text-indigo-600 font-medium">
            Lead : {lead?.name}
          </p>
        </div>
        <button
          onClick={() => setShowFollowUps(false)}
          className="bg-indigo-100 text-indigo-700 font-medium md:w-12 md:h-12 lg:w-10 lg:h-10 w-7 h-7 hover:bg-indigo-200 rounded-lg flex items-center justify-center"
        >
          <X size={18} />
        </button>
      </div>
      <div className=" px-5">
        <div className="-mt-5">
          <p className="text-sm text-gray-700 font-medium  mb-4">
            Follow-up type
          </p>
          <div className="grid grid-cols-4 gap-5  text-center">
            <button
              onClick={() => setFollowUpType("Call")}
              className={`flex flex-col items-center justify-center gap-2 h-20  ${selectedtype === "Call" ? " text-white bg-indigo-600  " : "text-gray-700 border border-gray-300 "}text-center   rounded text-gray-700  `}
            >
              <Phone size={20} className="md:ml-6 ml-4 lg:mr-6 " />
              <p className="text-sm">phone</p>
            </button>
            <button
              onClick={() => setFollowUpType("Email")}
              className={` flex flex-col items-center justify-center gap-2 h-20 ${selectedtype === "Email" ? " bg-indigo-600 text-white  " : "text-gray-700 border border-gray-300 "}text-center  rounded text-gray-700  `}
            >
              <Mail size={20} className="md:ml-6 ml-4 lg:mr-6" />
              <p className="text-sm">Email</p>
            </button>
            <button
              onClick={() => setFollowUpType("Meeting")}
              className={` flex flex-col items-center justify-center gap-2 h-20 ${selectedtype === "Meeting" ? "text-white bg-indigo-600 " : "text-gray-700 border border-gray-300 "}text-center  rounded text-gray-700 `}
            >
              <UsersRound size={20} className="md:ml-6 ml-4 lg:mr-6" />
              <p className="text-sm">Meeting</p>
            </button>
            <button
              onClick={() => setFollowUpType("WhatsApp")}
              className={` flex flex-col items-center justify-center gap-2 h-20  ${selectedtype === "WhatsApp" ? "text-white bg-indigo-600 " : "text-gray-700 border border-gray-300 "}text-center rounded text-gray-700 `}
            >
              <MessageSquareText size={20} className="md:ml-6 ml-4 lg:mr-6" />
              <p className="text-sm">WhatsApp</p>
            </button>
          </div>
        </div>
        <div className="flex gap-2 md:my-5 my-0 ">
          <div className="w-full">
            <p className=" my-2 text-sm text-gray-700 font-medium  ">Date </p>
            <CustomCalendar
              value={form.followUpDate}
              onChange={handleChange}
              name="followUpDate"
              placeholder="Select date"
              className={`${form.followUpDate ? "bg-indigo-50" : "bg-white"
                } text-gray-700 px-2 py-3 md:text-sm text-xs rounded-xl border border-gray-300 w-full`}
            />
          </div>
          <div className="w-full">
            <p className="text-sm text-gray-700 font-medium my-2">Time </p>
            <input
              value={form.followUpTime}
              onChange={handleChange}
              name="followUpTime"
              type="time"
              className={`${form.followUpTime ? "bg-indigo-50 " : "bg-white "} text-gray-700 px-2 py-3 md:text-sm text-xs rounded-xl border border-gray-300 w-full `}
            />
          </div>
        </div>
        <div className="w-full">
          <p className=" my-2  text-sm text-gray-700 font-medium  ">
            Next FollowUp Date 
          </p>
          <CustomCalendar
            value={form.nextFollowupDate}
            onChange={handleChange}
            name="nextFollowupDate"
            className={` ${form.nextFollowupDate ? "bg-indigo-50 " : "bg-white"}  outline-none  text-gray-700 px-2 py-3 md:text-sm text-xs rounded-xl border border-gray-300 w-full `}
          />{" "}
          {console.log(form.nextFollowupDate, "next follow up date")}
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-700 font-medium my-2 ">Remarks  </p>
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
            className={` ${form.notes ? "bg-indigo-50" : "bg-white"} outline-none  w-full border border-gray-300 px-2 py-3 md:text-sm text-xs rounded-xl `}
            name="notes"
          />
        </div>
      </div>
      <div className="py-4 px-8 mb-5 flex  justify-evenly  border-t-0 border-gray-200 ">
        <button
          onClick={handleSubmit}
          className="
    w-full
    py-3 px-4
    bg-indigo-600
    text-white
    font-medium
    rounded
    shadow-md
    transition-all duration-200
    hover:bg-indigo-700
    hover:shadow-lg
    active:scale-[0.98]
    cursor-pointer
  "
        >
          Schedule
        </button>
      </div>
    </div>
  );
};

export default AddFollowUps;
