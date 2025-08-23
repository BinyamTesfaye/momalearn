export const mockModerationQueue = [
  {
    id: 1,
    type: 'comment',
    content: 'This campaign is a scam! They never deliver what they promise.',
    reportedBy: 'user123',
    reason: 'False claims and defamation',
    reportedAt: '2023-06-18T14:30:00Z'
  },
  {
    id: 2,
    type: 'update',
    content: 'We\'ve reached our goal! Now offering bonus rewards for extra donations.',
    reportedBy: 'moderator007',
    reason: 'Suspicious external links',
    reportedAt: '2023-06-17T09:15:00Z'
  },
  {
    id: 3,
    type: 'comment',
    content: 'The organizer is known for fraudulent activities in other platforms.',
    reportedBy: 'trusted_user',
    reason: 'Potential defamation without evidence',
    reportedAt: '2023-06-16T16:45:00Z'
  }
];