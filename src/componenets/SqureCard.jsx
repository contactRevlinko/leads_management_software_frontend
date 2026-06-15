import React from 'react'

const squreCard = ({ name, leads, icon: Icon, color }) => {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-5">
                    <div
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${color.bg}`}
                    >
                        <Icon className={`h-8 w-8 ${color.text}`} />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-500">{name}</p>
                        <h2 className="mt-2 text-4xl font-bold text-slate-900">{leads}</h2>
                    </div>
                </div>

            
            </div>
        );
    };

export default squreCard