import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Tooltip, Legend, Cell, } from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4842'];
import { BASE_URL } from "../config/config";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchStatusCount = async () => {
    const res = await fetch(`${BASE_URL}/leads/analytics/summary`);
    const data = await res.json();
    // console.log(data);

    setData(data.byStatus.map((s) => ({
      name: s._id, count: s.count
    })))
    setTotal(data.total);
    // console.log(data.byStatus);
    // console.log(data.total);
  }

  useEffect(() => {
    fetchStatusCount();
  }, [])

  return (
    <div className='h-screen mt-10'>
      <div className='flex gap-4 '>
        <h2 className="font-bold text-2xl">Totle-leads : </h2>
        <p className="bg-gray-100  rounded-full   px-2  border-2 border-gray-300">{total}</p>
      </div>
      <PieChart width={400} height={300}>
        <Pie data={data} dataKey='count' nameKey='name' cx="50%" cy="50%" >
          {data.map((_, i) => < Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  )
}

export default Dashboard