import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
const Home = () => {
  const [showCampaigns, setShowCampaigns] = useState(true);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [donationData, setDonationData] = useState({
    name: '',
    anonymous: false,
    amount: 25
  });

  const campaigns = [
    {
      id: 1,
      title: "Education for Disable students",
      description: "Providing school supplies and safe transportation for girls in rural Afghanistan",
      progress: 85,
      raised: 12450,
      goal: 16000,
      image: "education"
    },
    {
      id: 2,
      title: "Clean Water Initiative",
      description: "Building water wells in drought-affected villages",
      progress: 65,
      raised: 32500,
      goal: 50000,
      image: "water"
    },
    {
      id: 3,
      title: "Emergency Food Relief",
      description: "Providing food packages to families affected by conflict",
      progress: 45,
      raised: 18000,
      goal: 40000,
      image: "food"
    }
  ];

  const handleDonationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonationData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submitDonation = (e) => {
    e.preventDefault();
    alert(`Thank you for your donation of $${donationData.amount} to ${activeCampaign.title}!`);
    setActiveCampaign(null);
    setDonationData({ name: '', anonymous: false, amount: 25 });
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen">
      {/* Hero Section */}
      <div className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Connecting <span className="text-white">Hearts</span> to Those in Need
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Erteban bridges compassion with action. Our platform connects donors with verified causes, 
            ensuring your contributions create maximum impact where it's needed most.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setShowCampaigns(!showCampaigns)}
              className="btn-primary"
            >
              {showCampaigns ? "Hide Campaigns" : "Show Campaigns"}
            </button>
            <Link to="/donate" className="btn-secondary">
              Donate Now
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="py-12 bg-gray-800/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-400 mb-3">24K+</div>
              <div className="text-gray-400 uppercase tracking-wider">Donations</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-purple-400 mb-3">$1.2M+</div>
              <div className="text-gray-400 uppercase tracking-wider">Raised</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-pink-400 mb-3">86</div>
              <div className="text-gray-400 uppercase tracking-wider">Campaigns</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-400 mb-3">32</div>
              <div className="text-gray-400 uppercase tracking-wider">Communities</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Campaigns - Dropdown Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10 cursor-pointer" onClick={() => setShowCampaigns(!showCampaigns)}>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Featured <span className="text-purple-400">Campaigns</span>
              <span className="ml-4 text-xl text-gray-400">{showCampaigns ? '▲' : '▼'}</span>
            </h2>
            <button className="text-blue-400 hover:text-blue-300">
              View All →
            </button>
          </div>
          
          {showCampaigns && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map(campaign => (
                <div 
                  key={campaign.id} 
                  className="campaign-card group"
                  onClick={() => setActiveCampaign(campaign)}
                >
                  <div className={`campaign-image bg-${campaign.image}`}></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {campaign.title}
                    </h3>
                    <p className="text-gray-400 mb-5 min-h-[60px]">
                      {campaign.description}
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-blue-400">${campaign.raised.toLocaleString()} raised</span>
                        <span className="text-purple-400">{campaign.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                          style={{ width: `${campaign.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-pink-400 font-bold">
                        ${(campaign.goal - campaign.raised).toLocaleString()} to go
                      </span>
                      <button 
                        className="text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCampaign(campaign);
                        }}
                      >
                        Donate Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            How <span className="text-blue-400">Erteban</span> Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { 
                title: "Choose a Cause", 
                desc: "Browse verified campaigns and select one that resonates with you",
                icon: "🔍"
              },
              { 
                title: "Donate Securely", 
                desc: "Contribute any amount with our encrypted payment system",
                icon: "💳"
              },
              { 
                title: "Track Impact", 
                desc: "Follow real-time updates on how your donation is making a difference",
                icon: "📊"
              },
              { 
                title: "Spread Hope", 
                desc: "Share campaigns and inspire others to join the movement",
                icon: "❤️"
              }
            ].map((step, index) => (
              <div key={index} className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 hover:border-purple-500 transition-all">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Donation Modal */}
      {activeCampaign && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">
                  Donate to {activeCampaign.title}
                </h3>
                <button 
                  onClick={() => setActiveCampaign(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-400 mt-2">
                Your contribution will help: {activeCampaign.description}
              </p>
            </div>
            
            <form onSubmit={submitDonation} className="p-6">
              <div className="mb-6">
                <label className="block text-gray-300 mb-3">Donation Amount ($)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      className={`py-3 rounded-lg font-medium ${
                        donationData.amount == amount
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => setDonationData({...donationData, amount})}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={donationData.amount}
                    onChange={(e) => setDonationData({...donationData, amount: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <input
                    id="anonymous"
                    name="anonymous"
                    type="checkbox"
                    className="h-5 w-5 text-purple-500 rounded focus:ring-purple-500"
                    checked={donationData.anonymous}
                    onChange={handleDonationChange}
                  />
                  <label htmlFor="anonymous" className="ml-3 text-gray-300">
                    Donate anonymously
                  </label>
                </div>
                
                {!donationData.anonymous && (
                  <div>
                    <label className="block text-gray-300 mb-2">Your Name (Optional)</label>
                    <input
                      type="text"
                      name="name"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="John Doe"
                      value={donationData.name}
                      onChange={handleDonationChange}
                    />
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Donate ${donationData.amount}
              </button>
              
              <p className="text-gray-500 text-sm mt-4 text-center">
                Your donation is secure and 100% goes to the cause
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;