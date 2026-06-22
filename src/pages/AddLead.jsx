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
    <div className="lg:w-1/2 w-[95%] md:w-[80%] m-auto relative z-50">
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl p-6 md:p-8 lg:p-10">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Create New Lead
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Add a high value prospect to your sales pipeline
            </p>
          </div>

          <button
            onClick={() => setAddLeadModal(false)}
            className="bg-slate-100 text-slate-500 hover:text-slate-700 font-medium w-10 h-10 hover:bg-slate-200 rounded-lg flex items-center justify-center shrink-0 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          <div className="w-full">
            <label className="text-sm mb-1.5 font-semibold text-slate-700 block">Full Name</label>
            <div
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
                form.name ? "bg-indigo-50/50 border-indigo-200" : "bg-slate-50/50 hover:bg-slate-50 focus-within:bg-white border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10"
              }`}
            >
              <User size={18} className={form.name ? "text-indigo-500" : "text-slate-400"} />
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

          <div className="w-full">
            <label className="text-sm mb-1.5 font-semibold text-slate-700 block">Email Address</label>
            <div
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
                form.email ? "bg-indigo-50/50 border-indigo-200" : "bg-slate-50/50 hover:bg-slate-50 focus-within:bg-white border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10"
              }`}
            >
              <Mail size={18} className={form.email ? "text-indigo-500" : "text-slate-400"} />
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

          <div className="w-full md:col-span-2">
            <label className="text-sm mb-1.5 font-semibold text-slate-700 block">Mobile Number</label>
            <div
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
                form.phone ? "bg-indigo-50/50 border-indigo-200" : "bg-slate-50/50 hover:bg-slate-50 focus-within:bg-white border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10"
              }`}
            >
              <Phone size={18} className={form.phone ? "text-indigo-500" : "text-slate-400"} />
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
        </div>

        <div className="mt-8 mb-4 border-t border-slate-200/60 pt-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Lead Details
          </h2>

          <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
            <div>
              <label className="text-sm mb-1.5 font-semibold text-slate-700 block">Status</label>
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
              <div>
                <label className="text-sm mb-1.5 font-semibold text-slate-700 block">Assigned To</label>
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

            <div>
              <label className="text-sm mb-1.5 font-semibold text-slate-700 block">Source</label>
              <CustomDropDown
                value={form.source}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, source: value }))
                }
                options={sources?.map((s) => s.name) || []}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 w-full">
          <label className="text-sm mb-1.5 font-semibold text-slate-700 block">Notes</label>
          <div
            className={`flex gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
              form.notes ? "bg-indigo-50/50 border-indigo-200" : "bg-slate-50/50 hover:bg-slate-50 focus-within:bg-white border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10"
            }`}
          >
            <NotebookPen size={18} className={`mt-0.5 ${form.notes ? "text-indigo-500" : "text-slate-400"}`} />
            <textarea
              placeholder="Add a private note regarding this lead"
              className="outline-none text-sm w-full bg-transparent resize-none overflow-y-auto"
              name="notes"
              value={form.notes}
              rows={2}
              style={{
                minHeight: "24px",
                maxHeight: "192px",
              }}
              onChange={(e) => {
                handleChange(e);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 192)}px`;
              }}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-5 mt-8">
          <div className="w-full md:w-1/2">
            <label className="text-sm mb-1.5 font-semibold text-slate-700 block">Follow Up Date</label>
            <CustomCalendar
              name="followUpDate"
              value={form.followUpDate}
              onChange={handleChange}
              placeholder="Select follow up date"
            />
          </div>

          <button
            className="w-full md:w-1/2 py-3 px-4 bg-indigo-600 text-white font-medium rounded-xl shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
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