import React, { useEffect, useState } from "react";
import AddFollowUps from "../componenets/AddFollowUps";
import CustomPopupDelete from "../componenets/CustomPopupDelete";
import { Bell, ChevronsUpDown, Info, Plus, Trash2, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLead } from "../redux/allLeadSlice";
import FollowupsList from "../componenets/FollowupsList";
import CustomDropDown from "../componenets/CustomDropDown";

const BASE_URL = import.meta.env.VITE_API_URL;



const Reminders = () => {
  const dispatch = useDispatch();
  const { allLeads } = useSelector((state) => state.lead);

  const [data, setData] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [notePopup, setNotePopup] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  const fetchTodaysFo = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/followups/today`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      setData(result.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTodaysFo();
    dispatch(fetchAllLead());
  }, [dispatch]);

  const getTeamMemberName = (follow) => {
    const followLeadId = follow.leadId?._id || follow.leadId;

    const matchedLead = allLeads.find(
      (lead) => String(lead._id) === String(followLeadId)
    );

    if (!matchedLead?.assignedTo) {
      return "No Team Member";
    }

    if (typeof matchedLead.assignedTo === "string") {
      return matchedLead.assignedTo;
    }

    return matchedLead.assignedTo.name || "No Team Member";
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      setShowFollowUps(false);

      const res = await fetch(`${BASE_URL}/followups/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setData((prev) => prev.filter((item) => item._id !== id));
        setDeletePopup(false);
        setSelectedId(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openFollowup = (lead) => {
    if (!lead) {
      alert("Lead not found for this followup");
      return;
    }

    setSelectedLead(lead);
    setShowFollowUps(true);
  };

  const formatTime = (time) => {
    if (!time) return "No Time";

    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const sortedFollowups = [...data].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.followupNo - b.followupNo;
    }

    return b.followupNo - a.followupNo;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/leads/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();

      if (res.ok) {

        dispatch(fetchAllLead());
        fetchTodaysFo();
      } else {
        toast.error(result.message || "Status update failed");
      }
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="md:text-5xl text-3xl font-medium text-slate-900">
          Today's Reminder
        </h1>

        <p className="text-gray-500 mt-2">
          Stay organized with upcoming tasks and follow-up reminders.
        </p>
      </div>

      {/* mobile */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 lg:hidden p-5">
        {data.length === 0 ? (
          <div className="lg:hidden sm:block col-span-full bg-white rounded-3xl border border-slate-200/80 p-10 text-center shadow-sm">
            <Users className="mx-auto mb-3 w-12 h-12 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700">
              No reminder Found
            </h3>
            <p className="text-gray-500 mt-2">
              You don't have any reminders scheduled today.
            </p>
          </div>
        ) : (
          data.map((follow) => (
            <div
              key={follow._id}
              className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 hover:shadow-md transition-all duration-300"
            >
              <div className="mb-4">
                <h1 className="text-lg font-bold text-gray-900 capitalize">
                  {follow.leadId?.name}
                </h1>
                <p className="text-xs font-semibold text-gray-400 mt-1">
                  Lead Details
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <p className="text-gray-500">Team Member</p>
                  <p className="text-gray-800 font-medium">
                    {getTeamMemberName(follow)}
                  </p>
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <p className="text-gray-500">Follow Up Type</p>
                  <p className="text-gray-800 font-medium">
                    {follow.followUpType}
                  </p>
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <p className="text-gray-500">Follow Up Date</p>
                  <p className="text-gray-800 font-medium">
                    {follow.followUpDate
                      ? follow.followUpDate.split("T")[0]
                      : "No Date"}
                  </p>
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <p className="text-gray-500">Follow Up Time</p>
                  <p className="text-gray-800 font-medium">
                    {formatTime(follow.followUpTime)}
                  </p>
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <p className="text-gray-500">Next Follow Up Date</p>
                  <p className="text-gray-800 font-medium">
                    {follow.nextFollowupDate
                      ? follow.nextFollowupDate.split("T")[0]
                      : "No Date"}
                  </p>
                </div>
              </div>

              <div className="w-full mt-4"> <CustomDropDown
                value={follow.leadId.status}
                onChange={(selectedStatus) =>
                  handleStatusChange(follow.leadId._id, selectedStatus)
                }
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
              /></div>
               {follow.notes && (
                                <button
                                  onClick={() => {
                                    setSelectedNote(follow.notes);
                                    setNotePopup(true);
                                  }}
                                  className="mt-4 w-1/2 flex justify-center items-center gap-2 h-10 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200"
                                >
                                  <Info  size={17} />
                                  View Note
                                </button>
                              )} 

              <div className="flex w-full mt-4 gap-4">
                <button
                  onClick={() => {
                    setSelectedId(follow._id);
                    setDeletePopup(true);
                  }}
                  className="w-1/2 outline-none py-2 rounded-lg text-sm font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 active:scale-[0.98] transition"
                >
                  Delete
                </button>

                <button
                  onClick={() => openFollowup(follow.leadId)}
                  className="w-1/2 rounded-lg text-sm font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 active:scale-[0.98] transition whitespace-nowrap"
                >
                  + followups
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-indigo-50/60 border-b border-slate-200/80">
            <tr className="text-left text-gray-500 text-sm">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="flex items-center gap-2"
                >
                  SR NO
                  <ChevronsUpDown size={16} />
                </button>
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">NAME</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">TEAM MEMBER</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">FOLLOW UP TYPE</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">FOLLOWUP DATE</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">FOLLOW UP TIME</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                NEXT FOLLOW UP DATE
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                STATUS
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                NOTES
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {sortedFollowups.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-16 text-gray-500">
                  <Bell className="mx-auto mb-3 w-12 h-12 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-700">
                    No reminder Found
                  </h3>
                  <p className="mt-2">
                    You don't have any reminders scheduled today.
                  </p>
                </td>
              </tr>
            ) : (
              sortedFollowups.map((followUp, i) => (
                <tr
                  key={followUp._id}
                  className="border-b border-slate-100 text-left hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium" >{followUp.followupNo}</td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {followUp.leadId?.name || "No Name"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {getTeamMemberName(followUp)}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{followUp.followUpType}</td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {followUp.followUpDate
                      ? followUp.followUpDate.split("T")[0]
                      : "No Date"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {formatTime(followUp.followUpTime)}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {followUp.nextFollowupDate
                      ? followUp.nextFollowupDate.split("T")[0]
                      : "No Date"}
                  </td>
                  <td className="px-6 py-3">
                    <CustomDropDown
                      value={followUp.leadId.status}
                      onChange={(selectedStatus) =>
                        handleStatusChange(followUp.leadId._id, selectedStatus)
                      }
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
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {followUp.notes ? (
                      <button
                        onClick={() => {
                          setSelectedNote(followUp.notes);
                          setNotePopup(true);
                        }}
                        className="text-indigo-600 bg-indigo-50 border border-indigo-200 p-2 rounded-lg hover:bg-indigo-100"
                      >
                        <Info size={18} />
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
   
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    <div className="flex gap-5 items-center">
                      <button
                        onClick={() => {
                          setSelectedId(followUp._id);
                          setDeletePopup(true);
                        }}
                        className="text-red-600 bg-red-50 flex w-full text-sm justify-center items-center px-4 py-1 gap-3 border border-red-200 hover:ring-2 hover:ring-offset-2 hover:ring-red-300 rounded-lg"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>

                      <button
                        onClick={() => openFollowup(followUp.leadId)}
                        className="flex justify-center items-center text-sm gap-3 p-1 bg-white text-indigo-700 px-2 rounded-lg whitespace-nowrap hover:bg-indigo-50 hover:ring-2 border border-indigo-200 hover:ring-indigo-300 hover:ring-offset-2"
                      >
                        <Plus size={15} />
                        FollowUps
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deletePopup && (
        <CustomPopupDelete
          onClose={() => setDeletePopup(false)}
          onDelete={() => handleDelete(selectedId)}
        />
      )}

      {showFollowUps && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <AddFollowUps
            lead={selectedLead}
            setShowFollowUps={setShowFollowUps}
          />
        </div>
      )}
      {notePopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Followup Note
            </h2>

            <p className="text-gray-600 text-sm leading-6 whitespace-pre-wrap">
              {selectedNote}
            </p>

            <button
              onClick={() => {
                setNotePopup(false);
                setSelectedNote("");
              }}
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="mt-16">
        <FollowupsList />
      </div>
    </div>

  );
};

export default Reminders;