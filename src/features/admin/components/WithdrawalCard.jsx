import React from 'react';

export default function WithdrawalCard({ user, amount, status }) {
  return (
    <div className="bg-white shadow p-4 rounded-lg flex justify-between items-center mb-2">
      <div>
        <p className="font-bold">{user}</p>
        <p>${amount}</p>
      </div>
      <div>
        <span className={`px-2 py-1 rounded ${
          status === 'approved' ? 'bg-green-100 text-green-700' :
          status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}
