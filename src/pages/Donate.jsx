import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Donate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaignId] = useState(location.state?.campaignId || "");
  const [amount, setAmount] = useState(10);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate donation processing
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      
      // Redirect to thank you page after 3 seconds
      setTimeout(() => {
        navigate("/campaigns");
      }, 3000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <h2 className="text-2xl font-bold mb-2">Thank You for Your Donation!</h2>
          <p className="text-gray-600 mb-6">
            Your contribution of ${amount} has been successfully processed.
          </p>
          <button 
            onClick={() => navigate("/campaigns")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Make a Donation</h2>
        
        {campaignId && (
          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <p className="text-blue-800">You're donating to: <span className="font-semibold">Campaign #{campaignId}</span></p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Donation Amount ($)</label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 25, 50, 100].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`py-2 rounded-md border ${
                    amount === value 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setAmount(value)}
                >
                  ${value}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <input
                type="number"
                min="1"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          </div>
          
          {!user && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Create an account to track your donations, or donate as a guest.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-600"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">Donate anonymously</span>
            </label>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Message (Optional)</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="3"
              placeholder="Add a message of support..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              isProcessing ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isProcessing ? "Processing..." : "Donate Now"}
          </button>
        </form>
      </div>
    </div>
  );
}