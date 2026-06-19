import React, { useEffect, useRef, useState } from "react";

const CustomDropDown = ({ value, options, onChange }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const dropdownRef = useRef(null);

    const getLabel = (item) => {
        if (typeof item === "object" && item !== null) return item.label || item.name || "";
        return item;
    };

    const getValue = (item) => {
        if (typeof item === "object" && item !== null) return item.value || item._id || "";
        return item;
    };

    const displayValue =
        typeof value === "object" && value !== null
            ? getLabel(value)
            : value;

    const handleDropdownToggle = () => {
        if (dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropdownHeight = Math.min(options.length * 40, 208);
            setOpenUpward(spaceBelow < dropdownHeight);
        }
        setShowOptions(!showOptions);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative overflow-visible">
            <button
                type="button"
                className={`${displayValue ? "bg-indigo-50" : "bg-white"}
        border sm:text-sm lg:text-md border-gray-300
        rounded-md min-w-24 lg:min-w-36 lg:py-2 py-1`}
                onClick={handleDropdownToggle}
            >
                {displayValue || "Select"}
            </button>

            {showOptions && (
                <div
                    className={`absolute left-0 min-w-24 md:min-w-36
          bg-white rounded-xl shadow-lg border border-gray-200
          z-40 max-h-52 overflow-y-auto
          ${openUpward ? "bottom-full mb-2" : "top-full mt-2"}`}
                >
                    {options.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                onChange(getValue(item));
                                setShowOptions(false);
                            }}
                            className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                        >
                            {getLabel(item)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropDown;