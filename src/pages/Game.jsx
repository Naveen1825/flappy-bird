import React, { useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

function Game({ onNavigate, skin }) {
  const canvasRef = useRef(null);
  const birdRef = useRef(null);
  const pipesRef = useRef([]);
  const intervalRef = useRef(null);
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const velocityYRef = useRef(0);

  const boardWidth = 360;
  const boardHeight = 640;
  const birdWidth = 34;
  const birdHeight = 24;
  const birdX = boardWidth / 8;
  const birdY = boardHeight / 2;
  const pipeWidth = 64;
  const pipeHeight = 512;
  const pipeX = boardWidth;
  const pipeY = 0;
  const gravity = 0.4;
  const velocityX = -2;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = boardWidth;
    canvas.height = boardHeight;

    const birdImg = new Image();
    birdImg.src = skin || "/flappybird.png";
    const topPipeImg = new Image();
    topPipeImg.src = "/toppipe.png";
    const bottomPipeImg = new Image();
    bottomPipeImg.src = "/bottompipe.png";
    const gameover = new Image();
    gameover.src = "/gameover.png";

      const isMobile = window.innerWidth <= 768;

    birdRef.current = {
      x: birdX,
      y: birdY,
      width: birdWidth,
      height: birdHeight,
      img: birdImg,
    };

    pipesRef.current = [];
    gameOverRef.current = false;
    scoreRef.current = 0;
    velocityYRef.current = 0;

    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          highScoreRef.current = docSnap.data().highScore || 0;
        } else {
          setDoc(userRef, {
            displayName: user.displayName || "Unnamed User",
            email: user.email || "",
            highScore: 0,
          });
        }
      });
    }

    const placePipes = () => {
      if (gameOverRef.current) return;
      const randomPipeY =
        pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
      const openingSpace = boardHeight / 4;

      const topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
      };
      const bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
      };
      pipesRef.current.push(topPipe, bottomPipe);
    };

    const detectCollision = (a, b) =>
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y;

    const draw = () => {
      if (gameOverRef.current) return;

      context.clearRect(0, 0, boardWidth, boardHeight);

      velocityYRef.current += gravity;
      birdRef.current.y = Math.max(birdRef.current.y + velocityYRef.current, 0);

      context.drawImage(
        birdRef.current.img,
        birdRef.current.x,
        birdRef.current.y,
        birdRef.current.width,
        birdRef.current.height
      );

      if (birdRef.current.y > boardHeight) {
        gameOverRef.current = true;
      }

      pipesRef.current.forEach((pipe) => {
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (
          !pipe.passed &&
          birdRef.current.x > pipe.x + pipe.width &&
          pipe.img === bottomPipeImg
        ) {
          scoreRef.current += 1;
          pipe.passed = true;
        }

        if (detectCollision(birdRef.current, pipe)) {
          gameOverRef.current = true;
        }
      });

      while (pipesRef.current.length && pipesRef.current[0].x < -pipeWidth) {
        pipesRef.current.shift();
      }

      context.fillStyle = "white";
      context.font = "20px 'Press Start 2P', cursive";

      if (gameOverRef.current) {
        context.drawImage(gameover, boardWidth / 6, boardHeight / 5, 250, 125);

        if (scoreRef.current > highScoreRef.current && user) {
          const newHigh = scoreRef.current;
          highScoreRef.current = newHigh;
          const userRef = doc(db, "users", user.uid);
          updateDoc(userRef, { highScore: newHigh });
        }

        context.fillText("High score " + highScoreRef.current, 55, 370);
        context.fillText("Score " + scoreRef.current, 110, boardHeight / 2);
      } else {
        context.fillText(scoreRef.current, 15, 35);
      }
    };

    const handleFlap = () => {
      velocityYRef.current = -6;
      if (gameOverRef.current) {
        birdRef.current.y = birdY;
        pipesRef.current = [];
        scoreRef.current = 0;
        gameOverRef.current = false;
        velocityYRef.current = 0;
      }
    };

    const keyHandler = (e) => {
      if (
        e.code === "Space" ||
        e.code === "ArrowUp" ||
        e.code === "KeyX"
      ) {
        handleFlap();
      }
    };
    if (!isMobile){
      document.addEventListener("keydown", keyHandler);
    }
    document.addEventListener("click", handleFlap);

    const pipeInterval = setInterval(placePipes, 1500);
    intervalRef.current = setInterval(draw, 1000 / 60); // ~60 FPS

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(pipeInterval);
      document.removeEventListener("keydown", keyHandler);
      document.removeEventListener("click", handleFlap);
    };
  }, [skin]);

  return (
    <div className="game">
      <h1 style={{ marginBottom: "2rem" }}>🐦 Flappy Bird Game</h1>
      <canvas
        ref={canvasRef}
        style={{
          border: "2px solid #355E3B",
          display: "block",
          margin: "0 auto",
        }}
      />
      <button
        className="floppy-button"
        onClick={() => onNavigate("home")}
        style={{ marginTop: "2rem" }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default Game;
