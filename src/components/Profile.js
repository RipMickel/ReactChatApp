import React from 'react';
import { auth } from '../firebase';

const Profile = () => {
  const user = auth.currentUser;

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>👤 Profile</h2>
      <img
        src={user.photoURL}
        alt="Profile"
        style={{ borderRadius: '50%', width: 100, height: 100 }}
      />
      <p><strong>Name:</strong> {user.displayName}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default Profile;
