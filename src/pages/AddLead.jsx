import React from "react";
import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  CirclePlus,
  NotebookPen,
  CalendarFold,
} from "lucide-react";
import CustomDropDown from "../componenets/CustomDropDown";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

const AddLead = ({ setAddLeadModal, addLeadModal }) => {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    status: "",
    notes: "",
    followUpDate: "",
  });
  const handleChange = (e) => {
    // console.log(e.target.value);
    // console.log(e)
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      
      console.log(form, "form");
      const res = await axios.post(`${BASE_URL}/leads/create-lead`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      console.log(res, "res");

      alert("lead added successfully ");
      setForm({
        name: "",
        phone: "",
        email: "",
        status: "New",
        notes: "",
        followUpDate: "",
      });
      setAddLeadModal(false)

    } catch (err) {
      alert("Error: " + err.response?.data?.message);
      console.log(err.response?.data);
    }
  };

  useEffect(() => {
    if (addLeadModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addLeadModal]);

  return (
    <div className="lg:w-1/2  w-[90%]  m-auto  ">
      <div className="lg:p-10 md:p-8 p-5 bg-white rounded">
        <div className="flex justify-between border-b border-gray-300 md:pb-8 lg:pb-4 pb-2">
          <div>
            <h2 className="font-bold  text-2xl mb-1  ">Created New Lead</h2>
            <p>Add a new lead to your pipeline </p>
          </div>

          <button
            onClick={() => setAddLeadModal(false)}
            className="bg-indigo-600 text-white md:w-12 md:h-12 lg:w-10 lg:h-10 w-7 h-7  hover:bg-indigo-700  rounded-full"
          >
            X
          </button>
        </div>

        <div className="lg:flex gap-5 lg:w-full justify-between">
          <div className="lg:my-5 md:my-3 md:text-lg my-2 w-full">
            <p className="text-sm md:mb-2 mb-1 font-medium"> Full Name </p>
            <div className="flex  border border-gray-300 gap-2 p-2 rounded-md">
              <User size={17} />
              <input
                className=" outline-none  w-full rounded  text-sm"
                name="name"
                placeholder="Enter Full Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="lg:my-5 md:text-lg my-3 w-full">
            <p className="text-sm mb-1 font-medium">Email : </p>
            <div className="flex border border-gray-300 gap-2 p-2  rounded-md">
              <Mail size={17} />
              <input
                className=" outline-none  w-full text-sm"
                name="email"
                placeholder="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="lg:my-5 md:text-lg my-3">
          <p className="text-sm mb-1 font-medium">Mobile Number : </p>
          <div className="flex  border border-gray-300 gap-2 pt-2 px-2 rounded-md">
            <div className="border-r border-gray-300  flex gap-2 ">
              <Phone size={17} />
              <select className="outline-none bg-transparent text-sm mb-3  ">
                <option>+91</option>
                <option>+1</option>
                <option>+44</option>
              </select>
            </div>
            <input
              className=" outline-none w-full rounded  mb-4 text-sm"
              name="phone"
              placeholder="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="lg:my-5 md:text-lg   my-3">
          <p className="text-sm mb-1 font-medium">Status : </p>
          <div className="flex border border-gray-300 gap-2 p-2 rounded-md">
            <CirclePlus size={17} className="mt-2" />

            <CustomDropDown
              value={form.status}
              onChange={(value) => setForm({ ...form, status: value })}
              options={[
                "New",
                "Contacted",
                "Interested",
                "Closed Won",
                "Closed Lost",
              ]}
            />
          </div>
        </div>

        <div className="lg:my-5 md:text-lg my-3">
          <p className="text-sm mb-1 font-medium">notes:</p>
          <div className="flex border border-gray-300 gap-2 p-2  rounded-md">
            <NotebookPen size={17} />
            <textarea
              placeholder="add a note (optional)"
              className="outline-none text-sm w-full  "
              name="notes"
              value={form.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="lg:my-5 my-3  md:text-lg ">
          <p className="text-sm mb-1 font-medium">Follow up date :</p>
          <div className="flex border border-gray-300 gap-2 p-2 rounded-md">
            <input
              className="outline-none px-2 w-full  "
              name="followUpDate"
              type="date"
              value={form.followUpDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          className="text-white py-1 px-2  border-2 border-gray-300 md:py-2 bg-indigo-700 md:px-3 lg:py-1 lg:px-2 cursor-pointer  rounded  hover:bg-indigo-800 hover:font-medium hover:text-white  "
          onClick={handleSubmit}
        >
          Save Lead
        </button>
      </div>
    </div>
  );
};

export default AddLead;
