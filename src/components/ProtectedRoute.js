import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  if (user === null) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>You must be logged in to view this page.</div>;
  }

  return children;
};

export default ProtectedRoute;
