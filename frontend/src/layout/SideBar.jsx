import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Patients', path: '/patients', icon: '👥' },
    { name: 'Chambres', path: '/chambres', icon: '🛏️' },
      {name:'Affectations', path:'/affectations', icon:'🔄'},
    { name: 'Personnel', path: '/personnel', icon: '👨‍⚕️' },

  
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 shadow-xl">
      <div className="p-6 text-xl font-bold tracking-wider border-b border-slate-800 text-indigo-400">
        HOSPIT-ALGO
      </div>
      
      <nav className="flex-1 mt-4 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  location.pathname === item.path 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        v1.0 - Système de Test PRAP
      </div>
    </div>
  );
};

export default Sidebar;