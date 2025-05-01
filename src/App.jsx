import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedSkin, setSelectedSkin] = useState("/flappybird.png");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) setCurrentPage('home');
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="app">
      {currentPage === 'home' && (
        <Home
          user={user}
          onNavigate={setCurrentPage}
          selectedSkin={selectedSkin}
          setSelectedSkin={setSelectedSkin}
        />
      )}
      {currentPage === 'game' && (
        <Game
          onNavigate={setCurrentPage}
          skin={selectedSkin}
        />
      )}
      {currentPage === 'leaderboard' && <Leaderboard onNavigate={setCurrentPage} />}
      {currentPage === 'login' && <Login onNavigate={setCurrentPage} />}
      {currentPage === 'signup' && <Signup onNavigate={setCurrentPage} />}
    </div>
  );
}

export default App;
