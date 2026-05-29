import React, { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import CustomPopupDelete from "./CustomPopupDelete";
import { useGetFollowupQuery, useDeleteFollowupsMutation } from "../redux/followupApi";
const BASE_URL = import.meta.env.VITE_API_URL;

const FollowupsList = () => {

  const [filtered, setFiltered] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [deleteFollowups] = useDeleteFollowupsMutation();

  const { data, isLoading, error } = useGetFollowupQuery();
  const followups = data?.data || [];
  console.log(followups, "data")


  const handleDelete = async (id) => {
    try {
      setDeletePopup(false); // popup close
      setSelectedId(null);

      await deleteFollowups(id).unwrap(); // delete api

      alert("Followup deleted successfully");
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="w-full sm:w-auto mt-10 h-screen overflow-x-scroll ">
      {/* mobile */}


      {followups.length === 0 ? (<h1 className="lg:hidden font-bold text-2xl"> follow up not found....  </h1>) : (
        <div className="lg:hidden sm:block md:flex md:gap-3 md:flex-nowrap " >
          {followups.map((follow, index) => {
            return <div className="border-2 md:w-1/2 bg-white  rounded-lg border-indigo-300 mb-3 p-4" key={follow._id}>
              <div className="flex text-sm gap-13 bg-indigo-100 p-2 rounded-2xl mb-4 ">

                <p className="text-indigo-700 text-lg font-medium ml-2">  {follow.leadId?.name}</p>
              </div>
              <div className="flex text-sm gap-13 mb-1">
                <p className="text-gray-600">Follow Up Type</p>
                <p className="text-gray-700">{follow.followUpType}</p>
              </div>
              <div className="flex text-sm gap-13 mb-1">
                <p className="text-gray-600">Follow Up Date</p>
                <p className="text-gray-700">{follow.followUpDate ? follow.followUpDate.split("T")[0] : "No Date"}</p>
              </div>
              <div className="flex text-sm gap-13 mb-1">
                <p className="text-gray-600">Follow Up Time</p>
                <p className="text-gray-700">{follow.followUpTime}</p>
              </div>
              <div className="flex text-sm gap-5 mb-1">
                <p className="text-gray-600">Next Follow Up Date</p>
                <p className="text-gray-700" >{follow.nextFollowupDate ? follow.nextFollowupDate.split("T")[0] : "No Date"}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedId(follow._id);
                  setDeletePopup(true);
                }}
                className=" px-2 rounded text-md w-full  mt-3  bg-red-400  text-white py-2  mb-4  "
              >
                Delete
              </button>


            </div>
          })}

        </div>
      )}
      {/* laptop */}
      <div className=" lg:block hidden bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className=" w-full ">
          <thead>
            <tr className="bg-indigo-100  text-left">
              <th className="px-6 py-5 ">SR NO</th>
              <th className="px-6 py-5 ">NAME</th>
              <th className="px-6 py-5 ">FOLLOW UP TYPE</th>
              <th className="px-6 py-5 ">FOLLOWUP DATE</th>
              <th className="px-6 py-5 ">FOLLOW UP TIME</th>
              <th className="px-6 py-5 ">NEXT FOLLOW UP DATE</th>
              <th className="px-6 py-5 "></th>
            </tr>
          </thead>
          {followups.length === 0 ? (
            <tr>
              <td className="px-6 py-8 text-center text-gray-500">
                No reminders found today
              </td>
            </tr>
          ) : (
            <tbody>
              {followups.map((followUp, i) => (
                <tr
                  key={followUp._id}
                  className="border-b-2 border-gray-200 text-left"
                >
                  <td className="px-6 py-5 ">{++i}</td>
                  <td className="px-6 py-5 ">
                    {followUp.leadId?.name || "No Name"}
                  </td>

                  <td className="px-6 py-5 ">{followUp.followUpType}</td>

                  <td className="px-6 py-5 ">
                    {followUp.followUpDate
                      ? followUp.followUpDate.split("T")[0]
                      : "No Date"}
                  </td>

                  <td className="px-6 py-5 ">{followUp.followUpTime}</td>

                  <td className="px-6 py-5 ">
                    {followUp.nextFollowupDate
                      ? followUp.nextFollowupDate.split("T")[0]
                      : "No Date"}
                  </td>
                  <td className="px-6 py-5 ">
                    <button
                      onClick={() => {
                        setSelectedId(followUp._id);
                        setDeletePopup(true);
                      }}
                      className="bg-red-500 w-full text-sm  text-white  px-2 py-1  hover:ring-2 hover:ring-offset-2  hover:ring-red-400 rounded  hover:text-white  "
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>)}
        </table>


      </div>


      {deletePopup && (
        <CustomPopupDelete
          onClose={() => setDeletePopup(false)}
          onDelete={() => handleDelete(selectedId)}
        />
      )}
    </div>
  );
};

export default FollowupsList;
