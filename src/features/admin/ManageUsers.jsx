import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserPlus, FaEdit, FaTrash, FaLock, FaUnlock } from 'react-icons/fa';
import { adminAPI } from '../../utils/api';
import UserTable from './components/UserTable';
import Pagination from '@/components/ui/Pagination';
import UserModal from './components/UserModal';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await adminAPI.getUsers(currentPage, PAGE_SIZE);
        setUsers(data.users);
        setFilteredUsers(data.users);
        setTotalPages(Math.ceil(data.totalCount / PAGE_SIZE));
      } catch (err) {
        setError('Failed to load users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await adminAPI.updateUser(userId, { status: newStatus });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (err) {
      setError(`Failed to update user status: ${err.message}`);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      await adminAPI.updateUser(updatedUser.id, updatedUser);
      
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      
      setIsModalOpen(false);
    } catch (err) {
      setError(`Failed to update user: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.updateUser(userId, { status: 'deleted' });
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError(`Failed to delete user: ${err.message}`);
      }
    }
  };

  return (
    <div className="glass p-8 rounded-3xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Manage Users
          </h1>
          <p className="text-gray-400 mt-2">View and manage all platform users</p>
        </div>
        
        <button 
          className="btn-futuristic bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
          onClick={() => {
            setSelectedUser(null);
            setIsModalOpen(true);
          }}
        >
          <FaUserPlus className="mr-2" /> Add User
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-6 flex items-center bg-gray-800/50 rounded-full px-4 py-3">
        <FaSearch className="text-gray-500 mr-3" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="w-full bg-transparent border-none focus:outline-none text-white"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <UserTable 
        users={filteredUsers}
        onToggleStatus={toggleUserStatus}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        loading={loading}
      />
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
      {isModalOpen && (
        <UserModal 
          user={selectedUser}
          onSave={handleSaveUser}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}