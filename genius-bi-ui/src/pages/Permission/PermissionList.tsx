import React, { useState, useEffect } from 'react';

interface Permission {
  id: number;
  name: string;
  description: string;
  // Add more fields based on actual permission structure
}

function PermissionList() {
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    // Fetch permission data from backend API
    // For now, using mock data
    const mockPermissions: Permission[] = [
      { id: 1, name: 'Permission 1', description: 'Description for permission 1' },
      { id: 2, name: 'Permission 2', description: 'Description for permission 2' },
    ];
    setPermissions(mockPermissions);
  }, []);

  const handleDelete = (id: number) => {
    // Call backend API to delete permission
    console.log('Deleting permission with id:', id);
    setPermissions(permissions.filter(permission => permission.id !== id));
  };

  return (
    <div>
      <h2>Permission Management</h2>
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
          {permissions.map(permission => (
            <tr key={permission.id}>
              <td>{permission.id}</td>
              <td>{permission.name}</td>
              <td>{permission.description}</td>
              <td>
                <button onClick={() => console.log('Edit', permission.id)}>Edit</button>
                <button onClick={() => handleDelete(permission.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => console.log('Create new permission')}>Create New</button>
    </div>
  );
}

export default PermissionList; 