import React, { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import CustomPopupDelete from "./CustomPopupDelete";
const BASE_URL = import.meta.env.VITE_API_URL;

const FollowupsList = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchAllFollowUp = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${BASE_URL}/followups/get-followups`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setData(data.data);
      // console.log(data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchAllFollowUp();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this followup?")) {
      const res = await fetch(`${BASE_URL}/delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData((prev) => prev.filter((item) => item._id !== id));
      }
    }
  };
  if (data.length === 0) return;
  return (
    <div className="w-full sm:w-auto mt-10 h-screen overflow-x-scroll ">
      {/* mobile */}
      <div className="lg:hidden sm:block md:flex md:gap-3 md:flex-nowrap " >
        {data.map((follow, index) => {
          return <div className="border-2 md:w-1/2   rounded border-gray-300 mb-3 p-2" key={follow._id}>
            <div className="flex text-sm gap-13 ">

              <p className="text-indigo-700 text-lg"> ({++index}) {follow.leadId?.name}</p>
            </div>
            <div className="flex text-sm gap-13">
              <p className="text-gray-600">Follow Up Type</p>
              <p className="text-gray-700">{follow.followUpType}</p>
            </div>
            <div className="flex text-sm gap-13">
              <p className="text-gray-600">Follow Up Date</p>
              <p className="text-gray-700">{follow.followUpDate ? follow.followUpDate.split("T")[0] : "No Date"}</p>
            </div>
            <div className="flex text-sm gap-13">
              <p className="text-gray-600">Follow Up Time</p>
              <p className="text-gray-700">{follow.followUpTime}</p>
            </div>
            <div className="flex text-sm gap-5 ">
              <p className="text-gray-600">Next Follow Up Date</p>
              <p className="text-gray-700" >{follow.nextFollowupDate ? follow.nextFollowupDate.split("T")[0] : "No Date"}</p>
            </div>
            <button
              onClick={() => {
                setSelectedId(follow._id);
                setDeletePopup(true);
              }}
              className=" px-2 rounded text-sm bg-red-700 text-white py-0.5  mt-2  "
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
        })}

      </div>

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

          <tbody>
            {data.map((followUp, i) => (
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
                    className="hover:ring 2  hover:ring-offset-2 hover:ring-red-700  px-2 rounded bg-red-700 text-white   "
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FollowupsList;
