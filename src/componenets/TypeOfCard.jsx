import React from "react";

const TypeOfCard = ({ name, leads, icon: Icon, color }) => {
  return (
    <div className="group relative flex items-center gap-3.5 w-full px-4 py-3.5 bg-white rounded-xl border border-slate-200/60 hover:border-slate-300/80 hover:shadow-sm transition-all duration-200 cursor-default overflow-hidden">
      {/* Colored accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl ${color.bg.replace('100', '400')}`} />
      
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color.bg} shrink-0`}>
        <Icon size={17} className={color.text} strokeWidth={2.2} />
      </div>

      <div className="min-w-0">
        <h2 className="text-xl font-bold text-slate-900 leading-none tabular-nums">
          {leads}
        </h2>
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mt-1 truncate">
          {name}
        </p>
      </div>
    </div>
  );
};

export default TypeOfCard;