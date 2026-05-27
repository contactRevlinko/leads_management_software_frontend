import React, { useEffect, useState } from "react";
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

const SourceCOLOR = [
  "#FCA5A5",
  "#99F6E4",
  "#FDE68A",
  "#86EFAC",
  "#93C5FD",
  "#D8B4FE",
  "#F9A8D4",
  "#67E8F9",
  "#C4B5FD",
];
const COLORS = [
  "#A5B4FC",
  "#F9A8D4",
  "#FCD34D",
  "#6EE7B7",
  "#93C5FD",
  "#C4B5FD",
  "#FDA4AF",
  "#5EEAD4",
];
const BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [sourceTotal, setSourceTotal] = useState(0);
  const [souceData, setSourceData] = useState([]);

  const fetchStatusCount = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token, "token");
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
        console.log(formattedData, "formattedData");
      }

      console.log(result);
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
      console.log(" source ", result);

      if (res.ok && result.success) {
        const formattedDataSource = result.source.map((s) => ({
          name: s._id || "No Source",
          count: s.count,
        }));
        setSourceData(formattedDataSource);
        setSourceTotal(result.total);
        console.log("formattedData of source ", formattedDataSource);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchStatusCount();
    fetchSource();
  }, []);

  return (
    <div className="min-h-screen mt-10 ">
      <div className="flex gap-4">
        <h2 className="font-bold text-2xl">Total Leads:</h2>
        <p className="bg-gray-100 rounded-full px-2 border-2 border-gray-300">
          {total}
        </p>
      </div>


      <div className="w-full max-w-xl h-[500px] bg-white rounded-2xl mb-20 mt-10 shadow p-5 ">
        <h1 className="text-xl font-bold mb-5">Lead status breakdown</h1>
        <ResponsiveContainer width="100%" height="90%">
          <FunnelChart>
            <Tooltip />

            <Funnel dataKey="count" data={data} isAnimationActive>
              <LabelList
                position="center"
                fill="#000"
                stroke="none"
                dataKey="name"
              />
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Funnel>

          </FunnelChart>

        </ResponsiveContainer>
      </div>

      <div className="bg-white w-full max-w-xl p-5 rounded-xl shadow-md my-10 h-[500px] ">
        <h1 className="text-xl font-bold mb-5">Lead Source Breakdown</h1>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={souceData}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {souceData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={SourceCOLOR[index % SourceCOLOR.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

  );
};

export default Dashboard;
