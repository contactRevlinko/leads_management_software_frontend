import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
const BASE_URL = import.meta.env.VITE_API_URL;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4842"];


const Dashboard = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchStatusCount = async () => {
    try {
      const token = localStorage.getItem("token")
      console.log(token , "token")
      const res = await fetch(`${BASE_URL}/leads/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setData(
          result.byStatus.map((s) => ({
            name: s._id || "No Status",
            count: s.count,
          }))
        );
        setTotal(result.total);
      }
      console.log(result.total)
    } catch (err) {
      console.log("Dashboard API error:", err);
    }
  };

  useEffect(() => {
    fetchStatusCount();
  }, []);

  return (
    <div className="min-h-screen mt-10">
      <div className="flex gap-4">
        <h2 className="font-bold text-2xl">Total Leads:</h2>
        <p className="bg-gray-100 rounded-full px-2 border-2 border-gray-300">
          {total}
        </p>
      </div>

      <PieChart width={400} height={300}>
        <Pie data={data} dataKey="count" nameKey="name" cx="50%" cy="50%">
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default Dashboard;