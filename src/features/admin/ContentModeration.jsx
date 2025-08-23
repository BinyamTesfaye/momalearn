// src/features/admin/ContentModeration.jsx
import React, { useState } from 'react';
import ModerationQueue from '../../components/admin/ModerationQueue';

const ContentModeration = () => {
  const [queue, setQueue] = useState([
    {
      id: 1,
      type: 'campaign_update',
      content: 'Added new stretch goals to the campaign...',
      reportedBy: 'user123',
      reason: 'Suspicious external links'
    },
    // ... more items
  ]);

  const handleApprove = (id) => {
    setQueue(queue.filter(item => item.id !== id));
    // API call to approve content
  };

  const handleReject = (id) => {
    setQueue(queue.filter(item => item.id !== id));
    // API call to reject/remove content
  };

  return (
    <div className="content-moderation">
      <h1 className="text-2xl font-bold mb-6">Content Moderation</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ModerationQueue 
            items={queue}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Moderation Guidelines</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Check for prohibited content (hate speech, illegal activities)</li>
            <li>Verify external links are safe and relevant</li>
            <li>Ensure personal information is not exposed</li>
            <li>Confirm campaign updates align with original purpose</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContentModeration;