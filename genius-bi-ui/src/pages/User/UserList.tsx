import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  role: string;
  // Add more fields based on actual user structure
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch user data from backend API
    // For now, using mock data
    const mockUsers: User[] = [
      { id: 1, username: 'admin', role: 'Admin' },
      { id: 2, username: 'user1', role: 'User' },
    ];
    setUsers(mockUsers);
  }, []);

  const handleDelete = (id: number) => {
    // Call backend API to delete user
    console.log('Deleting user with id:', id);
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div>
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => console.log('Edit', user.id)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => console.log('Create new user')}>Create New</button>
    </div>
  );
}

export default UserList; 