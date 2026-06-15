import React, { useEffect, useRef, useState } from "react";
import {
  ChartNoAxesGantt,
  Download,
  ListFilter,
  Upload,
  Calendar,
  Flag,
} from "lucide-react";
import CustomDropDown from "./CustomDropDown";
import CustomCalendar from "./CustomCalender";

const LeadManageRow = ({
  filter,
  setFilter,
  selectDate,
  setSelectDate,
  handleExportExcel,
  setSortOrder,

  priorityFilter,
  setPriorityFilter,
}) => {
  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setOpenSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="
        bg-white/90 backdrop-blur-xl
        border border-indigo-100
        rounded-3xl z-50 relative
        shadow-sm
        mt-6 p-4 
      "
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Filters */}
        <div className="flex flex-col md:flex-row lg:gap-14 md:gap-5 flex-1 gap-5">
          {/* Status */}
          <div
            className="
              h-14 flex items-center gap-3
              px-4 rounded-2xl
            
              bg-white
              min-w-[240px]
            "
          >
            <ListFilter size={18} className="text-indigo-600" />

            <div className="flex-1">
              <CustomDropDown
                options={[
                  "All",
                  "New",
                  "Hot",
                  "Warm",
                  "Cold",
                  "Contacted",
                  "Interested",
                  "Closed Won",
                  "Closed Lost",
                ]}
                value={filter}
                onChange={setFilter}
              />
            </div>
          </div>

          {/* Priority */}
          <div
            className="
              h-14 flex items-center gap-3
              px-4 rounded-2xl
           
              bg-white
              min-w-[220px]
            "
          >
            <Flag size={18} className="text-indigo-600" />

            <div className="flex-1">
              <CustomDropDown
                options={["All", "High", "Medium", "Low"]}
                value={priorityFilter}
                onChange={setPriorityFilter}
              />
            </div>
          </div>

          {/* Date */}
          <div
            className="
              h-14 flex items-center gap-3
              px-4 rounded-2xl
          
              bg-white
              min-w-[220px]
            "
          >


            <CustomCalendar
              value={selectDate}
              onChange={(date) => setSelectDate(date)}
              placeholder="Select Date"
            />
          </div>

        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5 md:gap-8 justify-between">
          {/* Sort */}
          <div className="relative" ref={sortRef}>
            
            <button
              onClick={() => setOpenSort((prev) => !prev)}
              className="
                h-12 px-4 rounded-2xl
                flex items-center gap-2
                text-sm font-medium text-slate-700
                hover:bg-indigo-50
                transition
              "
            >
              <ChartNoAxesGantt size={18} />
              <span className="hidden sm:block">Sort</span>
            </button>

            {openSort && (
              <div
                className="
                  absolute right-0 top-14 z-30
                  w-36 bg-white
                  border border-indigo-100
                  rounded-2xl shadow-xl
                  p-2
                "
              >
                <button
                  onClick={() => {
                    setSortOrder("asc");
                    setOpenSort(false);
                  }}
                  className="
                    w-full text-left px-4 py-2
                    text-sm rounded-xl
                    hover:bg-indigo-50
                  "
                >
                  Ascending
                </button>

                <button
                  onClick={() => {
                    setSortOrder("desc");
                    setOpenSort(false);
                  }}
                  className="
                    w-full text-left px-4 py-2
                    text-sm rounded-xl
                    hover:bg-indigo-50
                  "
                >
                  Descending
                </button>
              </div>
            )}
          </div>

         
          {/* Export */}
          <button
            onClick={handleExportExcel}
            className="
              h-12 px-4 rounded-2xl
              flex items-center gap-2
              text-sm font-medium text-slate-700
              hover:bg-indigo-50
              transition
            "
          >
            <Download size={18} />
            <span className="hidden sm:block">Export All Lead
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadManageRow;