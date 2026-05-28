



import React, { useEffect, useRef, useState } from "react";

const CustomDropDown = ({ value, options, onChange }) => {
    const [showOptions, setShowOptions] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="relative overflow-visible ">
            <button
                type="button"
                className="border sm:text-sm lg:text-md border-indigo-200 rounded-lg min-w-24 lg:min-w-36  lg:py-1 py-0  bg-white"
                onClick={() => setShowOptions(!showOptions)}
            >
                {value || "Select"}
            </button>

            {showOptions && (
                <div className="absolute overflow-y-scroll left-0 top-full mt-2  min-w-24  md:min-w-36 bg-white rounded-xl shadow-lg border border-gray-200 z-[9999]">
                    {options.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                onChange(item);
                                setShowOptions(false);
                            }}
                            className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropDown;