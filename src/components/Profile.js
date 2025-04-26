import React, { useState } from 'react';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { Link } from 'react-router-dom';  // Import Link for routing

const Profile = () => {
  const user = auth.currentUser;
  const [newPhotoURL, setNewPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!user) return <div>Loading...</div>;

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      await updateProfile(user, {
        photoURL: newPhotoURL || user.photoURL, // Update profile picture (if provided)
      });

      setLoading(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setLoading(false);
      setError('Error updating profile: ' + err.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>👤 Profile</h2>
      <img
        src={user.photoURL || 'https://via.placeholder.com/150'}
        alt="Profile"
        style={{ borderRadius: '50%', width: 100, height: 100 }}
      />
      <p><strong>Name:</strong> {user.displayName}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {/* Input to update photo URL */}
      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={newPhotoURL}
          onChange={(e) => setNewPhotoURL(e.target.value)}
          placeholder="Enter new profile image URL"
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <button onClick={handleUpdateProfile} disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile Picture'}
        </button>
      </div>

      {/* Display error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Navigation to go back to the chat */}
      <div style={{ marginTop: '2rem' }}>
        <Link to="/chat" style={{ fontSize: '16px', color: '#4CAF50', textDecoration: 'none' }}>
          &larr; Back to Chat
        </Link>
      </div>
    </div>
  );
};

export default Profile;
    