import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpDown,
  Download,
  SlidersHorizontal,
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border border-slate-200/60 rounded-xl mt-5 px-4 py-3 relative z-20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left — Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <SlidersHorizontal size={14} strokeWidth={2} />
            <span className="text-xs font-medium uppercase tracking-wide hidden sm:inline">Filters</span>
          </div>

          <div className="w-px h-5 bg-slate-200 hidden sm:block" />

          {/* Status */}
          <div className="min-w-[140px]">
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
          <div className="min-w-[120px]">
            <CustomDropDown
              options={["All", "High", "Medium", "Low"]}
              value={priorityFilter}
              onChange={setPriorityFilter}
            />
          </div>

          {/* Date */}
          <div className="min-w-[150px]">
            <CustomCalendar
              value={selectDate}
              onChange={(date) => setSelectDate(date)}
              placeholder="Select Date"
            />
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2">
          {/* Sort */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setOpenSort((prev) => !prev)}
              className="h-9 px-3 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200/80 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-150"
            >
              <ArrowUpDown size={13} />
              <span>Sort</span>
            </button>

            {openSort && (
              <div className="absolute right-0 top-11 w-32 bg-white border border-slate-200 rounded-lg shadow-lg p-1 z-30">
                <button
                  onClick={() => { setSortOrder("asc"); setOpenSort(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  A → Z
                </button>
                <button
                  onClick={() => { setSortOrder("desc"); setOpenSort(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  Z → A
                </button>
              </div>
            )}
          </div>

          {/* Export */}
          <button
            onClick={handleExportExcel}
            className="h-9 px-3 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200/80 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all duration-150"
          >
            <Download size={13} />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadManageRow;