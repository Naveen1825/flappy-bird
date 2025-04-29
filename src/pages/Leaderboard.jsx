import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

function Leaderboard({ onNavigate }) {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const usersCollection = collection(db, "users");

    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const leaderboardData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      leaderboardData.sort(
        (a, b) => (b.highScore || 0) - (a.highScore || 0)
      );

      setLeaders(leaderboardData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="leaderboard">
      <h1 style={{ marginBottom: "2rem" }}>🏆 Leaderboard 🏆</h1>

      <div style={{ width: "90%", maxWidth: "600px" }}>
        {leaders.map((user, index) => (
          <div
            key={user.id}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              background: "#7ED957",
              border: "4px solid #355E3B",
              boxShadow: "4px 4px 0px #355E3B",
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.8rem",
              imageRendering: "pixelated",
            }}
          >
            #{index + 1} 👤 {user.displayName || "Unnamed User"}
            <br />
            🏅 High Score: {user.highScore || 0}
          </div>
        ))}
      </div>

      <button
        className="floppy-button"
        style={{ marginTop: "2rem" }}
        onClick={() => onNavigate("home")}
      >
        Back to Home
      </button>
    </div>
  );
}

export default Leaderboard;
