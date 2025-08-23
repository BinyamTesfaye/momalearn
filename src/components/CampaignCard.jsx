import React from "react";

export default function CampaignCard({ image, title, description, progress }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-blue-900">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{progress}% funded</p>
        </div>
        <a href="/donate" className="block mt-4 bg-blue-900 text-white text-center py-2 rounded-lg hover:bg-blue-800">
          Donate
        </a>
      </div>
    </div>
  );
}
