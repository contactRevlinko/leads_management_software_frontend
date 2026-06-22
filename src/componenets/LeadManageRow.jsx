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
    rounded-3xl z-20 relative
    shadow-sm
    mt-6 p-5 md:p-6
    overflow-visible
  "
    >
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        {/* Left Filters */}
        <div className="grid grid-cols-2 md:flex md:flex-row md:items-end gap-4 flex-1">
          {/* Status */}
          <div className="col-span-1 md:flex-none md:w-[180px]">
            <p className="text-slate-500 text-xs md:text-sm font-medium mb-1.5">Status</p>
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

          {/* Priority */}
          <div className="col-span-1 md:flex-none md:w-[150px]">
            <p className="text-slate-500 text-xs md:text-sm font-medium mb-1.5">Priority</p>
            <CustomDropDown
              options={["All", "High", "Medium", "Low"]}
              value={priorityFilter}
              onChange={setPriorityFilter}
            />
          </div>

          {/* Date */}
          <div className="col-span-2 md:flex-none md:w-[180px]">
            <p className="text-slate-500 text-xs md:text-sm font-medium mb-1.5">Date</p>
            <CustomCalendar
              value={selectDate}
              onChange={(date) => setSelectDate(date)}
              placeholder="Select Date"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="grid grid-cols-2 md:flex md:flex-row gap-3 mt-4 pt-4 border-t border-slate-100 lg:mt-0 lg:pt-0 lg:border-t-0 md:gap-4 md:items-end">
          {/* Sort */}
          <div className="relative col-span-1" ref={sortRef}>
            <button
              onClick={() => setOpenSort((prev) => !prev)}
              className="
                w-full md:w-auto h-11 px-4 rounded-xl
                flex items-center justify-center gap-2
                text-sm font-semibold text-slate-700 bg-slate-50/50
                border border-slate-200/80
                hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200
                transition-all duration-200
              "
            >
              <ChartNoAxesGantt size={16} />
              <span>Sort</span>
            </button>

            {openSort && (
              <div
                className="
                  absolute left-0 right-0 md:left-auto md:right-0 top-13 z-30
                  md:w-36 bg-white
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
              col-span-1 h-11 px-4 rounded-xl
              flex items-center justify-center gap-2
              text-sm font-semibold text-slate-700 bg-slate-50/50
              border border-slate-200/80
              hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200
              transition-all duration-200
            "
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadManageRow;