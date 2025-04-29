import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setCurrentPage('home');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateName = async () => {
    if (newName.trim() === '') return;
    try {
      await updateProfile(auth.currentUser, {
        displayName: newName
      });
      setUser({ ...auth.currentUser });
      setEditingName(false);
      setNewName('');
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingName(false);
    setNewName('');
  };

  return (
    <div className="app">
      {/* Floating Username + Email */}
      {user && (
        <div className="pixel-box">
          {editingName && currentPage === 'home' ? (
            <>
              <input
                type="text"
                value={newName}
                placeholder="New Name"
                onChange={(e) => setNewName(e.target.value)}
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '0.6rem',
                  width: '80%',
                  padding: '0.6rem',
                  marginBottom: '0.5rem',
                  backgroundColor: 'transparent'
                }}
              />
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                  onClick={handleUpdateName}
                  className="floppy-button"
                  style={{ width: '7rem', padding: '0.5rem 1rem', fontSize: '0.6rem' }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="floppy-button"
                  style={{
                    backgroundColor: '#FF6B6B',
                    border: '4px solid #8B0000',
                    boxShadow: '4px 4px 0px #8B0000',
                    width: '7rem',
                    padding: '0.5rem 1rem',
                    fontSize: '0.6rem'
                  }}
                >
                  Cancel
                </button>
              </div>
              <br />
              📧 {user.email}
            </>
          ) : (
            <>
              👾 {user.displayName || "Unnamed User"}
              <br />
              📧 {user.email}
            </>
          )}
        </div>
      )}

      {/* Routing between Pages */}
      {currentPage === 'home' && (
        <Home
          user={user}
          onNavigate={setCurrentPage}
          onEditName={() => {
            setEditingName(true);
            setNewName(user?.displayName || '');
          }}
        />
      )}
      {currentPage === 'game' && <Game onNavigate={setCurrentPage} />}
      {currentPage === 'leaderboard' && <Leaderboard onNavigate={setCurrentPage} />}
      {currentPage === 'login' && <Login onNavigate={setCurrentPage} />}
      {currentPage === 'signup' && <Signup onNavigate={setCurrentPage} />}
    </div>
  );
}

export default App;
