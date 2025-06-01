import React, { useState, useEffect } from 'react';

interface IndexMarketItem {
  id: number;
  name: string;
  description: string;
  // Add more fields based on actual index market structure
}

function IndexMarketList() {
  const [items, setItems] = useState<IndexMarketItem[]>([]);

  useEffect(() => {
    // Fetch index market data from backend API
    // For now, using mock data
    const mockItems: IndexMarketItem[] = [
      { id: 1, name: 'Market Index 1', description: 'Description for index 1' },
      { id: 2, name: 'Market Index 2', description: 'Description for index 2' },
    ];
    setItems(mockItems);
  }, []);

  return (
    <div>
      <h2>Index Market</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            {/* Add more headers */}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              {/* Add more data cells */}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add create button or other actions if applicable */}
    </div>
  );
}

export default IndexMarketList; 