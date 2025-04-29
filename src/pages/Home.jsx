import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Home({ user, onNavigate, onEditName }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="home">
      <img src="/title.png" alt="Flappy Bird" className="title-image" />
      <div className="button-group">
        <button className="floppy-button" onClick={() => onNavigate('game')}>Play Game</button>
        <button className="floppy-button" onClick={() => onNavigate('leaderboard')}>Leaderboard</button>

        {user ? (
          <>
            <button className="floppy-button" onClick={onEditName}>Edit Username</button>
            <button className="floppy-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="floppy-button" onClick={() => onNavigate('login')}>Login</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
