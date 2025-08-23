// src/features/admin/components/CampaignFilters.jsx
import React from 'react';

export default function CampaignFilters({ filters, onFilterChange }) {
  const handleStatusChange = (e) => {
    onFilterChange({ ...filters, status: e.target.value });
  };

  return (
    <div className="flex gap-4 mb-4">
      <select
        value={filters.status}
        onChange={handleStatusChange}
        className="border px-2 py-1 rounded"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="paused">Paused</option>
        <option value="completed">Completed</option>
      </select>
      {/* Add more filters as needed */}
    </div>
  );
}
