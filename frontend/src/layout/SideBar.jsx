import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BedIcon from '@mui/icons-material/Bed';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'; // Pour les affectations
import BadgeIcon from '@mui/icons-material/Badge'; // Pour le personnel
const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
  { name: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { name: 'Patients', path: '/patients', icon: <PeopleIcon /> },
  { name: 'Chambres', path: '/chambres', icon: <BedIcon /> },
  { name: 'Affectations', path: '/affectations', icon: <SwapHorizIcon /> },
  { name: 'Personnel', path: '/personnel', icon: <BadgeIcon /> },
];

  
  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 shadow-xl">
      <div className="p-6 text-xl font-bold tracking-wider border-b border-slate-800 text-indigo-400">
        HOSPIT-ALGO
      </div>
      
      <nav className="flex-1 mt-4 px-4">
  <ul className="space-y-2">
    {menuItems.map((item) => {
      // On vérifie si le lien est actif
      const isActive = location.pathname === item.path;

      return (
        <li key={item.path}>
          <Link
            to={item.path}
            className={`
              flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }
            `}
          >
            {/* Conteneur de l'icône */}
            <span className={`
              flex items-center justify-center transition-colors
              ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}
            `}>
              {/* On clone l'icône pour lui injecter une taille si nécessaire */}
              {React.cloneElement(item.icon, { sx: { fontSize: 22 } })}
            </span>

            {/* Texte du menu */}
            <span className="font-medium text-sm tracking-wide">
              {item.name}
            </span>

           
          </Link>
        </li>
      );
    })}
  </ul>
</nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        v1.0 - Système de Test PRAP
      </div>
    </div>
  );
};

export default Sidebar;