// import React from "react";
// import { useState, useEffect } from "react";
// const BASE_URL = "http://localhost:5000";
// const Reminders = () => {
//   const [reminders, setReminders] = useState([]);

//   const fetchAllReminders = async () => {
//     const res = await fetch(`${BASE_URL}/api/leads/reminders/today`);
//     const data = await res.json();
//     console.log(data.data, "leads data");
//     setReminders(data.data);
//   };

//   useEffect(() => {
//     fetchAllReminders();
//   }, []);

//   // const isOverdue = (date) => new Date(date) < new Date();

//   const isOverdue = (date) => {
//     const today = new Date().toISOString().split("T")[0];
//     // console.log(today);
//     // console.log(date)
//     const followDate = date.split("T")[0];
//     // console.log(today, followDate, "dates")

//     if (today > followDate) {
//       // console.log("OVERDUE");
//       return true;
//     } else {
//       // console.log("NOT OVERDUE");
//       return false;
//     }
//   };

//   if (!reminders) return;
//   return (
//     <div className="h-screen px-5 py-10">
//       <div className="flex gap-4"><h1 className="font-bold text-2xl"> Follow Up Reminders </h1>
//         <p className="bg-gray-100 px-1 rounded border-2 border-gray-300"> reminders :  {reminders.length}</p> </div>
//       {reminders.map((lead) => {
//         return (
//           <div
//             className="bg-gray-300 p-5 gap-2 m-5 rounded w-1/4"
//             key={lead._id}
//           >
//             <div className="flex">
//               <h3 className="pr-1"> name :  </h3>
//               <h3>{lead.name}</h3>
//             </div>

//             <div className="flex">
//               <p className="pr-1">Phone Number : </p>
//               <p>{lead.phone}</p>
//             </div>
//             <p >
//               followUpDate :
//               <span
//                 className={
//                   isOverdue(lead.followUpDate)
//                     ? "text-red-600"
//                     : "text-green-600"
//                 }
//               >
//                 {lead.followUpDate.split("T")[0]}
//               </span>
//             </p>
//             {isOverdue(lead.followUpDate) && <p>OVERDUE</p>}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Reminders;



import React, { useEffect, useState } from "react";
import AddFollowUps from "../componenets/AddFollowUps";
import CustomPopupDelete from "../componenets/CustomPopupDelete";

const BASE_URL = import.meta.env.VITE_API_URL;

const Reminders = () => {
  const [data, setData] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const fetchTodaysFo = async () => {
    try {
      const res = await fetch(`${BASE_URL}/followups/today`);
      const result = await res.json();
      setData(result.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTodaysFo();
  }, []);

  const handleDelete = async (id) => {
    setShowFollowUps(false)
      const res = await fetch(`${BASE_URL}/followups/delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData((prev) => prev.filter((item) => item._id !== id));
      
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

  return (
    <div className="h-screen px-5 py-10">
      <h1 className="text-2xl font-semibold mb-5">Today's Reminders</h1>


      <div className="lg:hidden sm:block md:flex md:gap-3 md:flex-nowrap" >
        {data.map((follow, index) => {
          return <div className="border-2 md:w-1/2  rounded-lg bg-white border-indigo-200 mb-3 p-4" key={follow._id}>
       
 <div className="flex text-sm gap-13 bg-indigo-100 p-2 rounded-2xl mb-4 ">

              <p className="text-indigo-500 text-lg font-medium  flex gap-2"> {follow.leadId?.name} </p>
            </div>
            <div className="flex text-sm gap-13 mb-1">
              <p className="text-gray-600">Follow Up Type</p>
              <p className="text-gray-700">{follow.followUpType}</p>
            </div>
            <div className="flex text-sm gap-13  mb-1">
              <p className="text-gray-600">Follow Up Date</p>
              <p className="text-gray-700">{follow.followUpDate ? follow.followUpDate.split("T")[0] : "No Date"}</p>
            </div>
            <div className="flex text-sm gap-13  mb-1">
              <p className="text-gray-600">Follow Up Time</p>
              <p className="text-gray-700">{follow.followUpTime}</p>
            </div>
            <div className="flex text-sm gap-5  mb-1 ">
              <p className="text-gray-600">Next Follow Up Date</p>
              <p className="text-gray-700" >{follow.nextFollowupDate ? follow.nextFollowupDate.split("T")[0] : "No Date"}</p>
            </div>
            <div className="flex w-full mt-4 gap-4">
              <button
                onClick={() => {
                  setSelectedId(follow._id);
                  setDeletePopup(true);
                }}
                className=" w-1/2 px-2 rounded text-sm bg-red-400 text-white py-2     "
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
                onClick={() => openFollowup(follow.leadId)}
                className=" w-1/2 bg-white text-sm px-2 py-0.5 border-2 border-gray-200 rounded whitespace-nowrap hover:bg-indigo-100 hover:ring-2 hover:ring-indigo-200 hover:ring-offset-2"
              >
                + followups
              </button> </div>
          </div>
        })}

      </div>


      <div className="hidden lg:block bg-white  rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-indigo-100 text-left">
              <th className="px-6 py-5">SR NO</th>
              <th className="px-6 py-5">NAME</th>
              <th className="px-6 py-5">FOLLOW UP TYPE</th>
              <th className="px-6 py-5">FOLLOWUP DATE</th>
              <th className="px-6 py-5">FOLLOW UP TIME</th>
              <th className="px-6 py-5">NEXT FOLLOW UP DATE</th>
              <th className="px-6 py-5">ACTIONS</th>


            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500">
                  No reminders found today
                </td>
              </tr>
            ) : (
              data.map((followUp, i) => (
                <tr
                  key={followUp._id}
                  className="border-b-2 border-gray-200 text-left"
                >
                  <td className="px-6 py-5">{i + 1}</td>

                  <td className="px-6 py-5">
                    {followUp.leadId?.name || "No Name"}
                  </td>

                  <td className="px-6 py-5">{followUp.followUpType}</td>

                  <td className="px-6 py-5">
                    {followUp.followUpDate
                      ? followUp.followUpDate.split("T")[0]
                      : "No Date"}
                  </td>

                  <td className="px-6 py-5">
                    {followUp.followUpTime || "-"}
                  </td>

                  <td className="px-6 py-5">
                    {followUp.nextFollowupDate
                      ? followUp.nextFollowupDate.split("T")[0]
                      : "No Date"}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex gap-5 items-center">

                      <button
                        onClick={() => {
                          setSelectedId(followUp._id);
                          setDeletePopup(true)
                        }}
                        className="bg-red-500 w-full text-sm  text-white  px-2 py-1  hover:ring-2 hover:ring-offset-2  hover:ring-red-400 rounded  hover:text-white  ">
                        Delete
                      </button>
                      {deletePopup && (
                        <CustomPopupDelete
                          onClose={() => setDeletePopup(false)}
                          onDelete={() => handleDelete(selectedId)}
                        />
                      )}

                      <button
                        onClick={() => openFollowup(followUp.leadId)}
                        className="bg-gray-200 text-sm px-4 py-1 rounded whitespace-nowrap hover:bg-indigo-100 hover:ring-2 hover:ring-indigo-200 hover:ring-offset-2"
                      >
                        + followups
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showFollowUps && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <AddFollowUps
            lead={selectedLead}
            setShowFollowUps={setShowFollowUps}
          />
        </div>
      )}
    </div>
  );
};

export default Reminders;