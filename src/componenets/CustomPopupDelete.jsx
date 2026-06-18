import React from "react";
import { BadgeInfo } from "lucide-react";
const CustomPopupDelete = ({ onClose, onDelete }) => {


    return (
        <div className="fixed bg-black/5 inset-0 backdrop-blur-sm z-50 flex items-center justify-center  " >

            <div className="bg-white lg:w-[23%] md:w-[55%] w-[90%] text-center p-6 rounded-xl " >
                <BadgeInfo className="text-center mb-2 w-10 p-2 h-10 rounded-full m-auto text-red-700 bg-red-200 " />
                <h1 className="font-bold text-xl text-gray-700">Delete This Item ? </h1>
                <p className="text-gray-600 text-md">Are you sure do you want to delete this element ? </p>
                <p className="text-gray-600 text-md">This action is final.</p>

                <div className="flex gap-4 my-4 justify-between w-full">
                    <button
                        onClick={onClose}
                        className="bg-white border w-full border-gray-400 px-4 py-2 rounded-xl"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onDelete}
                        className="bg-red-500 px-4 py-2 w-full rounded-xl text-white"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomPopupDelete;
