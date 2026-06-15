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
    <div className="mt-5 pl-3">
      <div className="md:flex md:justify-between md:items-center p-4">
        <div>
          <h1 className="md:text-5xl text-3xl font-medium">Leads Management</h1>
          <p className="md:py-3 text-sm md:text-xl py-2 text-gray-600">
            manage and track your sales pipeline across all channels.
          </p>
        </div>




        <div className="flex gap-5 ">
          <button
            className="bg-indigo-700 text-white w-full md:w-auto mt-4 px-2 py-2 rounded"
            onClick={handleAddLead}
          >
            + Add Leads
          </button>


          <button
            className="bg-white  text-indigo-700 border border-indigo-700 w-full md:w-auto mt-4 px-2 py-2 rounded"
            onClick={() => setBulkModal(!bulkModal)}
          >
            + Add Bulk leads
          </button>

          {bulkModal && <div className="fixed inset-0 bg-black/50 backdrop-blur-2xl z-[100] flex items-center justify-center px-4">
           <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl p-5">

             <div className="flex justify-between mb-5">
                <h2 className="text-2xl font-bold text-gray-800">Bulk Uploads</h2>
                <button 
                  className="bg-gradient-to-r from-indigo-500 to-indigo-900 text-white px-5 py-3 rounded-md font-semibold flex items-center gap-2" 
                onClick={handleDownloadTemplate}>
                  <Download />

                  Download Template sheet

                </button>
             </div>
           

         <label 
                className="border border-dashed border-gray-300 rounded-md h-64 flex flex-col items-center justify-center cursor-pointer"
                 onDragOver={(e) => e.preventDefault()}
                 onDrop={(e) => 
                  {e.preventDefault()
                const file = e.dataTransfer.files[0];
                if(file)setBulkFile(file)

                  }
                   
                 }
              
          >
                <div className="bg-indigo-100 text-indigo-700 p-5 rounded-md mb-6">
                  <CloudUpload size={38} />
                </div>
                <h3 className="text-2xl font-bold">Click, drag, or paste sheet</h3>
                 <p className="text-gray-400 mt-3">
                  Compatible with CSV, XLS, or XLSX files
                </p>

                {bulkFile && (
                  <p className="mt-4 text-sm text-indigo-700 font-medium">
                    {bulkFile.name}
                  </p>
                )}
                <input
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  hidden
                  onChange={(e) => setBulkFile(e.target.files[0])}
                />
         </label>

              <div className="grid grid-cols-2 gap-5 mt-7">

                <button
                  onClick={() => {
                    setBulkModal(false);
                    setBulkFile(null);
                  }}
                  className="bg-gray-100 py-4 rounded-md font-semibold text-gray-700"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    if (!bulkFile) {
                      toast.error("Please select file");
                      return;
                    }

                    handleUploadFile({
                      target: {
                        files: [bulkFile],
                        value: "",
                      },
                    });

                    setBulkModal(false);
                    setBulkFile(null);
                  }}
                  className="bg-indigo-700 text-white py-4 rounded-md font-semibold"
                >
                  Process Records
                </button>
              

              </div>
            </div>
          </div>
          }



        </div>


      </div>




      <div className="md:my-0 lg:gap-3 gap-5 my-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {cardData.map((card) => (
          <TypeOfCard
            key={card.name}
            name={card.name}
            leads={card.leads}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

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

      <AllLeads
        setSearch={setSearch}
        filtered={sortedLead}
        fetchStatusCount={fetchStatusCount}
      />

      {addLeadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
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
