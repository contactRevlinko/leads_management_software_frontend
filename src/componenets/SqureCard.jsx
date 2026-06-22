import React from 'react'

const squreCard = ({ name, leads, icon: Icon, color }) => {
        return (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-5">
                    <div
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${color.bg}`}
                    >
                        <Icon className={`h-8 w-8 ${color.text}`} />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{name}</p>
                        <h2 className="mt-2 text-4xl font-bold text-slate-900">{leads}</h2>
                    </div>
                </div>
            </div>
        );
    };

export default squreCard