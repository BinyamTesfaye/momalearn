import React from 'react';
import { FaExclamationTriangle, FaCheck, FaTimes, FaClock } from 'react-icons/fa';

const FraudAlert = ({ alerts, onResolve, onDismiss }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="text-center py-12 text-green-500 rounded-2xl glass">
        <FaCheck className="mx-auto text-5xl mb-4" />
        <h3 className="text-2xl font-bold">No Active Fraud Alerts</h3>
        <p className="text-gray-400 mt-2">Your platform is secure</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map(alert => (
        <div key={alert.id} className="card-futuristic">
          <div className="card-header flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-red-500/20 rounded-full">
                <FaExclamationTriangle className="text-red-400" />
              </div>
              <div>
                <h3 className="font-bold">Fraud Alert</h3>
                <p className="text-gray-400 text-sm">
                  Type: {alert.type} | Severity: {alert.severity}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
              Active
            </span>
          </div>

          <div className="card-body">
            <div className="mb-4">
              <p className="text-gray-400 mb-1">Details:</p>
              <p className="bg-gray-800/50 p-4 rounded-lg italic">
                {alert.details}
              </p>
            </div>

            <div className="flex items-center text-gray-400 mb-4">
              <FaClock className="mr-2" />
              Detected: {new Date(alert.detectedAt).toLocaleString()}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="btn-futuristic bg-gray-600 hover:bg-gray-700"
                onClick={() => onDismiss(alert.id)}
              >
                <FaTimes className="mr-2" /> Dismiss
              </button>
              <button
                className="btn-futuristic bg-green-500 hover:bg-green-600"
                onClick={() => onResolve(alert.id)}
              >
                <FaCheck className="mr-2" /> Resolve
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FraudAlert;
