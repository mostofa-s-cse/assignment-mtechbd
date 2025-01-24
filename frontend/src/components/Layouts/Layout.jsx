// src/Layout.js
import React from 'react';
import Topbar from '../share/Topbar';
import Sidebar from '../share/Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar/>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;