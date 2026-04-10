import React from 'react';
import SideBar from './SideBar';

const Layout = ({ children }) => {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <SideBar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;