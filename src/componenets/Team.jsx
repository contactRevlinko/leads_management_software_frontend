import React, { useEffect, useState } from "react";
import AddTeam from "./AddTeam";
import CustomPopupDelete from "./CustomPopupDelete";
import { fetchTeamList, removeteamMember } from "../redux/teamSlice";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const Team = () => {
  const dispatch = useDispatch();
  const { teamList } = useSelector((state) => state.team);

  const [openAddTeam, setOpenAddTeam] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    dispatch(fetchTeamList());
  }, [dispatch]);

  

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/team/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        dispatch(removeteamMember(id));
        setDeletePopup(false);
        setSelectedId("");
      } else {
        toast.success(result.message || "Delete failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="pl-5">
      <div className="lg:flex md:flex md:justify-between md:items-center  lg:justify-between lg:items-center mb-10">
        <div className="mt-10 ">
          <h1 className="md:text-5xl text-3xl font-medium">
            Team Member List
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your team members and their roles
          </p>
        </div>

        <button
          onClick={() => setOpenAddTeam(true)}
          className="bg-indigo-700 text-white w-full md:w-auto mt-4 py-2 px-4 rounded hover:bg-indigo-800"
        >
          + Team Member
        </button>
      </div>

      {/* Mobile */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 lg:hidden p-5 ">
        {teamList?.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-10 text-center ">
            <Users className="mx-auto mb-3 w-12 h-12 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700">
              No Team Members Found
            </h3>
            <p className="text-gray-500 mt-2">
              Add your first team member to get started.
            </p>
          </div>
        ) : (
          teamList?.map((teamMem) => (
           <div
              key={teamMem._id}
              className="
      bg-white rounded-2xl border border-gray-100
      shadow-[0_12px_35px_rgba(15,23,42,0.10)]
      p-4
    ">
              <div className="flex justify-between">
                <h1 className="text-lg font-bold text-gray-900 capitalize">
                  {teamMem.name}
                </h1>

                <span className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
                  {teamMem.role}
                </span>
              </div>

              <div className="space-y-3 text-sm mt-3">
                <div className="grid grid-cols-[110px_1fr] items-center ">
                  <p className="text-gray-500">Work phone</p>
                  <p className="text-gray-700 font-medium">{teamMem.phone1}</p>
                </div>
             
                
                <div className="grid grid-cols-[110px_1fr] items-center ">
                  <p className="text-gray-500">   Alternate phone</p>
                  <p className="text-gray-700 font-medium">{teamMem.phone2}</p>
                </div>

                <div className="grid grid-cols-[110px_1fr] items-center mb-3 ">
                  <p className="text-gray-500">Email</p>
                  <p className="text-gray-700 font-medium">{teamMem.email}</p>
                </div>
                </div>


              <button
                onClick={() => {
                  setSelectedId(teamMem._id);
                  setDeletePopup(true);
                }}
                className="
           w-full py-2 mt-3 rounded-xl text-sm font-semibold
          text-red-600 bg-red-50 border border-red-200
          hover:bg-red-100 active:scale-[0.98]
          transition
        "
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Desktop */}
      <div className="bg-white rounded-2xl border border-gray-200 mt-10 overflow-hidden hidden lg:block">
        <table className="w-full">
          <thead className="bg-indigo-50 border-b border-gray-200">
            <tr className="text-left">
              {["SR NO.", "NAME", "workPhone", "   ALTERNATEPHONE" , "EMAIL", "ROLE", "DELETE"].map(
                (head) => (
                  <th
                    key={head}
                    className="p-6 text-sm font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {teamList?.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-16 text-gray-500">
                  <Users className="mx-auto mb-3 w-12 h-12 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-700">
                    No Team Members Found
                  </h3>
                  <p className="mt-2">
                    Add your first team member to get started.
                  </p>
                </td>
              </tr>
            ) : (
              teamList?.map((teamMem, i) => (
                <tr
                  key={teamMem._id}
                  className="text-left text-gray-700 hover:bg-gray-50"
                >
                  <td className="px-6 py-5">{i + 1}</td>
                  <td className="px-6 py-5">{teamMem.name}</td>
                  <td className="px-6 py-5">{teamMem.phone1}</td>
                  <td className="px-6 py-5">{teamMem.phone2}</td>

                  <td className="px-6 py-5">{teamMem.email}</td>

                  <td>
                    <span className="rounded-full bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
                      {teamMem.role}
                    </span>
                  </td>

                  <td className="px-2 py-3">
                    <button
                      onClick={() => {
                        setSelectedId(teamMem._id);
                        setDeletePopup(true);
                      }}
                      className="text-red-600 bg-red-50 flex w-full text-sm justify-center items-center py-2 gap-3 border border-red-200 hover:ring-2 hover:ring-offset-2 hover:ring-red-300 rounded-lg"
                    >
                      <Trash2 size={15} />
                      Delete
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

      {openAddTeam && (
        <div className="fixed z-[9999] inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <AddTeam setOpenAddTeam={setOpenAddTeam} />
        </div>
      )}
    </div>
  );
};

export default Team;