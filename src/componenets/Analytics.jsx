import React, { useMemo, useState, useEffect } from "react";
import { Calendar, Calendar1, CheckCircle, Trophy, Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLead } from "../redux/allLeadSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CustomCalendar from "./CustomCalender";


const Analytics = () => {
  const { allLeads } = useSelector((state) => state.lead);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllLead());
  }, [dispatch]);
  // all leads of date range
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      const leadDate = new Date(lead.createdAt)
      if (startDate && leadDate < new Date(startDate)) {
        return false;
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        if (leadDate > end) {
          return false
        }
      }
      return true;
    })
  }, [allLeads, startDate, endDate]);

  const totalLeads = filteredLeads.length;
  console.log(totalLeads);

  // hightest lead status
  const highestStatus = useMemo(() => {
    const counts = {};

    filteredLeads.forEach((lead) => {
      const status = lead.status || "No Status";
      counts[status] = (counts[status] || 0) + 1;
    });

    const statusArray = Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    }));

    if (statusArray.length === 0) {
      return { name: "No Data", count: 0 };
    }

    return statusArray.reduce((max, item) =>
      item.count > max.count ? item : max
    );
  }, [filteredLeads]);

  // won status
  const wonStatus = useMemo(() => {
    return filteredLeads.filter((lead) => lead.status === "Closed Won").length;
  }, [filteredLeads]);

  //pending , won , lost 
  const wonCount = filteredLeads.filter((lead) =>
    lead.status === "Closed Won"
  ).length;
  const lostCount = filteredLeads.filter((lead) =>
    lead.status === "Closed Lost"
  ).length;
  const pendingCount = filteredLeads.filter((lead) =>
    lead.status !== "Closed Won" &&
    lead.status !== "Closed Lost"
  ).length

  const leadResultStatus = [
    {
      name: "Pending",
      count: pendingCount,
    },
    {
      name: "Won",
      count: wonCount,
    },
    {
      name: "Lost",
      count: lostCount,
    },
  ];
  const highestLeadResult = leadResultStatus.reduce((max, item) =>
    item.count > max.count ? item : max);

  console.log("allLeads", allLeads);
  console.log("filteredLeads", filteredLeads);

  const downloadPDF = () => {
    if (filteredLeads.length === 0) {
      alert("No lead data available for selected date range");
      return;
    }

    const doc = new jsPDF();

    // heading

    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("LMS", 105, 18, { align: "center" });

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("Lead Management System Analytics Report", 105, 27, {
      align: "center",
    })


    doc.setFontSize(10)
    doc.text(`Date Range: ${startDate || "All"} to ${endDate || "All"} `, 105, 35, { align: "center" })



    doc.roundedRect(14, 48, 43, 24, 3, 3);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Total Leads", 18, 56);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(String(totalLeads), 18, 66);

    doc.roundedRect(62, 48, 43, 24, 3, 3);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Won Leads", 66, 56);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(String(wonStatus), 66, 66);

    doc.roundedRect(110, 48, 43, 24, 3, 3);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Highest Status", 114, 56);
    doc.setFontSize(10);
    doc.text(String(highestStatus.name), 114, 62);
    doc.setFontSize(18);
    doc.text(`${highestStatus.count} `, 114, 69);

    doc.roundedRect(158, 48, 43, 24, 3, 3);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Most Result", 162, 56);
    doc.setFontSize(10);
    doc.text(String(highestLeadResult.name), 162, 62);
    doc.setFontSize(18);
    doc.text(`${highestLeadResult.count} `, 162, 69);

    autoTable(doc, {
      startY: 86,
      head: [

        [
          "Sr No", "Lead Name", "Email", "Phone", "Status", "Assigned To", "Source",
        ],
      ]
      ,
      body: filteredLeads.map((lead, index) => [
        index + 1,
        lead.name || "-",
        lead.email || "-",
        lead.phone || "-",
        lead.status || "-",
        lead.assignedTo?.name || lead.assignedTo || "-",
        lead.source || "-",
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 3,

      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: "bold",
      }
    })

    window.open(doc.output("bloburl"));
    // doc.save("analytics.pdf");
  }
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full bg-gray-50 p-4 md:p-6 flex flex-col gap-3 ">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Lead Analytics
      </h1>


      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">
          Date Range Filter
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-500">Start Date</label>
            <CustomCalendar
              value={startDate}
              maxDate={endDate || today}
              onChange={(date) => {
                setStartDate(date);

                if (endDate && date > endDate) {
                  setEndDate("");
                }
              }}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">End Date</label>
            <CustomCalendar
              value={endDate}
              minDate={startDate}
              maxDate={today}
              disabled={!startDate}
              onChange={(date) => setEndDate(date)}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="w-full border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100"
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-10 " >
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Calendar size={24} />
          </div>

          <p className="text-sm text-gray-500">
            All Leads
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {totalLeads}
          </h2>
        </div>
        {/* //highest status lead */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mb-4">
            <Trophy size={24} />
          </div>

          <p className="text-sm text-gray-500">Highest Lead Status</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {highestStatus.name}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {highestStatus.count} leads
          </p>
        </div>
        {/* //won */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
            <CheckCircle size={24} />
          </div>

          <p className="text-sm text-gray-500">
            Closed Won Leads
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {wonStatus}
          </h2>
        </div>

        {/* // pending , won , lost */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Most Lead Result
          </p>

          <h2 className="text-2xl font-bold text-indigo-600 mt-2">
            {highestLeadResult.name}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {highestLeadResult.count} Leads
          </p>
        </div>
      </div>

      <button
        onClick={downloadPDF}
        disabled={filteredLeads.length === 0}
        className={`
    px-4 py-2 rounded-lg text-white
    ${filteredLeads.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"}
  `}
      >
        Download PDF
      </button>

    </div>
  );
};

export default Analytics;