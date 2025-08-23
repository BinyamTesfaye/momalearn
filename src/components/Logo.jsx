import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/erteban-logo.jpg'; 
export default function Logo({ size = 'md' }) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };
  return (
    <Link to="/" className="flex items-center">
      {/* Replace with your actual logo path */}
      <img 
        src="/src/assets/logo/ertaban-logo.png" 
        alt="Erteban Logo"
        className="h-10 w-auto" // Adjust size as needed
      />
      {/* Optional: If you want to keep text next to logo */}
      <span className="ml-3 text-2xl font-bold text-blue-900 hidden md:block">
        Erteban
      </span>
    </Link>
  );
}