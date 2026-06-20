

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const CustomDropDown = ({ value, options, onChange }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const buttonRef = useRef(null);
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
        typeof value === "object" && value !== null ? getLabel(value) : value;

    const openDropdown = () => {
        if (showOptions) {
            setShowOptions(false);
            return;
        }

        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownHeight = Math.min(options.length * 40 + 16, 220);
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUpward = spaceBelow < dropdownHeight;

        setDropdownStyle({
            position: "fixed",
            left: rect.left,
            width: Math.max(rect.width, 160),
            zIndex: 99999,
            ...(openUpward
                ? { bottom: window.innerHeight - rect.top + 4 }
                : { top: rect.bottom + 4 }),
        });

        setShowOptions(true);
    };

    useEffect(() => {
        if (!showOptions) return;

        const handleClickOutside = (e) => {
            if (
                buttonRef.current?.contains(e.target) ||
                dropdownRef.current?.contains(e.target)
            ) return;
            setShowOptions(false);
        };

        const handleScroll = (e) => {
            // Don't close if scrolling inside the dropdown itself
            if (dropdownRef.current?.contains(e.target)) return;
            setShowOptions(false);
        };

        setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("scroll", handleScroll, true);
        }, 50);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("scroll", handleScroll, true);
        };
    }, [showOptions]);

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                type="button"
                onClick={openDropdown}
                className={`
          ${displayValue ? "bg-indigo-50" : "bg-white"}
          border border-gray-300 text-sm
          rounded-md min-w-24 lg:min-w-36 lg:py-2 py-1 w-full
          cursor-pointer
        `}
            >
                {displayValue || "Select"}
            </button>

            {showOptions &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        style={dropdownStyle}
                        className="
              bg-white
              border border-indigo-100
              rounded-2xl
              shadow-xl
              py-2
              overflow-y-auto
              max-h-[220px]
            "
                    >
                        {options.map((item, i) => (
                            <div
                                key={i}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onChange(getValue(item));
                                    setShowOptions(false);
                                }}
                                className="px-4 py-2 cursor-pointer hover:bg-indigo-50 text-sm"
                            >
                                {getLabel(item)}
                            </div>
                        ))}
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default CustomDropDown;