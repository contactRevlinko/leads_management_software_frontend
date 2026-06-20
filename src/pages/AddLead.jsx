import React, { useState, useEffect } from "react";
import { User, Phone, Mail, NotebookPen, X } from "lucide-react";
import CustomDropDown from "../componenets/CustomDropDown";
import axios from "axios";
import { fetchAllLead } from "../redux/allLeadSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamList } from "../redux/teamSlice";
import toast from "react-hot-toast";
import CustomCalendar from "../componenets/CustomCalender"
import { validateEmail } from "../utils/validation";

const BASE_URL = import.meta.env.VITE_API_URL;

const AddLead = ({ setAddLeadModal, addLeadModal, fetchStatusCount }) => {

  const loginType = localStorage.getItem("loginType");
  const teamMember = JSON.parse(localStorage.getItem("teamMember"));
  const isTeamLogin = loginType === "team";

  const dispatch = useDispatch();
  const { teamList } = useSelector((state) => state.team);
  const [sources, setSources] = useState();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    status: "New",
    source: "Whatsapp",
    assignedTo: isTeamLogin ? teamMember?._id : "",
    notes: "",
    followUpDate: "",
  });

  useEffect(() => {
    dispatch(fetchTeamList());
  }, [dispatch]);

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

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const token = localStorage.getItem("token");

      await axios.post(`${BASE_URL}/leads/create-lead`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Lead added successfully");

      setForm({
        name: "",
        phone: "",
        email: "",
        status: "New",
        source: "Whatsapp",
        assignedTo: isTeamLogin ? teamMember?._id : "",
        notes: "",
        followUpDate: "",
      });

      dispatch(fetchAllLead());

      if (fetchStatusCount) {
        fetchStatusCount();
      }

      setAddLeadModal(false);
    } catch (err) {
      toast.error("Error: " + (err.response?.data?.message || err.message));
      console.log(err.response?.data);
    }
  };

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BASE_URL}/source/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSources(res.data.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load sources");
      }
    };

    fetchSources();
    dispatch(fetchTeamList());
  }, [dispatch]);


  return (
    <div className="lg:w-1/2 w-[90%] m-auto">
      <div className="lg:p-10 md:p-8 p-5 bg-white rounded">
        <div className="flex justify-between border-b border-gray-300 md:pb-8 lg:pb-4 pb-2">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-2">
              Create New Lead
            </h1>
            <p className="text-gray-600">
              Add a high value prospect to your sales pipeline
            </p>
          </div>

          <button
            onClick={() => setAddLeadModal(false)}
            className="bg-indigo-100 text-indigo-700 font-medium md:w-12 md:h-12 lg:w-10 lg:h-10 w-7 h-7 hover:bg-indigo-200 rounded-lg flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <div className="lg:flex gap-5 lg:w-full justify-between text-gray-600">


          <div className="lg:my-5 md:my-3 md:text-lg my-2 w-full">
            <p className="text-sm  mb-1 font-medium">Full Name</p>
            <div
              className={`${form.name ? "bg-indigo-50" : "bg-white"
                } flex border border-gray-300 gap-2 p-2 rounded-xl`}
            >
              <User size={17} />
              <input
                className="outline-none w-full text-sm bg-transparent"
                placeholder="Full name"
                name="name"
                value={form.name}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="lg:my-5  md:my-3 md:text-lg my-2 w-full ">
            <p className="text-sm mb-1 font-medium">Email Address</p>
            <div
              className={`${form.email ? "bg-indigo-50" : "bg-white"
                } flex border border-gray-300 gap-2 p-2 rounded-xl`}
            >
              <Mail size={17} />
              <input
                className="outline-none w-full text-sm bg-transparent"
                type="text"
                name="email"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>

        </div>

        <div className=" md:text-lg my-3 w-full text-gray-600">
          <p className="text-sm mb-1 font-medium">Mobile Number</p>

          <div
            className={`${form.phone ? "bg-indigo-50" : "bg-white"
              } flex border border-gray-300 gap-2 p-2 rounded-xl`}
          >
            <Phone size={17} />

            <input
              className="outline-none w-full text-sm bg-transparent"
              type="text"
              name="phone"
              placeholder="Mobile number"
              value={form.phone}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");


                if (value.startsWith("91") && value.length > 10) {
                  toast.error("Please enter 10 digit number without +91");
                  value = value.substring(2);
                }

                if (value.length > 10) {
                  toast.error("Only 10 digits allowed ");
                }

                setForm((prev) => ({
                  ...prev,
                  phone: value.slice(0, 10),
                }));
              }}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        <p className="text-indigo-500 m-2 text-[0.8rem] font-medium">
          LEAD DETAILS
        </p>

        <div className="grid  gap-4 grid-cols-3 ">
          <div >
            <p className="text-sm mb-1 font-medium">Status : </p>
            <CustomDropDown
              value={form.status}
              onChange={(value) => setForm({ ...form, status: value })}
              options={[
                "New",
                "Hot",
                "Warm",
                "Cold",
                "Contacted",
                "Interested",
                "Closed Won",
                "Closed Lost",
              ]}
            />
          </div>
          {!isTeamLogin && (
            <div className="text-gray-600">
              <p className="text-sm mb-1 font-medium">Assigned To</p>
              <CustomDropDown
                value={teamList.find((team) => team._id === form.assignedTo)?.name || ""}
                onChange={(id) =>
                  setForm((prev) => ({ ...prev, assignedTo: id }))
                }
                options={teamList.map((teamMem) => ({
                  label: teamMem.name,
                  value: teamMem._id,
                }))}
              />
            </div>
          )}

          <div className="text-gray-600">
            <p className="text-sm mb-1 font-medium">Source</p>
            <CustomDropDown
              value={form.source}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, source: value }))
              }
              options={sources?.map((s) => s.name) || []}
            />
          </div>
        </div>

        <div className="lg:my-5 md:text-lg my-3 text-gray-600">
          <p className="text-sm mb-1 font-medium">Notes</p>
          <div
            className={`${form.notes ? "bg-indigo-50" : "bg-white"
              } flex border border-gray-300 gap-2 p-2 rounded-xl`}
          >
            <NotebookPen size={17} />
            <textarea
              placeholder="Add a private note regarding this lead"
              className="outline-none text-sm w-full bg-transparent resize-none overflow-y-auto"
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
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="text-gray-600 w-full md:w-1/2">
            <p className="text-sm mb-1 font-medium">Follow Up Date</p>

            <CustomCalendar
              name="followUpDate"
              value={form.followUpDate}
              onChange={handleChange}
              placeholder="Select follow up date"
            />
          </div>

          <button
            className="w-full md:w-1/2 h-10 md:mt-5  text-white bg-indigo-700 rounded cursor-pointer hover:bg-indigo-800"
            onClick={handleSubmit}
          >
            Save Lead
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLead;