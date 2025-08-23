import React from "react";
import { Link } from "react-router-dom";

const mock = [
  { id: "school-supplies", title: "School Supplies for Rural Kids", progress: 65 },
  { id: "clean-water", title: "Clean Water Initiative", progress: 40 },
  { id: "relief-fund", title: "Disaster Relief Fund", progress: 80 },
];

export default function Campaigns() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">All Campaigns</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mock.map(c => (
          <Link key={c.id} to={`/campaigns/${c.id}`} className="bg-white shadow rounded p-5 hover:shadow-md transition">
            <h3 className="font-semibold">{c.title}</h3>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{width: `${c.progress}%`}} />
            </div>
            <p className="text-sm mt-1 text-gray-600">{c.progress}% funded</p>
          </Link>
        ))}
      </div>
    </>
  );
}
