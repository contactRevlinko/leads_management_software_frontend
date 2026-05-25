import React, { useState, useEffect } from "react";
import { Search, Shovel } from "lucide-react";
import AddFollowUps from "../componenets/AddFollowUps";
import CustomDropDown from "../componenets/CustomDropDown";
import CustomPopupDelete from "../componenets/CustomPopupDelete";
const BASE_URL = import.meta.env.VITE_API_URL;

const AllLeads = ({ setSearch, filtered, allLeads, setAllLeads }) => {
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (showFollowUps) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showFollowUps]);

  const handleDelete = async (id) => {
    // console.log(id, "user id to delete");

    const res = await fetch(`${BASE_URL}/leads/${id}`, {
      method: "DELETE",
    });
    // console.log(res, "delete lead response");
    setAllLeads(allLeads.filter((l) => l._id !== id));
  };
  // console.log(allLeads, "All Leads");

  const openFollowup = (lead) => {
    setSelectedLead(lead);
    setShowFollowUps(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      console.log(id);
      console.log(newStatus);
      const res = await fetch(`${BASE_URL}/leads/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setAllLeads((prev) =>
          prev.map((lead) =>
            lead._id === id ? { ...lead, status: newStatus } : lead,
          ),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!allLeads || !allLeads.length) return;

  return (
    <div className=" md:p-4 lg:p-0  m-2 md:mt-6 md:rounded-2xl ">
      <div className="flex justify-between pb-5 ">
        <div className="flex mt-3 w-full bg-white p-2 rounded-xl md:w-1/2 gap-2">
          <Search />
          <input
            className="outline-none w-full "
            placeholder="search by name or phone "
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {/* //mobile  */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
        {filtered.map((lead, i) => {
          return (
            <div
              className="border-2  bg-white rounded-2xl border-gray-400 p-4 "
              key={lead._id}
            >
              <h1 className="font-bold text-xl text-indigo-700">
                {" "}
                {lead.name}
              </h1>
              <div className="flex gap-20  text-sm">
                <p className="text-gray-500 ">mobile </p>
                <p className="text-gray-700">{lead.phone} </p>
              </div>
              <div className="flex gap-20 text-sm">
                <p className="text-gray-500">Email </p>
                <p className="text-gray-700">{lead.email} </p>
              </div>
              <div className="flex gap-10 text-sm">
                <p className="text-gray-600"> follow up date </p>
                <p className="text-gray-700">
                  {lead.followUpDate
                    ? lead.followUpDate.split("T")[0]
                    : "No Date"}
                </p>
              </div>

              <CustomDropDown
                value={lead.status}
                onChange={(selectedLead) =>
                  handleStatusChange(lead._id, selectedLead)
                }
                options={[
                  "New",
                  "Contacted",
                  "Interested",
                  "Closed Won",
                  "Closed Lost",
                ]}
              />

              <div className="flex justify-between gap-5 mt-3 ">
                <button
                  onClick={() => {
                    setSelectedId(lead._id);
                    setDeletePopup(true);
                  }}
                  className="bg-red-600 w-full text-sm  text-white  px-2 py-1 focus:ring-2 focus:ring-offset-2  focus:ring-red-700   focus:text-white hover:ring-2 hover:ring-offset-2  hover:ring-red-700 rounded  hover:text-white  "
                >
                  Delete
                </button>
                {deletePopup && (
                  <CustomPopupDelete
                    onClose={() => setDeletePopup(false)}
                    onDelete={() => handleDelete(selectedId)}
                  />
                )}
                <button
                  onClick={() => openFollowup(lead)}
                  className="bg-gray-200 px-2 py-1 text-sm w-full rounded whitespace-nowrap  focus:bg-indigo-100 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2 hover:bg-indigo-100 hover:ring-2 hover:ring-indigo-200 hover:ring-offset-2  "
                >
                  + FollowUps
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* // desktop  */}
      <div className=" hidden lg:block bg-white rounded-2xl border border-gray-200  overflow-hidden ">
        <table className=" w-full ">
          <thead className="bg-indigo-100">
            <tr className="  text-gray-500  text-left   ">
              <th className="px-6 py-5 "> SR NO. </th>

              <th className="px-6 py-5 "> NAME </th>
              <th className="px-6 py-5">PHONE</th>
              <th className="px-6 py-5 ">EMAIL</th>
              <th className="px-6 py-5">STATUS</th>
              <th className="px-6 py-5">FOLLOW UP DATE</th>
              <th className="px-6 py-5"></th>

              <th className="px-6 py-5 "></th>
              <th className="px-6 py-5 "></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((lead, i) => (
                <tr
                  key={lead._id}
                  className="border-b-2 border-gray-200 text-left"
                >
                  <td className="px-2 py-3 ">{++i}</td>

                  <td className="px-2 py-3">{lead.name}</td>
                  <td className="px-2 py-3">{lead.phone}</td>
                  <td className="px-2 py-3"> {lead.email} </td>
                  <td className="px-2 py-3">
                    <CustomDropDown
                      value={lead.status}
                      onChange={(selectedLead) =>
                        handleStatusChange(lead._id, selectedLead)
                      }
                      options={[
                        "New",
                        "Contacted",
                        "Interested",
                        "Closed Won",
                        "Closed Lost",
                      ]}
                    />
                  </td>
                  <td className="px-2 py-3">
                    {lead.followUpDate
                      ? lead.followUpDate.split("T")[0]
                      : "No Date"}
                  </td>
                  <td className="px-2 py-3">
                    <button
                      onClick={() => {
                        setSelectedId(lead._id);
                        setDeletePopup(true);
                      }}
                      className="bg-red-600 text-white px-4 py-1 hover:ring-2 hover:ring-offset-2  hover:ring-red-700 rounded  hover:text-white  "
                    >
                      Delete
                    </button>
                    {deletePopup && (
                      <CustomPopupDelete
                        onClose={() => setDeletePopup(false)}
                        onDelete={() => handleDelete(selectedId)}
                      />
                    )}
                  </td>
                  <td className="px-2 py-3">
                    <button
                      onClick={() => openFollowup(lead)}
                      className="bg-gray-200 px-2 rounded whitespace-nowrap hover:bg-indigo-100 hover:ring-2 hover:ring-indigo-200 hover:ring-offset-2  "
                    >
                      + FollowUps
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-2 py-3 text-center text-gray-500">
                  No Leads Of This Date
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showFollowUps && selectedLead && (
        <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <AddFollowUps
            lead={selectedLead}
            setShowFollowUps={setShowFollowUps}
          />
        </div>
      )}
    </div>
  );
};

export default AllLeads;
