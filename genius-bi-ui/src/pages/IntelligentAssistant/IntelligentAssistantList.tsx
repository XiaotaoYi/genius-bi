import React, { useState, useEffect } from 'react';

interface IntelligentAssistant {
  id: number;
  name: string;
  description: string;
}

function IntelligentAssistantList() {
  const [assistants, setAssistants] = useState<IntelligentAssistant[]>([]);

  useEffect(() => {
    // Fetch Intelligent Assistant data from backend API
    // For now, using mock data
    const mockAssistants: IntelligentAssistant[] = [
      { id: 1, name: 'Sales Analysis Assistant', description: 'Assists with sales data analysis' },
    ];
    setAssistants(mockAssistants);
  }, []);

  const handleDelete = (id: number) => {
    // Call backend API to delete Intelligent Assistant
    console.log('Deleting intelligent assistant with id:', id);
    setAssistants(assistants.filter(assistant => assistant.id !== id));
  };

  return (
    <div>
      <h2>Intelligent Assistant Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assistants.map(assistant => (
            <tr key={assistant.id}>
              <td>{assistant.id}</td>
              <td>{assistant.name}</td>
              <td>{assistant.description}</td>
              <td>
                <button onClick={() => console.log('Edit', assistant.id)}>Edit</button>
                <button onClick={() => handleDelete(assistant.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => console.log('Create new intelligent assistant')}>Create New</button>
    </div>
  );
}

export default IntelligentAssistantList; 