import React, { useState, useEffect } from "react";
import {
  ChevronsUpDown,
  Eye,
  Plus,
  Search,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
  CalendarPlus,
} from "lucide-react";
import AddFollowUps from "../componenets/AddFollowUps";
import CustomDropDown from "../componenets/CustomDropDown";
import CustomPopupDelete from "../componenets/CustomPopupDelete";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamList } from "../redux/teamSlice";
import { fetchAllLead } from "../redux/allLeadSlice";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

// Status badge color mapping
const statusColors = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Hot: "bg-red-50 text-red-600 border-red-200",
  Warm: "bg-amber-50 text-amber-700 border-amber-200",
  Cold: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Contacted: "bg-purple-50 text-purple-700 border-purple-200",
  Interested: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Closed Won": "bg-green-50 text-green-700 border-green-200",
  "Closed Lost": "bg-slate-100 text-slate-500 border-slate-200",
};

const statusDots = {
  New: "bg-blue-500",
  Hot: "bg-red-500",
  Warm: "bg-amber-500",
  Cold: "bg-cyan-500",
  Contacted: "bg-purple-500",
  Interested: "bg-emerald-500",
  "Closed Won": "bg-green-500",
  "Closed Lost": "bg-slate-400",
};

const AllLeads = ({ fetchStatusCount, setSearch, filtered = [] }) => {
  const loginType = localStorage.getItem("loginType");
  const isTeamLogin = loginType === "team";

  const dispatch = useDispatch();
  const { teamList } = useSelector((state) => state.team);

  const [showFollowUps, setShowFollowUps] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [notePopup, setNotePopup] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");
  const [sortOrderIndex, setSortOrderIndex] = useState("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchAllLead());
    dispatch(fetchTeamList());
  }, [dispatch]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filtered]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        await dispatch(fetchAllLead());
        fetchStatusCount();
        setDeletePopup(false);
        setSelectedId(null);
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openFollowup = (lead) => {
    setSelectedLead(lead);
    setShowFollowUps(true);
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

  const handleAssignedToChange = async (id, newAssignedTo) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/leads/${id}/assign-lead`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignedTo: newAssignedTo }),
      });
      if (res.ok) {
        dispatch(fetchAllLead());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const leadData = filtered || [];
  const sortedLeadData = [...leadData].sort((a, b) => {
    if (sortOrderIndex === "asc") return a.leadNo - b.leadNo;
    return b.leadNo - a.leadNo;
  });

  // Pagination calculations
  const totalItems = sortedLeadData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedLeadData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="mt-4">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full h-10 pl-9 pr-4 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-150"
            placeholder="Search by name, phone, or team..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-20 lg:hidden">
        {leadData.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200/60 p-10 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-700">No Leads Found</h3>
            <p className="text-slate-400 text-sm mt-1">Add your first lead to get started.</p>
          </div>
        ) : (
          paginatedData.map((lead) => (
            <div
              key={lead._id}
              className="bg-white rounded-xl border border-slate-200/60 p-4 hover:border-slate-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-sm font-semibold text-slate-800 capitalize">{lead.name}</h1>
                  <p className="text-xs text-slate-400 mt-0.5">{lead.email}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[lead.status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
                  {lead.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone</span>
                  <span className="text-slate-700 font-medium">{lead.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Source</span>
                  <span className="text-slate-700 font-medium">{lead.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Follow Up</span>
                  <span className="text-slate-700 font-medium">
                    {lead.followUpDate ? lead.followUpDate.split("T")[0] : "—"}
                  </span>
                </div>

                {!isTeamLogin && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-slate-400">Assigned To</span>
                    <div className="w-[140px]">
                      <CustomDropDown
                        value={lead.assignedTo?.name || lead.assignedTo || "Select"}
                        onChange={(sel) => handleAssignedToChange(lead._id, sel)}
                        options={teamList.map((t) => t.name)}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-2">
                  <span className="text-slate-400">Status</span>
                  <div className="w-[140px]">
                    <CustomDropDown
                      value={lead.status}
                      onChange={(sel) => handleStatusChange(lead._id, sel)}
                      options={["New", "Hot", "Warm", "Cold", "Contacted", "Interested", "Closed Won", "Closed Lost"]}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => { setSelectedId(lead._id); setDeletePopup(true); }}
                  className="h-8 rounded-lg text-xs font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 active:scale-[0.97] transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => openFollowup(lead)}
                  className="h-8 rounded-lg text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 active:scale-[0.97] transition"
                >
                  + Follow Up
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/60">
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => setSortOrderIndex(sortOrderIndex === "asc" ? "desc" : "asc")}
                    className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    #
                    <ChevronsUpDown size={12} />
                  </button>
                </th>
                {[
                  "Name",
                  "Phone",
                  "Email",
                  "Status",
                  ...(!isTeamLogin ? ["Assigned To"] : []),
                  "Source",
                  "Follow Up",
                  "Notes",
                  "",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {leadData.length === 0 ? (
                <tr>
                  <td colSpan={!isTeamLogin ? 10 : 9} className="text-center py-16">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-700">No Leads Found</h3>
                    <p className="text-slate-400 text-sm mt-1">Add your first lead to get started.</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((lead, i) => (
                  <tr
                    key={lead._id}
                    className="border-b border-slate-100/80 hover:bg-slate-50/50 transition-colors duration-100 group"
                  >
                    {/* Sr No */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-slate-400">{lead.leadNo}</span>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-800 capitalize">{lead.name}</span>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600 tabular-nums">{lead.phone}</span>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-500 truncate max-w-[180px] block">{lead.email}</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <CustomDropDown
                        value={lead.status}
                        onChange={(sel) => handleStatusChange(lead._id, sel)}
                        options={["New", "Hot", "Warm", "Cold", "Contacted", "Interested", "Closed Won", "Closed Lost"]}
                      />
                    </td>

                    {/* Assigned To */}
                    {!isTeamLogin && (
                      <td className="px-4 py-3">
                        <CustomDropDown
                          value={lead.assignedTo?.name || "Select"}
                          onChange={(sel) => handleAssignedToChange(lead._id, sel)}
                          options={teamList.map((t) => ({
                            label: t.name,
                            value: t._id,
                          }))}
                        />
                      </td>
                    )}

                    {/* Source */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-md">
                        {lead.source}
                      </span>
                    </td>

                    {/* Follow Up Date */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-500 tabular-nums whitespace-nowrap">
                        {lead.followUpDate ? lead.followUpDate.split("T")[0] : "—"}
                      </span>
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-3">
                      {lead.notes ? (
                        <button
                          onClick={() => { setSelectedNote(lead.notes); setSelectedLead(lead); setNotePopup(true); }}
                          className="w-7 h-7 flex items-center justify-center rounded-full text-amber-600 bg-amber-50 border border-amber-200/60 hover:bg-amber-100 hover:scale-105 transition-all duration-150"
                          title="View Note"
                        >
                          <Eye size={13} strokeWidth={2.2} />
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setSelectedId(lead._id); setDeletePopup(true); }}
                          className="w-7 h-7 flex items-center justify-center rounded-full text-red-500 bg-red-50 border border-red-200/60 hover:bg-red-100 hover:scale-105 transition-all duration-150"
                          title="Delete"
                        >
                          <Trash2 size={13} strokeWidth={2.2} />
                        </button>
                        <button
                          onClick={() => openFollowup(lead)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/40">
            <p className="text-xs text-slate-400 mb-2 sm:mb-0">
              Showing <span className="font-semibold text-slate-600">{startIndex + 1}</span>–<span className="font-semibold text-slate-600">{Math.min(endIndex, totalItems)}</span> of{" "}
              <span className="font-semibold text-slate-600">{totalItems}</span> leads
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:border-slate-300 border border-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={15} />
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-150 ${
                    page === currentPage
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white hover:border-slate-300 border border-transparent"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:border-slate-300 border border-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Pagination */}
      {totalPages > 1 && (
        <div className="lg:hidden flex items-center justify-between px-2 py-4">
          <p className="text-xs text-slate-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 px-3 flex items-center gap-1 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={13} /> Prev
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 px-3 flex items-center gap-1 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Popup */}
      {deletePopup && (
        <CustomPopupDelete
          onClose={() => setDeletePopup(false)}
          onDelete={() => handleDelete(selectedId)}
        />
      )}

      {/* Follow Up Modal */}
      {showFollowUps && selectedLead && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <AddFollowUps
            lead={selectedLead}
            setShowFollowUps={setShowFollowUps}
          />
        </div>
      )}

      {/* Note Popup */}
      {notePopup && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[9999] flex items-center justify-center px-4"
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
                  {selectedLead && (
                    <p className="text-[11px] text-slate-400 mt-0.5 capitalize">{selectedLead.name}</p>
                  )}
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

export default AllLeads;