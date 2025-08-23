import React from 'react';

export default function UserTable({ users }) {
  // Example placeholder users if none provided
  const sampleUsers = users || [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Donor' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Campaign Owner' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Admin' },
  ];

  return (
    <table className="w-full bg-white shadow rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Email</th>
          <th className="p-2 text-left">Role</th>
        </tr>
      </thead>
      <tbody>
        {sampleUsers.map((user) => (
          <tr key={user.id} className="border-b">
            <td className="p-2">{user.name}</td>
            <td className="p-2">{user.email}</td>
            <td className="p-2">{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
