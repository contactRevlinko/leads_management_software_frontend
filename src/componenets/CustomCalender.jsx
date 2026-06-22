import { Calendar } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const CustomCalendar = ({
  value,
  onChange,
  name,
  className = "",
  placeholder = "Select date",
  minDate,
  maxDate,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [openRightToLeft, setOpenRightToLeft] = useState(false);

  const [currentDate, setCurrentDate] = useState(
    value ? new Date(value) : new Date()
  );

  const calendarRef = useRef(null);
  const selectedDate = value ? new Date(value) : null;

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const firstDay = new Date(year, currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();

  const formatDate = (date) => date.toLocaleDateString("en-CA");

  const isSameDate = (d1, d2) => {
    if (!d1 || !d2) return false;

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isDisabled = (date) => {
    const current = new Date(formatDate(date));

    if (minDate && current < new Date(minDate)) return true;
    if (maxDate && current > new Date(maxDate)) return true;

    return false;
  };

  const handleOpenCalendar = () => {
    if (disabled) return;

    if (calendarRef.current) {
      const rect = calendarRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const calendarHeight = 360;
      const calendarWidth = 290;

      setOpenUpward(spaceBelow < calendarHeight);
      setOpenRightToLeft(rect.left + calendarWidth > window.innerWidth);
    }

    setOpen((prev) => !prev);
  };

  const handleSelectDate = (day) => {
    const date = new Date(year, currentDate.getMonth(), day);
    const formattedDate = formatDate(date);

    if (isDisabled(date)) return;

    if (name) {
      onChange({
        target: {
          name: name,
          value: formattedDate,
        },
      });
    } else {
      onChange(formattedDate);
    }

    setOpen(false);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  };

  useEffect(() => {
    if (value) {
      setCurrentDate(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={calendarRef} className="relative w-full ">
      <div className="relative">
        <input
          readOnly
          disabled={disabled}
          value={value || ""}
          onClick={handleOpenCalendar}
          placeholder={placeholder}
          className={`w-full border rounded-xl px-3 pr-10 py-2 text-sm outline-none focus:border-indigo-500 cursor-pointer h-11
    ${value ? "bg-indigo-50/50 border-gray-300" : "bg-white border-gray-300"}
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${className}
  `}
        />

        <Calendar
          size={18}
          onClick={handleOpenCalendar}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
        />
      </div>

      {open && (
        <div
          className={`
    absolute z-[99999] w-[290px] rounded-2xl bg-white p-3
    shadow-2xl border border-gray-200
    ${openUpward ? "bottom-12" : "top-12"}
    ${openRightToLeft ? "right-0" : "left-0"}
  `}
        
        >
          <div className="absolute inset-0 bg-white rounded-2xl -z-10" />

          <div
            className={`
              absolute w-4 h-4 bg-white rotate-45 border-gray-200
              ${openRightToLeft ? "right-10" : "left-10"}
              ${openUpward
                ? "-bottom-2 border-r border-b"
                : "-top-2 border-l border-t"
              }
            `}
          />

          <div className="flex items-center justify-between bg-indigo-600 rounded-xl px-3 py-2 mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg bg-white/20 text-white hover:bg-white/30"
            >
              ‹
            </button>

            <p className="font-semibold text-white text-sm">
              {monthName} {year}
            </p>

            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg bg-white/20 text-white hover:bg-white/30"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2 bg-white">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm bg-white">
            {Array.from({ length: firstDay }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const date = new Date(year, currentDate.getMonth(), day);
              const active = isSameDate(date, selectedDate);
              const disabledDate = isDisabled(date);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabledDate}
                  onClick={() => handleSelectDate(day)}
                  className={`
                    h-9 w-9 mx-auto rounded-lg transition
                    ${active ? "bg-indigo-600 text-white" : "text-gray-700"}
                    ${!active && !disabledDate
                      ? "hover:bg-indigo-100 hover:text-indigo-700"
                      : ""
                    }
                    ${disabledDate
                      ? "text-gray-300 cursor-not-allowed"
                      : ""
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;