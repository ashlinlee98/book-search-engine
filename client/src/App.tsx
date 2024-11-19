import './App.css';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { AuthContext } from './contexts/AuthContext.jsx';

function App() {
  const [user, setUser] = useState(null);

  // Fetch the authenticated user, if applicable
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        setUser(decodedUser);
      } catch (err) {
        console.error('Failed to decode token', err);
        setUser(null); // Clear invalid token
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Navbar />
      <Outlet />
    </AuthContext.Provider>
  );
}

export default App;
