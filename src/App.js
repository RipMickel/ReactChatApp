import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute"; 

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsub(); // Cleanup subscription on unmount
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Explicitly set user to null after logout
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <Router>
      <div className="App">
        <header>
          <h1> REACT Chat App</h1>
          {user && (
            <>
              <button onClick={handleLogout}>Logout</button>
              <Link to="/profile" style={{ marginLeft: '1rem' }}>My Profile</Link>
            </>
          )}
        </header>

        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/chat" /> : <Login />}
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatRoom user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
