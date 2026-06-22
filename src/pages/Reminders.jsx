import React, { useEffect, useState } from "react";
import AddFollowUps from "../componenets/AddFollowUps";
import CustomPopupDelete from "../componenets/CustomPopupDelete";
import { Bell, ChevronsUpDown, Info, Plus, Trash2, Users, Eye, FileText, X, CalendarPlus } from "lucide-react";
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
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 lg:hidden pb-10">
        {data.length === 0 ? (
          <div className="lg:hidden sm:block col-span-full bg-slate-50/50 rounded-2xl border border-slate-200/60 p-10 text-center">
            <Users className="mx-auto mb-3 w-12 h-12 text-slate-300" />
            <h3 className="text-base font-semibold text-slate-700">
              No reminder Found
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              You don't have any reminders scheduled today.
            </p>
          </div>
        ) : (
          data.map((follow) => (
            <div
              key={follow._id}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-4">
                <h1 className="text-base font-bold text-slate-800 capitalize">
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

              <div className="flex w-full mt-4 justify-between items-center">
                <div className="w-[140px]">
                  <CustomDropDown
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
                  />
                </div>

                <div className="flex gap-2">
                  {follow.notes && (
                    <button
                      onClick={() => {
                        setSelectedNote(follow.notes);
                        setNotePopup(true);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-amber-600 bg-amber-50 border border-amber-200/60 hover:bg-amber-100 transition-colors"
                      title="View Note"
                    >
                      <Eye size={14} strokeWidth={2.2} />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedId(follow._id);
                      setDeletePopup(true);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-red-500 bg-red-50 border border-red-200/60 hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} strokeWidth={2.2} />
                  </button>

                  <button
                    onClick={() => openFollowup(follow.leadId)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-indigo-600 bg-indigo-50 border border-indigo-200/60 hover:bg-indigo-100 transition-colors"
                    title="Add Follow Up"
                  >
                    <CalendarPlus size={14} strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-indigo-50/60 border-b border-slate-200/80">
            <tr className="text-left text-gray-500 text-sm">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="flex items-center gap-1.5"
                >
                  SR NO
                  <ChevronsUpDown size={12} />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">NAME</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">TEAM MEMBER</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">FOLLOW UP TYPE</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">FOLLOWUP DATE</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">FOLLOW UP TIME</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                NEXT FOLLOW UP
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                STATUS
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                NOTES
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">ACTIONS</th>
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
                  className="border-b border-slate-100/80 text-left hover:bg-slate-50/50 transition-colors duration-100 group"
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-slate-400">{followUp.followupNo}</span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-slate-800 capitalize">{followUp.leadId?.name || "No Name"}</span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600">{getTeamMemberName(followUp)}</span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600">{followUp.followUpType}</span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600 tabular-nums whitespace-nowrap">
                      {followUp.followUpDate
                        ? followUp.followUpDate.split("T")[0]
                        : "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600 tabular-nums whitespace-nowrap">
                      {formatTime(followUp.followUpTime)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600 tabular-nums whitespace-nowrap">
                      {followUp.nextFollowupDate
                        ? followUp.nextFollowupDate.split("T")[0]
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-[120px]">
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
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {followUp.notes ? (
                      <button
                        onClick={() => {
                          setSelectedNote(followUp.notes);
                          setNotePopup(true);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-amber-600 bg-amber-50 border border-amber-200/60 hover:bg-amber-100 hover:scale-105 transition-all duration-150"
                        title="View Note"
                      >
                        <Eye size={13} strokeWidth={2.2} />
                      </button>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
   
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedId(followUp._id);
                          setDeletePopup(true);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-red-500 bg-red-50 border border-red-200/60 hover:bg-red-100 hover:scale-105 transition-all duration-150"
                        title="Delete"
                      >
                        <Trash2 size={13} strokeWidth={2.2} />
                      </button>

                      <button
                        onClick={() => openFollowup(followUp.leadId)}
                        className="h-7 px-3 flex items-center gap-1.5 rounded-full text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200/60 hover:bg-indigo-100 hover:scale-[1.02] transition-all duration-150 whitespace-nowrap"
                        title="Add Follow Up"
                      >
                        <CalendarPlus size={12} strokeWidth={2.2} />
                        <span>Follow Up</span>
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
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center px-4"
          onClick={() => { setNotePopup(false); setSelectedNote(""); }}
        >
          <div
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-200/60">
                  <FileText size={14} className="text-amber-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Lead Note</h2>
                </div>
              </div>
              <button
                onClick={() => { setNotePopup(false); setSelectedNote(""); }}
                className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Note Content */}
            <div className="px-5 pb-5">
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                <p className="text-slate-600 text-[13px] leading-relaxed whitespace-pre-wrap">
                  {selectedNote}
                </p>
              </div>
            </div>
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