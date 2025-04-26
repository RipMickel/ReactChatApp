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

  // Listen for changes in authentication state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsub(); // Cleanup subscription when component unmounts
  }, []);

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase
      setUser(null); // Explicitly set user to null after logout
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

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
