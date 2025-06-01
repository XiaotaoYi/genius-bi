import React, { useState, useEffect } from 'react';

interface Tool {
  id: number;
  name: string;
  configuration: string;
  // Add more fields based on actual tool structure
}

function ToolConfiguration() {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    // Fetch tool configuration data from backend API
    // For now, using mock data
    const mockTools: Tool[] = [
      { id: 1, name: 'Tool 1', configuration: 'Config for tool 1' },
      { id: 2, name: 'Tool 2', configuration: 'Config for tool 2' },
    ];
    setTools(mockTools);
  }, []);

  const handleEdit = (id: number) => {
    // Handle edit tool configuration logic
    console.log('Editing tool configuration with id:', id);
  };

  return (
    <div>
      <h2>Tool Configuration</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Configuration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tools.map(tool => (
            <tr key={tool.id}>
              <td>{tool.id}</td>
              <td>{tool.name}</td>
              <td>{tool.configuration}</td>
              <td>
                <button onClick={() => handleEdit(tool.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add create button or other actions if applicable */}
    </div>
  );
}

export default ToolConfiguration; 