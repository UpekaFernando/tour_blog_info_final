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
  // Check if userData is FormData (for file uploads like profile pictures)
  const isFormData = userData instanceof FormData;
  
  // Create API client with appropriate headers
  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Don't set Content-Type for FormData - let browser set it automatically
      ...(!isFormData && { 'Content-Type': 'application/json' })
    }
  });
  
  const response = await apiClient.put('/users/profile', userData);
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
    // Mock data for demo (using local uploaded images)
    const mockDestinations = [
      {
        _id: '101',
        title: 'Sigiriya Rock Fortress',
        district: '2',
        description: 'Ancient rock fortress with frescoes and gardens',
        images: ['/uploads/images-1750785265516.jpg']
      },
      {
        _id: '102',
        title: 'Galle Fort',
        district: '3',
        description: 'Historic fortified city built by the Portuguese',
        images: ['/uploads/images-1750785364426.jpg']
      },
      {
        _id: '103',
        title: 'Dambulla Cave Temple',
        district: '2',
        description: 'A sacred pilgrimage site for 22 centuries',
        images: ['/uploads/images-1750785584274.png']
      },
      {
        _id: '104',
        title: 'Colombo National Museum',
        district: '1',
        description: 'The largest museum in Sri Lanka',
        images: ['/uploads/images-1755800929685.jpg']
      },
      {
        _id: '105',
        title: 'Pigeon Island',
        district: '5',
        description: 'Marine national park with amazing snorkeling',
        images: ['/uploads/images-1755800929690.jpg']
      },
      {
        _id: '106',
        title: 'Jaffna Fort',
        district: '4',
        description: 'Portuguese fort later occupied by the Dutch',
        images: ['/uploads/images-1750785265516.jpg']
      }
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
