import React, { useMemo, useState, useEffect } from "react";
import { Calendar, Calendar1, CheckCircle, Trophy, Download, BarChart3 } from "lucide-react";
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
    <div className="w-full pb-10">
      {/* Header & Export Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="md:text-5xl text-3xl font-medium text-slate-900">
            Lead Analytics
          </h1>
          <p className="md:pt-3 text-sm md:text-xl pt-2 text-slate-500">
            Track and analyze your leads conversion trends and metrics.
          </p>
        </div>
        <button
          onClick={downloadPDF}
          disabled={filteredLeads.length === 0}
          className={`
            flex items-center justify-center gap-2 px-6 h-12 rounded-xl text-sm font-semibold transition-all duration-200
            ${filteredLeads.length === 0
              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md active:scale-[0.98]"}
          `}
        >
          <Download size={18} strokeWidth={2.5} />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-5 mb-8 shadow-sm flex flex-col md:flex-row md:items-end gap-5">
        <div className="w-full md:w-auto">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Start Date</label>
          <div className="w-full md:w-[180px]">
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
        </div>

        <div className="w-full md:w-auto">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">End Date</label>
          <div className="w-full md:w-[180px]">
            <CustomCalendar
              value={endDate}
              minDate={startDate}
              maxDate={today}
              disabled={!startDate}
              onChange={(date) => setEndDate(date)}
            />
          </div>
        </div>

        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
          className="w-full md:w-auto px-6 h-[42px] border border-slate-200/60 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all"
        >
          Clear Filter
        </button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* All Leads Card */}
        <div className="bg-white rounded-2xl border-l-4 border-l-blue-500 border-y border-r border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
            <Calendar size={120} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center mb-5 border border-blue-100/50">
            <Calendar size={22} strokeWidth={2.5} />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">All Leads</p>
          <h2 className="text-3xl font-extrabold text-slate-800 mt-1">{totalLeads}</h2>
        </div>

        {/* Highest Status Card */}
        <div className="bg-white rounded-2xl border-l-4 border-l-amber-500 border-y border-r border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
            <Trophy size={120} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50/80 text-amber-600 flex items-center justify-center mb-5 border border-amber-100/50">
            <Trophy size={22} strokeWidth={2.5} />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Highest Status</p>
          <div className="flex items-end gap-3 mt-1">
            <h2 className="text-3xl font-extrabold text-slate-800">{highestStatus.count}</h2>
            <p className="text-sm font-semibold text-slate-500 mb-[4px]">{highestStatus.name}</p>
          </div>
        </div>

        {/* Won Leads Card */}
        <div className="bg-white rounded-2xl border-l-4 border-l-emerald-500 border-y border-r border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
            <CheckCircle size={120} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50/80 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100/50">
            <CheckCircle size={22} strokeWidth={2.5} />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Closed Won</p>
          <h2 className="text-3xl font-extrabold text-slate-800 mt-1">{wonStatus}</h2>
        </div>

        {/* Most Lead Result Card */}
        <div className="bg-white rounded-2xl border-l-4 border-l-indigo-500 border-y border-r border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
            <BarChart3 size={120} />
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50/80 text-indigo-600 flex items-center justify-center mb-5 border border-indigo-100/50">
            <BarChart3 size={22} strokeWidth={2.5} />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Most Result</p>
          <div className="flex items-end gap-3 mt-1">
            <h2 className="text-3xl font-extrabold text-slate-800">{highestLeadResult.count}</h2>
            <p className="text-sm font-semibold text-slate-500 mb-[4px]">{highestLeadResult.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;