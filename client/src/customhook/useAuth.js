import { useState, useEffect } from "react";
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://unipoolsamlapi.vercel.app',
  withCredentials: true
})

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await api.get('https://unipoolsamlapi.vercel.app/verify');
        const data = await response.json();
        console.log("Response: Here", data);

        if (!response.ok) {
          throw new Error('Failed to verify authentication');
        }

        if (data.user) {
          setUserData(data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  return { isAuthenticated, userData };
};

export default useAuth;
