import React, { useEffect, useState } from 'react';
import { getDestinations } from '../utils/api';

const AllDestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    getDestinations().then(data => {
      // Filter: Only show destinations with a valid author (user)
      const userDestinations = data.filter(dest => dest.author && dest.author.name && dest.author.name.toLowerCase() !== 'admin');
      setDestinations(userDestinations);
    });
  }, []);

  return (
    <div>
      <h2>User Added Destinations</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {destinations.length === 0 ? (
          <p>No user-added destinations found.</p>
        ) : (
          destinations.map(dest => (
            <div key={dest.id || dest._id} style={{ border: '1px solid #ccc', padding: '1rem', width: 250 }}>
              <img
                src={`http://localhost:5000${dest.images?.[0] || '/default.jpg'}`}
                alt={dest.title}
                style={{ width: '100%', height: 150, objectFit: 'cover' }}
              />
              <h3>{dest.title}</h3>
              <p>{dest.description}</p>
              <p><b>Added by:</b> {dest.author?.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllDestinationsPage;
