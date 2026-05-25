import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import TypeOfCard from "./TypeOfCard";
import LeadManageRow from "./LeadManageRow";
import AllLeads from "../pages/AllLeads";
const BASE_URL = "http://localhost:5000";
import * as XLSX from "xlsx";
import AddLead from "../pages/AddLead";

const LeadMangement = ({ }) => {
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

  const fetchAllLead = async () => {
    try{
      const token = localStorage.getItem("token")
      const res = await fetch(`${BASE_URL}/api/leads`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      // console.log(data.data, "db Leads");
      if (res.ok && data.success) {
        setAllLeads(data.data || []);
      } else {
        setAllLeads([]);
      }
    }catch(err){
      console.log(err);
    }
    }

  const filtered = allLeads.filter((lead) => {
    const matchSearch =
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search);

    const matchStatus = filter === "All" || lead.status === filter;
    // console.log(matchSearch);
    // console.log(matchStatus)

    const leadDate = lead.followUpDate ? lead.followUpDate.split("T")[0] : "";
    const matchDate = !selectDate || selectDate === leadDate;
    // console.log("select date", selectDate, "leadDate", leadDate);

    return matchSearch && matchStatus && matchDate;
  });

  const handleExportExcel = () => {
    console.log("exported")
    const exportData = filtered.map((lead) => ({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      status: lead.status,
      "follow up date": lead.followUpDate
        ? lead.followUpDate.split("T")[0]
        : "no date",
    }));
    const workSheet = XLSX.utils.json_to_sheet(exportData); // create empty excel file
    const workbook = XLSX.utils.book_new(); //add sheet inside excel file
    XLSX.utils.book_append_sheet(workbook, workSheet, "lead"); //add worksheet into workbook
    XLSX.writeFile(workbook, "all-leads.xlsx"); // download excel file
  };

  const handleUploadFile = async (e) => {
    // console.log(e);
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData(); // create a object in form of html
    // console.log(formData);
    formData.append("file", file); // add file into form { file : selected file}
    const res = await fetch(`${BASE_URL}/api/leads/upload`, {
      method: "post",
      body: formData,
    });
    const data = await res.json();
    alert(data.message);
    fetchAllLead();
    e.target.value = "";
  };

  const sortedLead = [...filtered].sort((a, b) => {
    if (sortOrder === "asc") {
      // console.log(a.name, b.name, a.name.localeCompare(b.name))
      return a.name.localeCompare(b.name);
    }
    if (sortOrder === "desc") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  const totalLead = async () => {
    const res = await fetch(`${BASE_URL}/api/leads/count`);
    const data = await res.json();
    // console.log(data.totalLead);
    setTotalLeads(data.totalLead);
  };

  const newStatusLead = async () => {
    const res = await fetch(`${BASE_URL}/api/leads/new`);
    const data = await res.json();
    setNewStatus(data.newStatus);
  };
  const inteStatusLead = async () => {
    const res = await fetch(`${BASE_URL}/api/leads/interested`);
    const data = await res.json();
    setInteStatus(data.interested);
  };

  const contactedStatus = async () => {
    const res = await fetch(`${BASE_URL}/api/leads/contacted`);
    const data = await res.json();
    setContactStatus(data.contacted);
  };

  const ClosedWonStatus = async () => {
    const res = await fetch(`${BASE_URL}/api/leads/won`);
    const data = await res.json();
    setWonStatus(data.won);
  };
  const ClosedLostStatus = async () => {
    const res = await fetch(`${BASE_URL}/api/leads/lost`);
    const data = await res.json();
    setLostStatus(data.lost);
  };

  const handleAddLead = async () => {
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



  if (!allLeads) return;
  return (
    <div >
      <div className="md:flex md:justify-between md:items-center ">
        <div>
          <h1 className="md:text-5xl  text-3xl  font-medium">Leads Management</h1>
          <p className="md:py-3 text-sm md:text-xl  py-2 text-gray-600 ">
            manage and track your sales pipeline across all channels.
          </p>
        </div>

        <button
          className="bg-indigo-700 text-white w-full md:w-auto mt-4 px-2 py-2  rounded"
          onClick={() => handleAddLead()}
        >
          + Add Leads
        </button>

      </div>
      <div className="md:my-0 lg:gap-3 gap-5 my-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5   ">
        <TypeOfCard name={"TOTAL LEADS"} leads={totalLeads || 0} />
        <TypeOfCard name={"NEW "} leads={newStatus || 0} />
        <TypeOfCard name={"INTERESTED"} leads={inteStatus || 0} />
        <TypeOfCard name={"CONTACTED"} leads={contactStatus || 0} />
        <TypeOfCard name={"ClOSED WON"} leads={wonStatus || 0} />
        <TypeOfCard name={"ClOSED LOST"} leads={lostStatus || 0} />
      </div>
      <div>
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
      </div>
      <AllLeads
        setSearch={setSearch}
        setAllLeads={setAllLeads}
        filtered={sortedLead}
        allLeads={allLeads}
      />
      {addLeadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm  z-50 flex items-center justify-center ">

          <AddLead setAddLeadModal={setAddLeadModal} addLeadModal={addLeadModal} />
        </div>
      )}
    </div>
  );
};

export default LeadMangement;
