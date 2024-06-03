// src/components/Sidebar.js

import React from 'react';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="brand">
        <img src="/path-to-logo.png" alt="Promage Logo" />
        <h1>Promage</h1>
      </div>
      <button className="create-project-btn">Create new project</button>
      <nav>
        <ul>
          <li>Dashboard</li>
          <li>Projects</li>
          <li>Tasks</li>
          <li>Time log</li>
          <li>Resource mgmt</li>
          <li>Users</li>
          <li>Project template</li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
