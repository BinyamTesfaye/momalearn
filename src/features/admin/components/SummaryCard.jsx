import React from 'react';
import { Link } from 'react-router-dom';

const SummaryCard = ({ 
  icon, 
  title, 
  value, 
  change, 
  path, 
  btnText, 
  highlight,
  onClick
}) => (
  <div 
    className={`card-futuristic h-full ${highlight ? 'border-l-4 border-yellow-400' : ''} ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    <div className="card-content flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium text-lg">{title}</h3>
        <div>{icon}</div>
      </div>
      
      <div className="mt-auto flex items-end justify-between">
        <p className={`text-3xl font-bold ${highlight ? 'text-yellow-400' : ''}`}>
          {value ?? '0'}
        </p>
        
        {path && btnText && (
          <Link 
            to={path}
            className={`btn-futuristic px-4 py-2 text-sm ${
              highlight 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {btnText}
          </Link>
        )}
        
        {change && !path && (
          <p className="text-green-400 text-sm">{change}</p>
        )}
      </div>
    </div>
  </div>
);

export default SummaryCard;