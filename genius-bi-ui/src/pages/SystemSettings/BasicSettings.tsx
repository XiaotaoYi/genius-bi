import React, { useState, useEffect } from 'react';

function BasicSettings() {
  const [setting1, setSetting1] = useState('');
  const [setting2, setSetting2] = useState('');

  useEffect(() => {
    // Fetch basic settings data from backend API
    // For now, using mock data
    setSetting1('Mock Value 1');
    setSetting2('Mock Value 2');
  }, []);

  const handleSave = () => {
    // Call backend API to save basic settings
    console.log('Saving basic settings:', { setting1, setting2 });
    // Show success message
  };

  return (
    <div>
      <h2>Basic Settings</h2>
      <div>
        <label>Setting 1:</label>
        <input type="text" value={setting1} onChange={(e) => setSetting1(e.target.value)} />
      </div>
      <div>
        <label>Setting 2:</label>
        <input type="text" value={setting2} onChange={(e) => setSetting2(e.target.value)} />
      </div>
      <button onClick={handleSave}>Save Settings</button>
    </div>
  );
}

export default BasicSettings; 