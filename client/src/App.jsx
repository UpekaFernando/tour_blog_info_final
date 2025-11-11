import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'

// Import Pages
import HomePage from './pages/HomePage';
import DistrictPage from './pages/DistrictPage';
import DestinationPage from './pages/DestinationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AddDestinationPage from './pages/AddDestinationPage';
import EditDestinationPage from './pages/EditDestinationPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import ExplorePage from './pages/ExplorePage';
import TravelGuidePage from './pages/TravelGuidePage';
import PhotoGalleryPage from './pages/PhotoGalleryPage';
import LocalServicesPage from './pages/LocalServicesPage';
import WeatherClimatePage from './pages/WeatherClimatePage';
import AllDestinationsPage from './pages/AllDestinationsPage';

// Import Components
import Header from './components/Header';
import Footer from './components/Footer';

// Import Context
import { AuthContext } from './context/AuthContext';
import ApiService from './utils/api';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#006064', // Dark cyan - representing Sri Lankan waters
      light: '#428e92',
      dark: '#00363a',
    },
    secondary: {
      main: '#ff9800', // Orange - representing Sri Lankan culture
      light: '#ffc947',
      dark: '#c66900',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    }
  },
});

// Create simple AuthProvider for demo purposes
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  
  const login = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    // Test backend and database connection
    const testConnections = async () => {
      try {
        console.log('🔄 Testing connections on app start...');
        const dbConnected = await ApiService.testDatabase();
        setConnectionStatus(dbConnected ? 'connected' : 'database-error');
      } catch (error) {
        console.error('❌ Connection test failed:', error);
        setConnectionStatus('backend-error');
      }
    };
    
    testConnections();
  }, []);
  
  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      login, 
      logout, 
      connectionStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/travel-guide" element={<TravelGuidePage />} />
              <Route path="/gallery" element={<PhotoGalleryPage />} />
              <Route path="/services" element={<LocalServicesPage />} />
              <Route path="/weather" element={<WeatherClimatePage />} />
              <Route path="/district/:id" element={<DistrictPage />} />
              <Route path="/destination/:id" element={<DestinationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/add-destination" element={<AddDestinationPage />} />
              <Route path="/edit-destination/:id" element={<EditDestinationPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="/destinations" element={<AllDestinationsPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
