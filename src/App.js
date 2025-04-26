import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";  // Import Loading component

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Add loading state

  // Listen for changes in authentication state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);  // Set user when authentication state changes
      setLoading(false);  // Set loading to false after the auth state is resolved
    });
    return () => unsub(); // Cleanup subscription when component unmounts
  }, []);

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await signOut(auth);  // Sign out the user from Firebase
      setUser(null);  // Set user to null after logout
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  if (loading) {
    return <Loading />;  // Show loading screen while auth state is being checked
  }

  return (
    <Router>
      <div className="App">
        <header>
          <h1>React Chat App</h1>

          {/* Conditionally render header items based on user authentication */}
          {user ? (
            <>
              <button onClick={handleLogout}>Logout</button>
              <Link to="/profile" style={{ marginLeft: "1rem" }}>
                My Profile
              </Link>
            </>
          ) : (
            <Link to="/">Login</Link>
          )}
        </header>

        <Routes>
          {/* Redirect to /chat if the user is logged in, else show login */}
          <Route
            path="/"
            element={user ? <Navigate to="/chat" /> : <Login />}
          />

          {/* Protect the chat room and profile routes */}
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
