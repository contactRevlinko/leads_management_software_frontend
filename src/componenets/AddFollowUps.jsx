import React, { useEffect, useState } from "react";
import { Phone, Mail, UsersRound, MessageSquareText } from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;

const AddFollowUps = ({ lead, setShowFollowUps }) => {
  const [selectedtype, setSelectedType] = useState("");
  const [form, setForm] = useState({
    leadId: "",
    followUpDate: "",
    followUpTime: "",
    followUpType: "",
    notes: "",
    nextFollowupDate: "",
  });


  const handleChange = (e) => {
    console.log(e.target.value)
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
      const token = localStorage.getItem("token")
      const finalData = { ...form, leadId: lead._id };
      const res = await fetch(`${BASE_URL}/followups/creat-followups`, {
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
        alert("Lead added successfully");
      }

      setForm({
        leadId: lead.id || "",
        followUpDate: "",
        followUpTime: "",
        followUpType: "Call",
        notes: "",
        nextFollowupDate: "",
      });

      setSelectedType("");
     
    } catch (err) {
      console.log(err);
      alert("Error adding follow up");
    }
  };

  return (
    <div className="lg:w-1/2 w-[95%] md:m-auto  bg-white border-2 rounded-4xl  border-gray-200 ">
      <div className="flex  justify-between m-5">
        <div className="p-1 md:p-4">
          <h1 className="font-medium text-lg md:text-2xl">Schedule Follow Up</h1>
          <p className="text-sm text-gray-700 font-medium">
            Lead : {lead.name}
          </p>
        </div>
        <button
          onClick={() => setShowFollowUps(false)}
          className="bg-indigo-600 text-white md:text-sm text-xs md:w-10 md:h-10 w-7 h-7 hover:bg-indigo-700  rounded-full"
        >
          X
        </button>
      </div>
      <div className="bg-indigo-50 pb-5 px-5">
        <div className="pt-4">
          <p className="text-sm text-gray-700 font-medium  mb-4">
            Follow-up type
          </p>
          <div className="flex gap-2 md:gap-4  text-center">
            <button
              onClick={() => setFollowUpType("Call")}
              className={`${selectedtype === "Call" ? " text-indigo-700 border-2 border-indigo-700" : "text-gray-700 border border-gray-300 "}text-center w-24 p-2 rounded text-gray-700 hover:text-indigo-700 border border-gray-300 hover:border-2 hover:border-indigo-700 `}
            >
              <Phone size={20} className="md:ml-6 ml-4" />
              <p className="text-sm">phone</p>
            </button>
            <button
              onClick={() => setFollowUpType("Email")}
              className={`${selectedtype === "Email" ? " text-indigo-700 border-2 border-indigo-700" : "text-gray-700 border border-gray-300 "}text-center w-24 p-2 rounded text-gray-700 hover:text-indigo-700 border border-gray-300 hover:border-2 hover:border-indigo-700 `}
            >
              <Mail size={20} className="md:ml-6 ml-4" />
              <p className="text-sm">Email</p>
            </button>
            <button
              onClick={() => setFollowUpType("Meeting")}
              className={`${selectedtype === "Meeting" ? " text-indigo-700 border-2 border-indigo-700" : "text-gray-700 border border-gray-300 "}text-center w-24 p-2 rounded text-gray-700 hover:text-indigo-700 border border-gray-300 hover:border-2 hover:border-indigo-700 `}
            >
              <UsersRound size={20} className="md:ml-6 ml-4" />
              <p className="text-sm">Meeting</p>
            </button>
            <button
              onClick={() => setFollowUpType("WhatsApp")}
              className={`${selectedtype === "WhatsApp" ? " text-indigo-700 border-2 border-indigo-700" : "text-gray-700 border border-gray-300 "}text-center md:w-24 md:p-2 w-20 p-1 rounded text-gray-700 hover:text-indigo-700 border border-gray-300 hover:border-2 hover:border-indigo-700 `}
            >
              <MessageSquareText size={20} className="md:ml-6 ml-4" />
              <p className="text-sm">WhatsApp</p>
            </button>
          </div>
        </div>
        <div className="flex gap-2 md:my-5 my-0 ">
          <div className="w-full">
            <p className=" my-2  text-sm text-gray-700 font-medium  ">Date :</p>
            <input
              value={form.followUpDate}
              onChange={handleChange}
              name="followUpDate"
              type="date"
              className="bg-white text-gray-700 p-2 rounded border md:text-sm text-xs border-gray-300 w-full "
            />
          </div>
          <div className="w-full">
            <p className="text-sm text-gray-700 font-medium my-2">time :</p>
            <input
              value={form.followUpTime}
              onChange={handleChange}
              name="followUpTime"
              type="time"
              className="bg-white text-gray-700 p-2  md:text-sm text-xs rounded border border-gray-300 w-full "
            />
          </div>
        </div>
        <div className="w-full">
          <p className=" my-2  text-sm text-gray-700 font-medium  ">
            next FollowUp Date :
          </p>
          <input
            value={form.nextFollowupDate}
            onChange={handleChange}

            name="nextFollowupDate"
            type="date"
            className="bg-white text-gray-700 p-2  md:text-sm text-xs rounded border border-gray-300 w-full "
          />  {console.log(form.nextFollowUpDate)}
        </div>
        <div>
          <p className="text-sm text-gray-700 font-medium my-2">remarks : </p>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Add important followup remarks..."
            className="outline-none  w-full border border-gray-300 p-2 md:text-sm text-xs rounded  "
            name="notes"
          />
        </div>
      </div>
      <div className="py-4 px-8  m-4 flex  justify-evenly  border-t-0 border-gray-200 ">

        <button
          onClick={handleSubmit}
          className="bg-white text-black border-2 border-gray-300 w-1/2 text-sm   py-1 px-2 cursor-pointer  rounded  hover:bg-indigo-700  hover:text-white  "
        >
          Schedule
        </button>
      </div>
    </div>
  );
};

export default AddFollowUps;
