// context/AuthContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import {jwtDecode} from 'jwt-decode'; // Correct import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState({});
  const [profile, setProfile] = useState(null);
  const [profileId, setProfileId] = useState(null)
  const [query, setQuery] = useState(""); // Search query
  const [results, setResults] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // console.log('AuthProvider initialized');
  }, []);

  // Check for token in localStorage on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token
        setAuthUser(decoded);
        setIsAuthenticated(true);
      } catch (err) {
        console.log('Invalid token');
        setIsAuthenticated(false);
      }
    }
  }, []);
  // console.log(authUser)
  
  const signOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/auth/librarysignin'); // Uncomment if needed for redirect on sign-out
  };

  useEffect(() => {
    // Fetch user profile ID on initial load if you have a session token
    const fetchUserProfileId = async () => {
      const token = localStorage.getItem('token'); // You can still store a non-sensitive token in localStorage for authentication
      if (token) {
        try {
          const response = await fetch('http://localhost:8000/get-user-profile', {
            method: 'GET',
            headers: { 
              'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', },
          });
          const data = await response.json();
          if (response.status === 200) {
            setProfileId(data.profile._id); // Set the profileId from API response
          }
        } catch (err) {
          console.error('Error fetching profileId:', err);
        }
      }
    };
    
    fetchUserProfileId();
  }, []);
  // console.log(profileId)

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, signOut, setAuthUser,authUser, profile, setProfile, profileId, setProfileId, query, setQuery,results, setResults  }}>
      {children}
    </AuthContext.Provider>
  );
};
