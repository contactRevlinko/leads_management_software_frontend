import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import AddTeam from "./AddTeam";
import CustomPopupDelete from "./CustomPopupDelete";
import { fetchTeamList , removeteamMember } from "../redux/teamSlice";
import { useDispatch, useSelector } from "react-redux";
const BASE_URL = import.meta.env.VITE_API_URL;

const Team = () => {

  const dispatch = useDispatch();
  const {teamList} = useSelector((state) => state.team);
  console.log("teamList" , teamList)
  const [openAddTeam, setOpenAddTeam] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState("");

useEffect(() => {
dispatch(fetchTeamList());
} , [dispatch])

  useEffect(() => {
    if (openAddTeam) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openAddTeam]);


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
        // setTeamList((prev) => prev.filter((member) => member._id !== id));
        dispatch(removeTeamMember(id));
        setDeletePopup(false);
        setSelectedId("");
      } else {
        alert(result.message || "Delete failed");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  
  return (
    <div>
      <div className="lg:flex md:flex md:justify-between md:items-center lg:justify-between lg:items-center mb-10">
        <div >
          <h1 className="md:text-5xl text-3xl font-medium">Team Member List</h1>
          <p className="text-gray-500 mt-1">
            Manage your team members and their roles
          </p>
        </div>

        <button
          onClick={() => setOpenAddTeam(!openAddTeam)}
          className="bg-indigo-700 text-white w-full md:w-auto mt-4  py-2 px-2 rounded"
        >
          + Team Member
        </button>
      </div>
{/* //mobile */}
  
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 lg:hidden  ">
        {teamList?.map((teamMem, i) => {
          return (
            <div
              className="border-2  bg-white rounded-2xl border-gray-400 p-4  "
              key={teamMem._id }
            >
             <div className="flex  justify-between">
                <h1 className="font-bold text-xl text-indigo-500">
                  {" "}
                  {teamMem.name}
                </h1>
                <span className="rounded-full bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
                  {teamMem.role}
                </span>
              </div>
              <div className="flex gap-20  text-sm mt-2 mb-1">
                <p className="text-gray-500 ">mobile </p>
                <p className="text-gray-700">{teamMem.phone} </p>
              </div>
              <div className="flex gap-20 text-sm mb-1">
                <p className="text-gray-500">Email </p>
                <p className="text-gray-700">{teamMem.email} </p>
              </div>
        
               



                <button
                  onClick={() => {
                    setSelectedId(teamMem._id);
                    setDeletePopup(true);
                  }}
                  className="bg-red-500 w-full  mt-5 text-sm  text-white  px-2 py-1 focus:ring-2 focus:ring-offset-2  focus:ring-red-400   focus:text-white hover:ring-2 hover:ring-offset-2  hover:ring-indigo -700 rounded  hover:text-white  "
                >
                  Delete
                </button>
                {deletePopup && (
                  <CustomPopupDelete
                    onClose={() => setDeletePopup(false)}
                    onDelete={() => handleDelete(selectedId)}
                  />
                )}
        
                
            </div>
           
          );
        })}
      </div>


{/* //desktop */}
      <div className="bg-white rounded-2xl border border-gray-200 mt-10 overflow-hidden hidden lg:block">
        <table className="w-full">
          <thead>
            <tr className="bg-indigo-100 text-left text-gray-500">
              <th className="px-6 py-5 ">NAME</th>
              <th className="px-6 py-5 ">PHONE</th>
              <th className="px-6 py-5 ">EMAIL</th>
              <th className="px-6 py-5 ">ROLE</th>
              <th className="px-6 py-5 "></th>
            </tr>
          </thead>
          <tbody>
            {teamList?.map((teamMem) => {
              return (
                <tr
                  key={teamMem._id}
                  className="text-left  text-gray-700 hover:bg-gray-50"
                >
                  <td className="px-6 py-5 ">{teamMem.name}</td>
                  <td className="px-6 py-5 ">{teamMem.phone}</td>
                  <td className="px-6 py-5 ">{teamMem.email}</td>
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
                      className="bg-red-500 w-full text-sm  text-white  px-2 py-1  hover:ring-2 hover:ring-offset-2  hover:ring-red-400 rounded  hover:text-white  "
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {openAddTeam && (
        <div className=" fixed z-20 l- inset-0 bg-black/40 backdrop-blur-sm  flex justify-center , items-center">
          <AddTeam setOpenAddTeam={setOpenAddTeam} />
        </div>
      )}
    </div>
  );
};

export default Team;
