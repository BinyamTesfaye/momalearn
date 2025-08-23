import React from 'react';
import { FaCheck, FaTimes, FaUser, FaExclamationTriangle, FaClock } from 'react-icons/fa';

const ModerationQueue = ({ items, onApprove, onReject }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-green-500 rounded-2xl glass">
        <FaCheck className="mx-auto text-5xl mb-4" />
        <h3 className="text-2xl font-bold">Moderation Queue is Empty</h3>
        <p className="text-gray-400 mt-2">All content has been reviewed</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.id} className="card-futuristic">
          <div className="card-header flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-yellow-500/20 rounded-full">
                {item.type === 'comment' ? <FaUser className="text-yellow-400" /> : <FaExclamationTriangle className="text-yellow-400" />}
              </div>
              <div>
                <h3 className="font-bold">
                  {item.type === 'comment' ? 'Comment' : 'Campaign Update'} Moderation
                </h3>
                <p className="text-gray-400 text-sm">
                  Reported by: {item.reportedBy}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
              Pending
            </span>
          </div>
          
          <div className="card-body">
            <div className="mb-4">
              <p className="text-gray-400 mb-1">Content:</p>
              <p className="bg-gray-800/50 p-4 rounded-lg italic">
                {item.content}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-400">Reason</p>
                <p className="text-white">{item.reason}</p>
              </div>
              <div>
                <p className="text-gray-400">Reported At</p>
                <p className="text-white flex items-center">
                  <FaClock className="mr-2 text-gray-400" />
                  {new Date(item.reportedAt).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="btn-futuristic bg-red-500 hover:bg-red-600"
                onClick={() => onReject(item.id)}
              >
                <FaTimes className="mr-2" /> Reject
              </button>
              <button 
                className="btn-futuristic bg-green-500 hover:bg-green-600"
                onClick={() => onApprove(item.id)}
              >
                <FaCheck className="mr-2" /> Approve
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModerationQueue;