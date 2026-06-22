import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import TypeOfCard from "./TypeOfCard";
import LeadManageRow from "./LeadManageRow";
import AllLeads from "../pages/AllLeads";

import AddLead from "../pages/AddLead";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLead } from "../redux/allLeadSlice";
import {
  CloudUpload,
  Download,
  Flame,
  HeartHandshake,
  PhoneCall,
  Snowflake,
  SunMedium,
  Trophy,
  UserPlus,
  Users,
  XCircle,
  Plus,
  Upload,
  FileSpreadsheet,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const BASE_URL = import.meta.env.VITE_API_URL;

const LeadMangement = () => {
  const dispatch = useDispatch();
  const { allLeads, loading, error } = useSelector((state) => state.lead);

  useEffect(() => {
    dispatch(fetchAllLead());
  }, [dispatch]);

  const [filter, setFilter] = useState("All");
  const [selectDate, setSelectDate] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [totalLeads, setTotalLeads] = useState(0);

  const [newStatus, setNewStatus] = useState(0);
  const [hot, setHot] = useState(0);
  const [cold, setCold] = useState(0);
  const [warm, setWarm] = useState(0);
  const [inteStatus, setInteStatus] = useState(0);
  const [contactStatus, setContactStatus] = useState(0);
  const [wonStatus, setWonStatus] = useState(0);
  const [lostStatus, setLostStatus] = useState(0);
  const [addLeadModal, setAddLeadModal] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [bulkModal, setBulkModal] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const navigate = useNavigate();

  const handleApiError = (err, name) => {
    console.log(`${name} error:`, err.response?.data || err.message);
  };
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchStatusCount = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token, "token");
      const res = await fetch(`${BASE_URL}/leads/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();

      result.byStatus.map((s) => ({
        name: s._id || "No Status",
        count: s.count,
      }));

      if (res.ok && result.success) {
        const total = result.total || 0;
        const byStatus = result.byStatus || [];
        console.log(total, byStatus);
        setTotalLeads(total);
        setNewStatus(byStatus.find((s) => s._id === "New")?.count || 0);
        setHot(byStatus.find((s) => s._id === "Hot")?.count || 0);
        setWarm(byStatus.find((s) => s._id === "Warm")?.count || 0);
        setCold(byStatus.find((s) => s._id === "Cold")?.count || 0);
        setInteStatus(byStatus.find((s) => s._id === "Interested")?.count || 0);
        setContactStatus(
          byStatus.find((s) => s._id === "Contacted")?.count || 0,
        );
        setWonStatus(byStatus.find((s) => s._id === "Closed Won")?.count || 0);
        setLostStatus(
          byStatus.find((s) => s._id === "Closed Lost")?.count || 0,
        );
      }
    } catch (err) {
      console.log("Dashboard API error:", err);
    }
  };

  const handleUploadFile = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${BASE_URL}/leads/upload`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data?.message || "File uploaded successfully");
      dispatch(fetchAllLead());
      fetchStatusCount();
      e.target.value = "";
    } catch (err) {
      handleApiError(err, "handleUploadFile");
      toast.error(err.response?.data?.message || "File upload failed");
    }
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("leads-template");

    worksheet.columns = [
      { header: "name", key: "name", width: 20 },
      { header: "phone", key: "phone", width: 15 },
      { header: "email", key: "email", width: 25 },
      { header: "status", key: "status", width: 18 },
      { header: "source", key: "source", width: 18 },
      { header: "followUpDate", key: "followUpDate", width: 18 },
    ];

    const statusOptions = [
      "New",
      "Hot",
      "Warm",
      "Cold",
      "Contacted",
      "Interested",
      "Closed Won",
      "Closed Lost",
    ];

    const sourceOptions = [
      "Whatsapp",
      "Instagram",
      "Referral",
      "Website",
      "Facebook",
      "Call",
      "Email",
      "Telegram",
      "Friend",
      "Other",
    ];


    for (let row = 2; row <= 100; row++) {
    
      worksheet.getCell(`D${row}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${statusOptions.join(",")}"`],
      };

      
      worksheet.getCell(`E${row}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${sourceOptions.join(",")}"`],
      };

     
      worksheet.getCell(`F${row}`).numFmt = "yyyy-mm-dd";
    }
    worksheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "blank-leads-template.xlsx"
    );
  };

  const filtered = (allLeads || []).filter((lead) => {
    const matchSearch =
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.assignedTo?.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.includes(search);
  
    const matchStatus = filter === "All" || lead.status === filter;
    const statusGroup = {
      High: ["Warm", "Hot", "Interested", "New"],
      Medium: ["Contacted"],
      Low: ["Cold"],
    };
    const matchPriority =
      priorityFilter === "All" ||
      statusGroup[priorityFilter]?.includes(lead.status);

    const leadDate = lead.followUpDate ? lead.followUpDate.split("T")[0] : "";
    const matchDate = !selectDate || selectDate === leadDate;
    return matchPriority && matchSearch && matchStatus && matchDate  ;
  })


  const sortedLead = [...filtered].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name?.localeCompare(b.name);
    }

    if (sortOrder === "desc") {
      return b.name?.localeCompare(a.name);
    }

    return 0;
  });

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("lead");

    worksheet.columns = [
      { header: "name", key: "name", width: 20 },
      { header: "phone", key: "phone", width: 15 },
      { header: "email", key: "email", width: 25 },
      { header: "status", key: "status", width: 18 },
      { header: "source", key: "source", width: 18 },
      { header: "follow up date", key: "followUpDate", width: 18 },
    ];

    filtered.forEach((lead) => {
      worksheet.addRow({
        name: lead.name || "",
        phone: lead.phone || "",
        email: lead.email || "",
        status: lead.status || "New",
        source: lead.source || "",
        followUpDate: lead.followUpDate ? lead.followUpDate.split("T")[0] : "",
      });
    });

    const statusOptions = [
      "New",
      "Hot",
      "Warm",
      "Cold",
      "Contacted",
      "Interested",
      "Closed Won",
      "Closed Lost",
    ];

    const sourceOptions = [
      "Whatsapp",
      "Instagram",
      "Referral",
      "Website",
      "Facebook",
      "Call",
      "Email",
      "Telegram",
      "Friend",
      "Other",
    ];

    for (let row = 2; row <= filtered.length + 100; row++) {
      worksheet.getCell(`D${row}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${statusOptions.join(",")}"`],
        showErrorMessage: true,
        errorTitle: "Invalid Status",
        error: "Please select status from dropdown only",
      };
      worksheet.getCell(`E${row}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${sourceOptions.join(",")}"`],
        showErrorMessage: true,
        errorTitle: "Invalid Source",
        error: "Please select source from dropdown only",
      };
    }

    worksheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "all-leads.xlsx",
    );
  };

  const handleAddLead = () => {
    setAddLeadModal(true);
  };

  useEffect(() => {
    dispatch(fetchAllLead());
    fetchStatusCount();
  }, [dispatch]);

  const cardData = [
    {
      name: "TOTAL LEADS",
      leads: totalLeads,
      icon: Users,
      color: { bg: "bg-indigo-100", text: "text-indigo-600" },
    },
    {
      name: "NEW",
      leads: newStatus,
      icon: UserPlus,
      color: { bg: "bg-blue-100", text: "text-blue-600" },
    },
    {
      name: "HOT",
      leads: hot,
      icon: Flame,
      color: { bg: "bg-red-100", text: "text-red-600" },
    },
    {
      name: "WARM",
      leads: warm,
      icon: SunMedium,
      color: { bg: "bg-orange-100", text: "text-orange-600" },
    },
    {
      name: "COLD",
      leads: cold,
      icon: Snowflake,
      color: { bg: "bg-cyan-100", text: "text-cyan-600" },
    },
    {
      name: "INTERESTED",
      leads: inteStatus,
      icon: HeartHandshake,
      color: { bg: "bg-green-100", text: "text-green-600" },
    },
    {
      name: "CONTACTED",
      leads: contactStatus,
      icon: PhoneCall,
      color: { bg: "bg-purple-100", text: "text-purple-600" },
    },
    {
      name: "CLOSED WON",
      leads: wonStatus,
      icon: Trophy,
      color: { bg: "bg-emerald-100", text: "text-emerald-600" },
    },
    {
      name: "CLOSED LOST",
      leads: lostStatus,
      icon: XCircle,
      color: { bg: "bg-pink-100", text: "text-pink-600" },
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage and track your sales pipeline
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setBulkModal(!bulkModal)}
            className="h-9 px-3.5 flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200/80 rounded-lg text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-150"
          >
            <Upload size={14} />
            <span>Import</span>
          </button>
          <button
            onClick={handleAddLead}
            className="h-9 px-3.5 flex items-center gap-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 active:scale-[0.97] transition-all duration-150 shadow-sm shadow-indigo-200"
          >
            <Plus size={14} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      {bulkModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200/60 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800">Import Leads</h2>
                <p className="text-xs text-slate-400 mt-0.5">Upload your spreadsheet to bulk import leads</p>
              </div>
              <button
                onClick={() => { setBulkModal(false); setBulkFile(null); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              {/* Download Template */}
              <button
                onClick={handleDownloadTemplate}
                className="w-full flex items-center gap-3 px-4 py-3 mb-4 bg-slate-50 border border-slate-200/60 rounded-lg hover:bg-slate-100 transition-colors group"
              >
                <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                  <FileSpreadsheet size={16} className="text-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-700">Download Template</p>
                  <p className="text-[11px] text-slate-400">Get the blank template with correct columns</p>
                </div>
                <Download size={14} className="ml-auto text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>

              {/* Drag & Drop Zone */}
              <label
                className={`flex flex-col items-center justify-center h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? "border-indigo-400 bg-indigo-50/50"
                    : bulkFile
                    ? "border-emerald-300 bg-emerald-50/30"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) setBulkFile(file);
                }}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                  bulkFile ? "bg-emerald-100" : "bg-slate-100"
                }`}>
                  <CloudUpload size={20} className={bulkFile ? "text-emerald-600" : "text-slate-400"} />
                </div>

                {bulkFile ? (
                  <>
                    <p className="text-sm font-semibold text-slate-700">{bulkFile.name}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Click or drop to replace</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-600">
                      Drop your file here, or <span className="text-indigo-600">browse</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Supports CSV, XLS, XLSX</p>
                  </>
                )}

                <input
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  hidden
                  onChange={(e) => setBulkFile(e.target.files[0])}
                />
              </label>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center gap-2.5 px-5 py-4 border-t border-slate-100 bg-slate-50/40">
              <button
                onClick={() => { setBulkModal(false); setBulkFile(null); }}
                className="flex-1 h-10 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!bulkFile) {
                    toast.error("Please select a file");
                    return;
                  }
                  handleUploadFile({
                    target: { files: [bulkFile], value: "" },
                  });
                  setBulkModal(false);
                  setBulkFile(null);
                }}
                className="flex-1 h-10 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
              >
                Upload & Process
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3 mb-5">
        {cardData.slice(0, 5).map((card) => (
          <TypeOfCard
            key={card.name}
            name={card.name}
            leads={card.leads}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-1">
        {cardData.slice(5).map((card) => (
          <TypeOfCard
            key={card.name}
            name={card.name}
            leads={card.leads}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      {/* Filter Bar */}
      <LeadManageRow
        filter={filter}
        setFilter={setFilter}
        filtered={sortedLead}
        selectDate={selectDate}
        setSelectDate={setSelectDate}
        handleExportExcel={handleExportExcel}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {/* Leads Table */}
      <AllLeads
        setSearch={setSearch}
        filtered={sortedLead}
        fetchStatusCount={fetchStatusCount}
      />

      {/* Add Lead Modal */}
      {addLeadModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <AddLead
            setAddLeadModal={setAddLeadModal}
            addLeadModal={addLeadModal}
            fetchStatusCount={fetchStatusCount}
          />
        </div>
      )}
    </div>
  );
};

export default LeadMangement;
