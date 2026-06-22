import React, { useEffect, useMemo, useState } from "react";
import { Bell, Trash2, Users, Eye, Calendar, Calendar1, ChevronsUpDown, FileText, X, CalendarPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import CustomPopupDelete from "./CustomPopupDelete";
import {
  useGetFollowupQuery,
  useDeleteFollowupsMutation,
} from "../redux/followupApi";

import { fetchAllLead } from "../redux/allLeadSlice";
import toast from "react-hot-toast";
import CustomCalendar from "./CustomCalender";
import CustomDropDown from "./CustomDropDown";
const BASE_URL = import.meta.env.VITE_API_URL;
const FollowupsList = () => {
  const dispatch = useDispatch();

  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [notePopup, setNotePopup] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { allLeads } = useSelector((state) => state.lead);
  const { data, refetch } = useGetFollowupQuery();
  const [deleteFollowups] = useDeleteFollowupsMutation();

  const followups = data?.data || [];
  const todayDate = new Date().toISOString().split("T")[0];
  const [sortOrder, setSortOrder] = useState("asc");


  const filteredFollowups = useMemo(() => {
    return followups.filter((follow) => {
      if (!follow.followUpDate) return false;

      const followDate = new Date(follow.followUpDate);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        if (followDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (followDate > end) return false;
      }

      return true;
    });
  }, [followups, startDate, endDate]);

  useEffect(() => {
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
      setDeletePopup(false);
      setSelectedId(null);

      await deleteFollowups(id).unwrap();

      await refetch();
      toast.success("Followup deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  const formatTime = (time) => {
    if (!time) return "No Time";

    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

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
        fetchStatusCount();
      } else {
        toast.error(result.message || "Status update failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    refetch();
  }, [allLeads, refetch]);
  console.log("follow up", data)

  const sortedFollowups = [...filteredFollowups].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.followupNo - b.followupNo;
    }

    return b.followupNo - a.followupNo;
  });

  return (
    <div className="w-full overflow-y-visible">
      <div className="mb-10">
        <h1 className="md:text-5xl text-3xl font-medium text-slate-900">
          Follow-Up Schedule
        </h1>

        <p className="md:py-3 text-sm md:text-xl py-2 text-gray-600">
          View upcoming and completed follow-up activities.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-end">
        <div className="w-full md:w-auto">
          <label className="block text-sm text-gray-500 mb-1">
            Start Date
          </label>

          <div className="relative">
            <CustomCalendar
              value={startDate}
              onChange={setStartDate}
              placeholder="Start Date"
              maxDate={new Date().toISOString().split("T")[0]}
            />

            <Calendar1
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 pointer-events-none"
            />
          </div>
        </div>


        <div className="w-full md:w-auto">
          <label className="block text-sm text-gray-500 mb-1">
            End Date
          </label>

          <div className="relative">
            <CustomCalendar
              value={endDate}
              onChange={setEndDate}
              placeholder="End Date"
              minDate={startDate}
              maxDate={new Date().toISOString().split("T")[0]}
            />

            <Calendar1
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 pointer-events-none"
            />
          </div>
        </div>
        

        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-200"
        >
          Clear
        </button>
      </div>

      {/* mobile */}
      {filteredFollowups.length === 0 ? (
        <div className="lg:hidden sm:block col-span-full bg-slate-50/50 rounded-2xl border border-slate-200/60 p-10 text-center">
          <Users className="mx-auto mb-3 w-12 h-12 text-slate-300" />
          <h3 className="text-base font-semibold text-slate-700">
            No reminder Found
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            No followups found in selected date range.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden pb-10">
          {filteredFollowups.map((follow) => (
            <div
              key={follow._id}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-4">
                <h1 className="text-base font-bold text-slate-800 capitalize">
                  {follow.leadId?.name || "No Name"}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Follow Up Details
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-[130px_1fr] items-center gap-3">
                  <p className="text-gray-500">Team Member</p>
                  <p className="text-gray-800 font-medium truncate">
                    {getTeamMemberName(follow)}
                  </p>
                </div>

                <div className="grid grid-cols-[130px_1fr] items-center gap-3">
                  <p className="text-gray-500">Follow Up Type</p>
                  <p className="text-gray-800 font-medium truncate">
                    {follow.followUpType}
                  </p>
                </div>

                <div className="grid grid-cols-[130px_1fr] items-center gap-3">
                  <p className="text-gray-500">Follow Up Date</p>
                  <p className="text-gray-800 font-medium">
                    {follow.followUpDate
                      ? follow.followUpDate.split("T")[0]
                      : "No Date"}
                  </p>
                </div>

                <div className="grid grid-cols-[130px_1fr] items-center gap-3">
                  <p className="text-gray-500">Follow Up Time</p>
                  <p className="text-gray-800 font-medium">
                    {formatTime(follow.followUpTime)}
                  </p>
                </div>

                <div className="grid grid-cols-[130px_1fr] items-center gap-3">
                  <p className="text-gray-500">Next Follow Up</p>
                  <p className="text-gray-800 font-medium">
                    {follow.nextFollowupDate
                      ? follow.nextFollowupDate.split("T")[0]
                      : "No Date"}
                  </p>
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* laptop */}
      <div className="lg:block hidden bg-white rounded-2xl border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-indigo-50/60 border-b border-slate-200/80">
            <tr className="text-left text-slate-500 text-sm">
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
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">STATUS</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">NOTE</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">ACTION</th>
            </tr>
          </thead>

          {filteredFollowups.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan="10" className="text-center py-16 text-gray-500">
                  <Bell className="mx-auto mb-3 w-12 h-12 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-700">
                    No reminder Found
                  </h3>
                  <p className="mt-2">
                    No followups found in selected date range.
                  </p>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {sortedFollowups.map((followUp, i) => (
                <tr
                  key={followUp._id}
                  className="border-b border-slate-100/80 text-left hover:bg-slate-50/50 transition-colors duration-100 group"
                >
                  <td className="px-4 py-3 text-xs text-slate-400 font-medium">{followUp.followupNo}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 font-medium capitalize">
                    {followUp.leadId?.name || "No Name"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {getTeamMemberName(followUp)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{followUp.followUpType}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 tabular-nums whitespace-nowrap">
                    {followUp.followUpDate
                      ? followUp.followUpDate.split("T")[0]
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 tabular-nums whitespace-nowrap">
                    {formatTime(followUp.followUpTime)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 tabular-nums whitespace-nowrap">
                    {followUp.nextFollowupDate
                      ? followUp.nextFollowupDate.split("T")[0]
                      : "—"}
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
                    <button
                      onClick={() => {
                        setSelectedId(followUp._id);
                        setDeletePopup(true);
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-red-500 bg-red-50 border border-red-200/60 hover:bg-red-100 hover:scale-105 transition-all duration-150 opacity-60 group-hover:opacity-100"
                      title="Delete"
                    >
                      <Trash2 size={13} strokeWidth={2.2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {deletePopup && (
        <CustomPopupDelete
          onClose={() => setDeletePopup(false)}
          onDelete={() => handleDelete(selectedId)}
        />
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
                  <h2 className="text-sm font-bold text-slate-800">Followup Note</h2>
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
    </div>
  );
};

export default FollowupsList;