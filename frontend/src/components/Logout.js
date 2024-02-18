import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      // Remove access token from local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('access_token');
      // Redirect to the homepage
      navigate('/');
    };

    logout();
  }, [navigate]);

  return (
    <div>
      <p>Logging out...</p>
      {/* You can add a loader or any message here to indicate the logout process */}
    </div>
  );
};

export default LogoutPage;
