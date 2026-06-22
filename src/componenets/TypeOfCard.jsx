import React from "react";
import { TrendingUp } from "lucide-react";




const TypeOfCard = ({ name, leads, icon: Icon, color }) => {
  return (
    <div className="flex items-center gap-4 w-full p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.bg}`}>
        <Icon size={22} className={color.text} />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          {name}
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          {leads}
        </h2>
      </div>
    </div>
  );
};

export default TypeOfCard;