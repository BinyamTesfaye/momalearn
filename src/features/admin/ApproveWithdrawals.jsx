import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaCheck, FaTimes } from 'react-icons/fa';
import { adminAPI } from '../../utils/api';
import WithdrawalCard from './components/WithdrawalCard';

export default function ApproveWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setLoading(true);
        const data = await adminAPI.getWithdrawals('pending');
        setWithdrawals(data);
      } catch (err) {
        setError('Failed to load withdrawal requests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWithdrawals();
  }, []);

  const handleWithdrawalAction = async (id, action) => {
    try {
      await adminAPI.processWithdrawal(id, action);
      setWithdrawals(withdrawals.filter(w => w.id !== id));
    } catch (err) {
      setError(`Failed to ${action} withdrawal: ${err.message}`);
    }
  };

  return (
    <div className="glass p-8 rounded-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Approve Withdrawals
        </h1>
        <p className="text-gray-400 mt-2">Review and approve fund withdrawal requests</p>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="card-futuristic">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </div>
                  <div>
                    <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </div>
                  <div>
                    <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="h-10 bg-gray-700 rounded w-24 mr-2"></div>
                  <div className="h-10 bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : withdrawals.length > 0 ? (
        <div className="space-y-6">
          {withdrawals.map(request => (
            <WithdrawalCard 
              key={request.id}
              request={request}
              onApprove={() => handleWithdrawalAction(request.id, 'approve')}
              onReject={() => handleWithdrawalAction(request.id, 'reject')}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-green-500 rounded-2xl glass">
          <FaMoneyBillWave className="mx-auto text-5xl mb-4" />
          <h3 className="text-2xl font-bold">No pending withdrawal requests</h3>
          <p className="text-gray-400 mt-2">All withdrawal requests have been processed</p>
        </div>
      )}
    </div>
  );
}