import React, { useEffect, useState } from 'react';
import { getDestinations } from '../utils/api';

const AllDestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    getDestinations().then(setDestinations);
  }, []);

  return (
    <div>
      <h2>All Destinations</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {destinations.map(dest => (
          <div key={dest.id || dest._id} style={{ border: '1px solid #ccc', padding: '1rem', width: 250 }}>
            <img
              src={`http://localhost:5000${dest.images?.[0] || '/default.jpg'}`}
              alt={dest.title}
              style={{ width: '100%', height: 150, objectFit: 'cover' }}
            />
            <h3>{dest.title}</h3>
            <p>{dest.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllDestinationsPage;
