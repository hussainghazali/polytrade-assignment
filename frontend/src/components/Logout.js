import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const LogoutPage = () => {
  const history = useHistory();

  useEffect(() => {
    // Remove access token from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('access_token');
    // Redirect to the homepage
    history.push('http://localhost:3000');
  }, [history]);

  return (
    <div>
      <p>Logging out...</p>
      {/* You can add a loader or any message here to indicate the logout process */}
    </div>
  );
};

export default LogoutPage;
