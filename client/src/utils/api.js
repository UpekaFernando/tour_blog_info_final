import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create API client with Authentication
const createAPIClient = (token = null) => {
  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
  
  return apiClient;
};

// User API calls
export const registerUser = async (userData) => {
  const response = await createAPIClient().post('/users', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await createAPIClient().post('/users/login', credentials);
  return response.data;
};

export const getUserProfile = async (token) => {
  const response = await createAPIClient(token).get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (userData, token) => {
  const response = await createAPIClient(token).put('/users/profile', userData);
  return response.data;
};

// District API calls
export const getDistricts = async () => {
  try {
    const response = await createAPIClient().get('/districts');
    return response.data;
  } catch (error) {
    console.log('Using mock district data');
    // Mock data for demo
    return [
      { _id: '1', name: 'Colombo', description: 'The commercial capital of Sri Lanka', imageUrl: 'https://images.unsplash.com/photo-1575336127377-62028f4cdcb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
      { _id: '2', name: 'Kandy', description: 'Home to the Temple of the Sacred Tooth Relic', imageUrl: 'https://images.unsplash.com/photo-1586253634026-8cb574908d1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
      { _id: '3', name: 'Galle', description: 'Famous for its Dutch colonial architecture', imageUrl: 'https://images.unsplash.com/photo-1573843981713-d5dea671a1c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
      { _id: '4', name: 'Jaffna', description: 'Rich cultural heritage in the northern part', imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
      { _id: '5', name: 'Trincomalee', description: 'Known for beautiful beaches and natural harbor', imageUrl: 'https://images.unsplash.com/photo-1578004942456-7adc743a4768?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }
    ];
  }
};

export const getDistrictById = async (id) => {
  try {
    const response = await createAPIClient().get(`/districts/${id}`);
    return response.data;
  } catch (error) {
    console.log('Using mock district data for ID:', id);
    const allDistricts = await getDistricts();
    return allDistricts.find(district => district._id === id) || null;
  }
};

// Destination API calls
export const getDestinations = async (districtId = null) => {
  try {
    let url = '/destinations';
    if (districtId) {
      url = `/destinations?district=${districtId}`;
    }
    
    const response = await createAPIClient().get(url);
    return response.data;
  } catch (error) {
    console.log('Using mock destination data');
    // Mock data for demo
    const mockDestinations = [
      { _id: '101', name: 'Sigiriya Rock Fortress', district: '2', description: 'Ancient rock fortress with frescoes and gardens', imageUrl: 'https://images.unsplash.com/photo-1588258147256-f4033aaef97c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
      { _id: '102', name: 'Galle Fort', district: '3', description: 'Historic fortified city built by the Portuguese', imageUrl: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
      { _id: '103', name: 'Dambulla Cave Temple', district: '2', description: 'A sacred pilgrimage site for 22 centuries', imageUrl: 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
      { _id: '104', name: 'Colombo National Museum', district: '1', description: 'The largest museum in Sri Lanka', imageUrl: 'https://images.unsplash.com/photo-1572953109213-3be62398eb95?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
      { _id: '105', name: 'Pigeon Island', district: '5', description: 'Marine national park with amazing snorkeling', imageUrl: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
      { _id: '106', name: 'Jaffna Fort', district: '4', description: 'Portuguese fort later occupied by the Dutch', imageUrl: 'https://images.unsplash.com/photo-1562939684-6a43f1e0504b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }
    ];

    return districtId 
      ? mockDestinations.filter(dest => dest.district === districtId)
      : mockDestinations;
  }
};

export const getDestinationById = async (id) => {
  try {
    const response = await createAPIClient().get(`/destinations/${id}`);
    return response.data;
  } catch (error) {
    console.log('Using mock destination data for ID:', id);
    const allDestinations = await getDestinations();
    return allDestinations.find(dest => dest._id === id) || null;
  }
};

export const createDestination = async (destinationData, token) => {
  // Create a special API client for file uploads
  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
      // Don't set Content-Type header for FormData, let browser handle it
    }
  });
  
  const response = await apiClient.post('/destinations', destinationData);
  return response.data;
};

export const updateDestination = async (id, destinationData, token) => {
  const apiClient = createAPIClient(token);
  
  // If destinationData is FormData (contains files), don't set Content-Type
  if (destinationData instanceof FormData) {
    const response = await apiClient.put(`/destinations/${id}`, destinationData);
    return response.data;
  } else {
    // Regular JSON data
    const response = await apiClient.put(`/destinations/${id}`, destinationData);
    return response.data;
  }
};

export const deleteDestination = async (id, token) => {
  const response = await createAPIClient(token).delete(`/destinations/${id}`);
  return response.data;
};

// For handling file uploads
export const uploadImage = (formData, token) => {
  return createAPIClient(token).post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
