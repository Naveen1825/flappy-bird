import React, { useEffect, useState } from "react";
import { signOut, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const skinOptions = [
  { src: "/flappybird.png", name: "Classic", unlockScore: 0 },
  { src: "/flappybird-red.png", name: "Blue", unlockScore: 60 },
  { src: "/flappybird-blue.png", name: "Red", unlockScore: 100 },
];

function Home({ user, onNavigate, selectedSkin, setSelectedSkin }) {
  const [highScore, setHighScore] = useState(0);
  const [currentSkinIndex, setCurrentSkinIndex] = useState(0);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchHighScore = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setHighScore(docSnap.data().highScore || 0);
        }
      }
    };
    fetchHighScore();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateName = async () => {
    if (newName.trim() === "") return;
    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { displayName: newName }, { merge: true });
      alert("Username updated successfully!");
      setEditingName(false);
      setNewName("");
      onNavigate("home");
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingName(false);
    setNewName("");
  };

  const nextSkin = () => {
    setCurrentSkinIndex((prev) => (prev + 1) % skinOptions.length);
  };

  const prevSkin = () => {
    setCurrentSkinIndex((prev) => (prev - 1 + skinOptions.length) % skinOptions.length);
  };

  const currentSkin = skinOptions[currentSkinIndex];
  const isUnlocked = highScore >= currentSkin.unlockScore;

  return (
    <div className="home">
      <img src="/title.png" alt="Flappy Bird" className="title-image" />

      {user && (
        <div className="pixel-box">
          {editingName ? (
            <>
              <input
                type="text"
                value={newName}
                placeholder="New Name"
                onChange={(e) => setNewName(e.target.value)}
              />
              <div className = "floppy-edit">
                <button onClick={handleUpdateName} className="floppy-save">Save</button>
                <button onClick={handleCancelEdit} className="floppy-cancel">Cancel</button>
              </div>
              <br />
              📧 {user.email}
            </>
          ) : (
            <>
              👾 {user.displayName || "Unnamed User"} <br />
              📧 {user.email}
            </>
          )}
        </div>
      )}

      <div className="skin-selector">
        <h3>Choose Your Bird</h3>
        <div className="skin-navigation-container">
          <div className="skin-display">
            
            <div className="img-nav">
              <div className="nav-button-container">
                <button onClick={prevSkin} className="nav-button">
                  <img src="/prev.png" alt="Previous" className="nav-arrow-img" />
                </button>
              </div>

              <div className="skin-image">
                <img
                  src={currentSkin.src}
                  alt={currentSkin.name}
                  className={isUnlocked ? "" : "locked-bird"}
                />
              </div>

              <div className="nav-button-container">
                <button onClick={nextSkin} className="nav-button">
                  <img src="/next.png" alt="Next" className="nav-arrow-img" />
                </button>
              </div>
            </div>
            <div className="skin-name">
              <p>{currentSkin.name}</p>
            </div>

            <div className="skin-select"
              style = {{
                marginBottom: "1rem",
              }}
            >
              {isUnlocked ? (
                <button
                  className="floppy-button"
                  onClick={() => setSelectedSkin(currentSkin.src)}
                  style={{
                    backgroundColor: selectedSkin === currentSkin.src ? "#4CAF50" : "#7ED957",
                    color: "white",
                    fontWeight: "semibold",
                    border: "4px solid #355E3B",
                    fontSize: "1rem",
                  }}
                >
                  {selectedSkin === currentSkin.src ? "Selected" : "Select"}
                </button>
              ) : (
                <button
                  className="floppy-button"
                  disabled
                  style={{
                    color: "gray",
                    fontSize: "0.8rem",
                  }}
                >
                  Unlock at {currentSkin.unlockScore} pts
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      <div className="button-group">
        <button className="floppy-button" onClick={() => onNavigate("game")}>Play Game</button>
        <button className="floppy-button" onClick={() => onNavigate("leaderboard")}>Leaderboard</button>

        {user ? (
          <>
            <button
              className="floppy-button"
              onClick={() => {
                setEditingName(true);
                setNewName(user?.displayName || "");
              }}
            >
              Edit Username
            </button>
            <button className="floppy-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button className="floppy-button" onClick={() => onNavigate("login")}>Login</button>
        )}
      </div>
    </div>
  );
}

export default Home;
