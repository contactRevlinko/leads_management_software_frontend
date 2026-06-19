import React, { useState, useEffect } from "react";
import { ChevronsUpDown, ChevronsUpDownIcon, Info, Plus, Search, Trash2, Users } from "lucide-react";
import AddFollowUps from "../componenets/AddFollowUps";
import CustomDropDown from "../componenets/CustomDropDown";
import CustomPopupDelete from "../componenets/CustomPopupDelete";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamList } from "../redux/teamSlice";
import { fetchAllLead, removeLead } from "../redux/allLeadSlice";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const AllLeads = ({ fetchStatusCount, setSearch, filtered = [] }) => {

  const loginType = localStorage.getItem("loginType");
  const isTeamLogin = loginType === "team";


  const dispatch = useDispatch();
  const { teamList } = useSelector((state) => state.team);
  const { allLeads } = useSelector((state) => state.lead);

  const [showFollowUps, setShowFollowUps] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const [notePopup, setNotePopup] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  const [sortOrderIndex, setSortOrderIndex] = useState("asc");

  useEffect(() => {
    dispatch(fetchAllLead());
    dispatch(fetchTeamList());
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow = showFollowUps ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showFollowUps]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/leads/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    if (sortOrderIndex === "asc") {
      return a.leadNo - b.leadNo;
    } else {
      return b.leadNo - a.leadNo;
    }
  });

  return (
    <div className="md:p-4 lg:p-0 m-2 md:mt-6 md:rounded-2xl overflow-x-auto overflow-y-visible">
      <div className="flex justify-between pb-5">
        <div className="flex my-5 hover:shadow-sm w-full bg-white p-2 rounded-xl md:w-1/2 gap-2">
          <Search />
          <input
            className="outline-none w-full"
            placeholder="Search by name or phone"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-20 lg:hidden">
        {leadData.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <Users className="mx-auto mb-3 w-12 h-12 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700">
              No Leads Found
            </h3>
            <p className="text-gray-500 mt-2">
              Add your first lead to get started.
            </p>
          </div>
        ) : (
          leadData.map((lead) => (
            <div
              key={lead._id}
              className="
      bg-white rounded-2xl border border-gray-100
      shadow-[0_12px_35px_rgba(15,23,42,0.10)]
      p-4
    "
            >
              {/* Header */}
              <div className="mb-4">
                <h1 className="text-lg font-bold text-gray-900 capitalize">
                  {lead.name}
                </h1>
                <p className="text-xs text-gray-400 mt-1">Lead Details</p>
              </div>

              {/* Info */}
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                  <p className="text-gray-500">Mobile</p>
                  <p className="text-gray-800 font-medium truncate">{lead.phone}</p>
                </div>

                <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                  <p className="text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium truncate">{lead.email}</p>
                </div>

                <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                  <p className="text-gray-500">Source</p>
                  <p className="text-gray-800 font-medium">{lead.source}</p>
                </div>

                {!isTeamLogin && (
                  <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                    <p className="text-gray-500">Assigned To</p>
                    <CustomDropDown
                      value={lead.assignedTo?.name || lead.assignedTo || "Select"}
                      onChange={(selectedAssignedTo) =>
                        handleAssignedToChange(lead._id, selectedAssignedTo)
                      }
                      options={teamList.map((teamMem) => teamMem.name)}
                    />
                  </div>
                )}

                <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                  <p className="text-gray-500">Status</p>
                  <CustomDropDown
                    value={lead.status}
                    onChange={(selectedStatus) =>
                      handleStatusChange(lead._id, selectedStatus)
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

                <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                  <p className="text-gray-500">Follow Up</p>
                  <p className="text-gray-800 font-medium">
                    {lead.followUpDate ? lead.followUpDate.split("T")[0] : "No Date"}
                  </p>
                </div>

                {lead.notes && (
                  <button
                    onClick={() => {
                      setSelectedNote(lead.notes);
                      setNotePopup(true);
                    }}
                    className="mt-4 w-full flex justify-center items-center gap-2 h-10 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200"
                  >
                    <Info size={17} />
                    View Note
                  </button>
                )}
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedId(lead._id);
                    setDeletePopup(true);
                  }}
                  className="
          h-10 rounded-xl text-sm font-semibold
          text-red-600 bg-red-50 border border-red-200
          hover:bg-red-100 active:scale-[0.98]
          transition
        "
                >
                  Delete
                </button>

                <button
                  onClick={() => openFollowup(lead)}
                  className="
          h-10 rounded-xl text-sm font-semibold
          text-indigo-700 bg-indigo-50 border border-indigo-200
          hover:bg-indigo-100 active:scale-[0.98]
          transition whitespace-nowrap
        "
                >
                  + FollowUps
                </button>
              </div>
            </div>
          ))
        )}


      </div>

      {/* Desktop */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible">
        <table className="w-full">
          <thead className="bg-indigo-50 border-b border-gray-200">
            <tr className="text-left">
              <th className="p-6 text-sm font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                <button
                  onClick={() =>
                    setSortOrderIndex(sortOrderIndex === "asc" ? "desc" : "asc")
                  }
                  className="flex items-center gap-2"
                >
                  SR NO.
                  <ChevronsUpDownIcon size={16} />
                </button>
              </th>

              {[
              
                "NAME",
                "PHONE",
                "EMAIL",
                "STATUS",
                ...(!isTeamLogin ? ["ASSIGNED TO"] : []),
                "SOURCE",
                "FOLLOW UP DATE",
                "NOTES",
                "DELETE",
                "FOLLOWUP",
              ].map((head) => (
                <th
                  key={head}
                  className="p-6 text-sm font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {leadData.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-16 text-gray-500">
                  <Users className="mx-auto mb-3 w-12 h-12 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-700">
                    No Leads Found
                  </h3>
                  <p className="mt-2">Add your first lead to get started.</p>
                </td>
              </tr>
            ) : (
              sortedLeadData.map((lead, i) => (
                <tr
                  key={lead._id}
                  className="border-b border-gray-200 text-left hover:bg-gray-50"
                >
                  <td className="px-6 py-3">{lead.leadNo}</td>
                  <td className="px-2 py-3">{lead.name}</td>
                  <td className="px-2 py-3">{lead.phone}</td>
                  <td className="px-2 py-3">{lead.email}</td>

                  <td className="px-2 py-3">
                    <CustomDropDown
                      value={lead.status}
                      onChange={(selectedStatus) =>
                        handleStatusChange(lead._id, selectedStatus)
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

                  {!isTeamLogin && (
                    <td className="px-2 py-3">
                      <CustomDropDown
                        value={lead.assignedTo?.name || "Select"}
                        onChange={(selectedId) =>
                          handleAssignedToChange(lead._id, selectedId)
                        }
                        options={teamList.map((teamMem) => ({
                          label: teamMem.name,
                          value: teamMem._id
                        }))}
                      />
                    </td>
                  )}

                  <td className="px-2 py-3">{lead.source}</td>

                  <td className="px-2 py-3">
                    {lead.followUpDate
                      ? lead.followUpDate.split("T")[0]
                      : "No Date"}
                  </td>

                  <td className="px-6 py-5">
                    {lead.notes ? (
                      <button
                        onClick={() => {
                          setSelectedNote(lead.notes);
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

                  <td className="px-2 py-3">
                    <button
                      onClick={() => {
                        setSelectedId(lead._id);
                        setDeletePopup(true);
                      }}
                      className="text-red-600 bg-red-50 flex w-full text-sm justify-center items-center px-4 py-1 gap-3 border border-red-200 hover:ring-2 hover:ring-offset-2 hover:ring-red-300 rounded-lg"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </td>

                  <td className="px-2 py-3">
                    <button
                      onClick={() => openFollowup(lead)}
                      className="flex justify-center items-center gap-3 p-1 bg-indigo-50 text-indigo-700 px-2 rounded-lg whitespace-nowrap hover:bg-indigo-100 hover:ring-2 border border-indigo-200 hover:ring-indigo-300 hover:ring-offset-2"
                    >
                      <Plus size={15} />
                      FollowUps
                    </button>
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
              lead Note
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
    </div>
  );
};

export default AllLeads;  