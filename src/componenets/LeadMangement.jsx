import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import TypeOfCard from "./TypeOfCard";
import LeadManageRow from "./LeadManageRow";
import AllLeads from "../pages/AllLeads";
import * as XLSX from "xlsx";
import AddLead from "../pages/AddLead";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const LeadMangement = () => {
  const [filter, setFilter] = useState("All");
  const [selectDate, setSelectDate] = useState("");
  const [search, setSearch] = useState("");
  const [allLeads, setAllLeads] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [totalLeads, setTotalLeads] = useState(0);
  const [newStatus, setNewStatus] = useState(0);
  const [inteStatus, setInteStatus] = useState(0);
  const [contactStatus, setContactStatus] = useState(0);
  const [wonStatus, setWonStatus] = useState(0);
  const [lostStatus, setLostStatus] = useState(0);
  const [addLeadModal, setAddLeadModal] = useState(false);

  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const handleApiError = (err, name) => {
    console.log(`${name} error:`, err.response?.data || err.message);
  };

  const fetchAllLead = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/leads/get-leads`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

      if (res.data?.success) {
        setAllLeads(res.data.data || []);
      } else {
        setAllLeads([]);
      }
    } catch (err) {
      handleApiError(err, "fetchAllLead");
      setAllLeads([]);
    }
  };

  const totalLead = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/leads/count`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

      setTotalLeads(res.data?.totalLead || 0);
    } catch (err) {
      handleApiError(err, "totalLead");
      setTotalLeads(0);
    }
  };

  const newStatusLead = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/leads/new`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

      setNewStatus(res.data?.newStatus || 0);
    } catch (err) {
      handleApiError(err, "newStatusLead");
      setNewStatus(0);
    }
  };

  const inteStatusLead = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/leads/interested`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

      setInteStatus(res.data?.interested || 0);
    } catch (err) {
      handleApiError(err, "inteStatusLead");
      setInteStatus(0);
    }
  };

  const contactedStatus = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/leads/contacted`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

      setContactStatus(res.data?.contacted || 0);
    } catch (err) {
      handleApiError(err, "contactedStatus");
      setContactStatus(0);
    }
  };

  const ClosedWonStatus = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/leads/won`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

      setWonStatus(res.data?.won || 0);
    } catch (err) {
      handleApiError(err, "ClosedWonStatus");
      setWonStatus(0);
    }
  };

  const ClosedLostStatus = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/leads/lost`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

      setLostStatus(res.data?.lost || 0);
    } catch (err) {
      handleApiError(err, "ClosedLostStatus");
      setLostStatus(0);
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

      alert(res.data?.message || "File uploaded successfully");
      fetchAllLead();
      e.target.value = "";
    } catch (err) {
      handleApiError(err, "handleUploadFile");
      alert(err.response?.data?.message || "File upload failed");
    }
  };

  const filtered = (allLeads || []).filter((lead) => {
    const matchSearch =
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.includes(search);

    const matchStatus = filter === "All" || lead.status === filter;

    const leadDate = lead.followUpDate ? lead.followUpDate.split("T")[0] : "";
    const matchDate = !selectDate || selectDate === leadDate;

    return matchSearch && matchStatus && matchDate;
  });

  const sortedLead = [...filtered].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name?.localeCompare(b.name);
    }

    if (sortOrder === "desc") {
      return b.name?.localeCompare(a.name);
    }

    return 0;
  });

  const handleExportExcel = () => {
    const exportData = (filtered || []).map((lead) => ({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      status: lead.status,
      "follow up date": lead.followUpDate
        ? lead.followUpDate.split("T")[0]
        : "no date",
    }));

    const workSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, workSheet, "lead");
    XLSX.writeFile(workbook, "all-leads.xlsx");
  };

  const handleAddLead = () => {
    setAddLeadModal(true);
  };

  useEffect(() => {
    fetchAllLead();
    newStatusLead();
    totalLead();
    inteStatusLead();
    contactedStatus();
    ClosedLostStatus();
    ClosedWonStatus();
  }, []);

  return (
    <div>
      <div className="md:flex md:justify-between md:items-center">
        <div>
          <h1 className="md:text-5xl text-3xl font-medium">
            Leads Management
          </h1>
          <p className="md:py-3 text-sm md:text-xl py-2 text-gray-600">
            manage and track your sales pipeline across all channels.
          </p>
        </div>

        <button
          className="bg-indigo-700 text-white w-full md:w-auto mt-4 px-2 py-2 rounded"
          onClick={handleAddLead}
        >
          + Add Leads
        </button>
      </div>

      <div className="md:my-0 lg:gap-3 gap-5 my-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <TypeOfCard name="TOTAL LEADS" leads={totalLeads || 0} />
        <TypeOfCard name="NEW" leads={newStatus || 0} />
        <TypeOfCard name="INTERESTED" leads={inteStatus || 0} />
        <TypeOfCard name="CONTACTED" leads={contactStatus || 0} />
        <TypeOfCard name="CLOSED WON" leads={wonStatus || 0} />
        <TypeOfCard name="CLOSED LOST" leads={lostStatus || 0} />
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
        handleUploadFile={handleUploadFile}
      />

      <AllLeads
        setSearch={setSearch}
        setAllLeads={setAllLeads}
        filtered={sortedLead}
        allLeads={allLeads}
      />

      {addLeadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <AddLead
            setAddLeadModal={setAddLeadModal}
            addLeadModal={addLeadModal}
          />
        </div>
      )}
    </div>
  );
};

export default LeadMangement;