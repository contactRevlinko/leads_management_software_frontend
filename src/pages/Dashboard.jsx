import {
  ChartNoAxesCombined,
  ChartPie,
  FunnelIcon,
  HeartHandshake,
  SunMedium,
  Users,
  Plus,
  Link2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import SqureCard from "../componenets/SqureCard";
import AddLead from "../pages/AddLead"
import {
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import CustomFunnelTooltip from "../componenets/CustonToolTip";

const fixedColors = {
  Instagram: "#E1306C",
  Whatsapp: "#25D366",
  Referral: "#F59E0B",
};

const colorMap = {};

const getColorFromString = (str = "") => {
  if (colorMap[str]) return colorMap[str];

  const goldenAngle = 137.508;

  const keys = Object.keys(colorMap);
  const index = keys.length;

  const hue = (index * goldenAngle) % 360;

  const color = `hsl(${hue}, 70%, 50%)`;

  colorMap[str] = color;

  return color;
};
export const STATUS_COLORS = {
  New: "#6366F1",         
  Hot: "#EF4444",         
  Warm: "#F59E0B",        
  Cold: "#06B6D4",         
  Contacted: "#8B5CF6",    
  Interested: "#EC4899",   
  "Closed Won": "#10B981", 
  "Closed Lost": "#6B7280", 
  "No Status": "#CBD5E1",
};

const BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [souceData, setSourceData] = useState([]);

  const [warm, setWarm] = useState(0);
  const [inteStatus, setInteStatus] = useState(0);
  const [wonStatus, setWonStatus] = useState(0);

  const fetchStatusCount = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/leads/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        const formattedData = result.byStatus.map((s) => ({
          name: s._id || "No Status",
          count: s.count,
        }));

        setTotal(result.total);
        setData(formattedData);

        const warmLead =
          formattedData.find((item) => item.name === "Warm")?.count || 0;

        const interestedLead =
          formattedData.find((item) => item.name === "Interested")?.count || 0;

        const wonLead =
          formattedData.find((item) => item.name === "Closed Won")?.count || 0;

        setWarm(warmLead);
        setInteStatus(interestedLead);
        setWonStatus(wonLead);
      }
    } catch (err) {
      console.log("Dashboard API error:", err);
    }
  };

  const fetchSource = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/leads/source`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        const formattedDataSource = result.source.map((s) => ({
          name: s._id || "No Source",
          count: s.count,
        }));

        setSourceData(formattedDataSource);
      }
    } catch (err) {
      console.log("Source API error:", err);
    }
  };

  useEffect(() => {
    fetchStatusCount();
    fetchSource();
  }, []);

  const conversionRate =
    total > 0 ? ((wonStatus / total) * 100).toFixed(1) : 0;

  const cardData = [
    {
      name: "TOTAL LEADS",
      leads: total,
      icon: Users,
      color: { bg: "bg-indigo-50", text: "text-indigo-600" },
    },
    {
      name: "WARM",
      leads: warm,
      icon: SunMedium,
      color: { bg: "bg-orange-50", text: "text-orange-600" },
    },
    {
      name: "INTERESTED",
      leads: inteStatus,
      icon: HeartHandshake,
      color: { bg: "bg-pink-50", text: "text-pink-600" },
    },
    {
      name: "CONVERSION RATE",
      leads: `${conversionRate}%`,
      icon: ChartNoAxesCombined,
      color: { bg: "bg-emerald-50", text: "text-emerald-600" },
    },
  ];

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Analytics Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track lead performance, sources, and conversion trends in real time
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cardData.map((card) => (
          <SqureCard
            key={card.name}
            name={card.name}
            leads={card.leads}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Lead Status Breakdown Card */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 shrink-0">
              <FunnelIcon className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800">
                Lead Status Breakdown
              </h2>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mt-0.5">
                Funnel view of current lead stages
              </p>
            </div>
          </div>

          <div className="h-[400px] flex items-center justify-center">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip content={<CustomFunnelTooltip />} />
                  <Funnel dataKey="count" data={data} isAnimationActive>
                    <LabelList
                      position="center"
                      fill="#111827"
                      stroke="none"
                      dataKey="name"
                      style={{ fontSize: '12px', fontWeight: '500' }}
                    />
                    {data.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={STATUS_COLORS[entry.name] || "#CBD5E1"}
                      />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                  <FunnelIcon className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  No lead data yet
                </h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Once you start adding leads, you'll see the funnel breakdown of all stages here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lead Source Breakdown Card */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50 shrink-0">
              <ChartPie className="h-5 w-5 text-pink-600" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800">
                Lead Source Breakdown
              </h2>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mt-0.5">
                Distribution of leads by source
              </p>
            </div>
          </div>

          <div className="h-[400px] w-full flex items-center justify-center overflow-hidden">
            {souceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <Pie
                    data={souceData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {souceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getColorFromString(entry.name)}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center mb-4">
                  <ChartPie className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  No source data yet
                </h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Source distribution analysis will be visible once leads are populated.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;