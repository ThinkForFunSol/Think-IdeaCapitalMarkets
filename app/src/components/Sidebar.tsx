import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaUser, FaPlus } from 'react-icons/fa'; 

const Sidebar: React.FC = () => {
  return (
    <div style={{ width: '200px', background: '#f0f0f0', height: '100vh', padding: '20px' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><Link to="/"><FaHome /> Home</Link></li>
        <li><Link to="/marketplace"><FaShoppingCart /> Marketplace</Link></li>
        <li><Link to="/create"><FaPlus /> Create Idea</Link></li>
        <li><Link to="/profile"><FaUser /> Profile</Link></li>
        {}
      </ul>
    </div>
  );
};

export default Sidebar;
