import React from "react";
import { TrendingUp } from "lucide-react";




const TypeOfCard = ({ name, leads, icon: Icon, color }) => {
  return (
    <div className="flex md:gap-4 gap-2 md:m-1 w-full p-3 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className={`m-2 w-11 h-11 rounded-xl flex items-center justify-center ${color.bg}`}>
        <Icon size={22} className={color.text} />
      </div>

      <div>
        <p className="text-gray-500 text-xs md:text-sm font-medium">
          {name}
        </p>
        <span className="text-2xl font-semibold text-gray-900">
          {leads}
        </span>
      </div>
    </div>
  );
};

export default TypeOfCard;