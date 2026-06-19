import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

const SourceManager = () => {
    const [name, setName] = useState("");
    const [sources, setSources] = useState([]);
    const token = localStorage.getItem("token");


    const fetchSources = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${BASE_URL}/source/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (data.success) {
                setSources(data.data);
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        fetchSources();
    }, []);

  
    const handleAdd = async () => {
        if (!name) return;

        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${BASE_URL}/source/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();

            if (data.success) {
                setName("");
                fetchSources();
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${BASE_URL}/source/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data.success) {
                setSources((prev) => prev.filter((s) => s._id !== id));
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-md w-full max-w-md">

            {/* INPUT */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter source name"
                    className="flex-1 border p-2 rounded-lg outline-none"
                />

                <button
                    onClick={handleAdd}
                    className="bg-indigo-600 text-white px-4 rounded-lg"
                >
                    Add
                </button>
            </div>

            {/* LIST */}
            <div className="space-y-2">
                {sources.map((item) => (
                    <div
                        key={item._id}
                        className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg"
                    >
                        <span>{item.name}</span>

                        <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SourceManager;