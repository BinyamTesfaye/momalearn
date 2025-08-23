import React from 'react';

export default function ActivityFeed() {
  // Placeholder data
  const activities = [
    { id: 1, message: 'New campaign created', time: '2 hours ago' },
    { id: 2, message: 'User John donated $50', time: '3 hours ago' },
    { id: 3, message: 'Withdrawal request approved', time: '5 hours ago' },
  ];

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-2">Recent Activity</h2>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id} className="border-b py-2">
            <span>{activity.message}</span>
            <span className="text-gray-500 text-sm ml-2">{activity.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
