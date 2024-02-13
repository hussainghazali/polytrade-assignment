import React, { useState, useEffect } from 'react';
import ProfileAction from "./ProfileAction";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [editedUser, setEditedUser] = useState(null); // State to hold edited user data
  const [isEditing, setIsEditing] = useState(false); // State to track edit mode

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found in session storage');
        }

        const response = await fetch('http://localhost:3001/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const userData = await response.json();
        setUser(userData);
        setEditedUser(userData); // Initialize editedUser with fetched user data
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };

    fetchUserProfile();

  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found in session storage');
      }

      const response = await fetch('http://localhost:3001/users/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.sub, // Assuming user.sub contains the userId
          email: editedUser.email,
          firstName: editedUser.firstName,
          lastName: editedUser.lastName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }

      // If the request is successful, update the user state with the edited data
      setUser(editedUser);
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error(error);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-md p-6 max-w-md mx-auto flex flex-col items-center justify-center">
      <img
        src="https://t4.ftcdn.net/jpg/04/83/90/95/360_F_483909569_OI4LKNeFgHwvvVju60fejLd9gj43dIcd.jpg"
        alt="Profile"
        className="w-32 h-32 rounded-full mb-4"
      />
      <h2 className="text-3xl font-semibold text-center mb-4">Profile</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-600">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={editedUser.firstName}
              onChange={handleInputChange}
              className="border-gray-300 border rounded-md px-4 py-2 w-full mt-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-600">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={editedUser.lastName}
              onChange={handleInputChange}
              className="border-gray-300 border rounded-md px-4 py-2 w-full mt-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedUser.email}
              onChange={handleInputChange}
              className="border-gray-300 border rounded-md px-4 py-2 w-full mt-1"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
        </form>
      ) : (
        <div>
      <div className="text-center mb-4">
        <p className="text-gray-600">First Name:</p>
        <p className="text-lg font-semibold">{user.firstName}</p>
      </div>
      <div className="text-center mb-4">
        <p className="text-gray-600">Last Name:</p>
        <p className="text-lg font-semibold">{user.lastName}</p>
      </div>
      <div className="text-center mb-4">
        <p className="text-gray-600">Email:</p>
        <p className="text-lg font-semibold">{user.email}</p>
      </div>
          <ProfileAction onClick={handleEditProfile} text="Edit Profile" />
        </div>
      )}
    </div>
  );
};

export default Profile;
