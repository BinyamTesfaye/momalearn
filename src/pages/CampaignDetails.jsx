import React from "react";
import { useParams } from "react-router-dom";

export default function CampaignDetails() {
  const { id } = useParams();
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h1 className="text-2xl font-bold capitalize">{id.replaceAll("-", " ")}</h1>
      <p className="mt-2 text-gray-600">Campaign detailed info goes here…</p>
      <button id="donate" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
        Donate
      </button>
    </div>
  );
}
