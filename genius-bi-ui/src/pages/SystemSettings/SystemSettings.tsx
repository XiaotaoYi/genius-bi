import React, { useState } from 'react';
import BasicSettings from './BasicSettings';
import ToolConfiguration from './ToolConfiguration';
import LogManagement from './LogManagement';

function SystemSettings() {
  const [activeTab, setActiveTab] = useState('basic');

  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicSettings />;
      case 'tools':
        return <ToolConfiguration />;
      case 'logs':
        return <LogManagement />;
      default:
        return <BasicSettings />;
    }
  };

  return (
    <div>
      <h1>System Settings</h1>
      <nav>
        <button onClick={() => setActiveTab('basic')}>Basic Settings</button>
        <button onClick={() => setActiveTab('tools')}>Tool Configuration</button>
        <button onClick={() => setActiveTab('logs')}>Log Management</button>
      </nav>
      <div className="settings-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default SystemSettings; 