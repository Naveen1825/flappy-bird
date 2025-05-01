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

      <div className="leaderboard-list">
        {leaders.map((user, index) => (
          <div className="leaderboard-entry" key={user.id}>
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
