import React from 'react'

const squreCard = ({ name, leads, icon: Icon, color }) => {
    const accentBgClass = color.text ? color.text.replace('text-', 'bg-') : 'bg-indigo-500';

    return (
        <div className="group relative bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-300 overflow-hidden">
            {/* Left Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentBgClass}`} />

            <div className="flex items-start justify-between relative z-10">
                <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{name}</p>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{leads}</h2>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color.bg} shrink-0`}>
                    <Icon className={`h-5 w-5 ${color.text}`} strokeWidth={2.2} />
                </div>
            </div>

            {/* Background Watermark Icon */}
            <div className="absolute -right-4 -bottom-6 text-slate-100 opacity-[0.5] group-hover:opacity-[0.7] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 pointer-events-none">
                <Icon className="h-24 w-24 stroke-[0.8]" />
            </div>
        </div>
    );
};

export default squreCard