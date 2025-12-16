console.log("Dinosaur Runner Game - Stage 2");

class DinoGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.scoreElement = document.getElementById("score");
    this.statusElement = document.getElementById("gameStatus");

    // Game state
    this.gameState = "waiting"; // 'waiting', 'playing', 'gameOver'
    this.score = 0;
    this.gameSpeed = 2;

    // Dino properties
    this.dino = {
      x: 50,
      y: 150,
      width: 40,
      height: 40,
      velocityY: 0,
      isJumping: false,
      groundY: 150,
    };

    // Physics
    this.gravity = 0.6;
    this.jumpStrength = -12;

    // Ground
    this.groundY = 180;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.gameLoop();
    this.updateStatus("Click to Start!");
  }

  setupEventListeners() {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        this.handleJump();
      }
    });

    this.canvas.addEventListener("click", () => {
      this.handleJump();
    });
  }

  handleJump() {
    if (this.gameState === "waiting") {
      this.startGame();
    } else if (this.gameState === "playing" && !this.dino.isJumping) {
      this.jump();
    } else if (this.gameState === "gameOver") {
      this.resetGame();
    }
  }

  startGame() {
    this.gameState = "playing";
    this.score = 0;
    this.updateScore();
    this.updateStatus("");
    console.log("Game started!");
  }


  jump() {
    if (!this.dino.isJumping) {
      this.dino.velocityY = this.jumpStrength;
      this.dino.isJumping = true;
      console.log("Dino jumped!");
    }
  }

  updatePhysics() {
    if (this.gameState !== "playing") return;

    this.dino.velocityY += this.gravity;
    this.dino.y += this.dino.velocityY;

    if (this.dino.y >= this.dino.groundY) {
      this.dino.y = this.dino.groundY;
      this.dino.velocityY = 0;
      this.dino.isJumping = false;
    }

    this.score += 0.1;
    this.updateScore();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawDino();

    if (this.gameState === "waiting") {
      this.drawInstructions();
    }
  }

  drawDino() {
    const strideActive = this.gameState === "playing" && !this.dino.isJumping;
    const legStride = strideActive ? (Math.floor(this.frameCount / 8) % 2 === 0 ? 2 : -2) : 0;
    const legBaseY = this.dino.y + this.dino.height - 2;

    this.ctx.fillStyle = "green";
    this.ctx.fillRect(
      this.dino.x,
      this.dino.y,
      this.dino.width,
      this.dino.height,
    );

    this.ctx.fillStyle = "darkgreen";
    this.ctx.fillRect(this.dino.x + 25, this.dino.y + 8, 4, 4);
    this.ctx.fillRect(this.dino.x + 30, this.dino.y + 20, 8, 2);

    if (!this.dino.isJumping) {
      this.ctx.fillStyle = "green";
      this.ctx.fillRect(this.dino.x + 10, this.dino.y + 40, 6, 8);
      this.ctx.fillRect(this.dino.x + 24, this.dino.y + 40, 6, 8);
    }
  }

  drawInstructions() {
    this.ctx.fillStyle = "black";
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "Press SPACE or ↑ to jump!",
      this.canvas.width / 2,
      this.canvas.height / 2 - 20,
    );

    this.ctx.font = "16px Arial";
    this.ctx.fillText(
      "Click anywhere to start",
      this.canvas.width / 2,
      this.canvas.height / 2 + 10,
    );
  }

  updateScore() {
    this.scoreElement.textContent = Math.floor(this.score);
  }

  updateStatus(message) {
    this.statusElement.textContent = message;
    this.statusElement.style.display = message ? "block" : "none";
  }

  resetGame() {
    this.gameState = "waiting";
    this.score = 0;
    this.dino.y = this.dino.groundY;
    this.dino.velocityY = 0;
    this.dino.isJumping = false;
    this.updateScore();
    this.updateStatus("Click to Start!");
    console.log("Game reset!");
  }

  gameLoop() {
    this.updatePhysics();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }
}

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    console.log("Server health check:", data);
  } catch (error) {
    console.error("Health check failed:", error);
  }
}

window.addEventListener("load", () => {
  checkHealth();
  new DinoGame();
  console.log("Stage 2 complete: Canvas game with controls ready!");
});