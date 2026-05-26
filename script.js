const crushName = "Kamu";
const greetingText =
  "Di hari yang penuh berkah ini, aku cuma mau bilang: Selamat Hari Raya Idul Adha. Semoga kamu selalu bahagia, sehat, dan dikelilingi hal-hal baik. Kalau boleh jujur, dari semua yang indah hari ini, senyummu tetap yang paling aku tunggu.";

const blessingMessages = [
  "Wah, kamu jago juga!",
  "Sapi ini larinya demi senyummu.",
  "Berkahnya nambah, deg-degannya juga.",
  "Kalau kamu senyum, skornya auto naik."
];

document.querySelectorAll("[data-crush-name]").forEach((node) => {
  node.textContent = crushName;
});

const audio = {
  enabled: true,
  ctx: null,
  musicTimer: null,
  musicStep: 0
};

function ensureAudio() {
  if (!audio.enabled) return null;
  if (!audio.ctx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audio.ctx = new AudioContext();
  }
  if (audio.ctx.state === "suspended") {
    audio.ctx.resume();
  }
  if (!audio.musicTimer) {
    startBackgroundMusic();
  }
  return audio.ctx;
}

function tone(frequency, duration = 0.12, type = "sine", volume = 0.06, delay = 0) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.03);
}

function sweep(from, to, duration = 0.2, type = "sine", volume = 0.07) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const start = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(to, start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

function playClick() {
  tone(620, 0.055, "triangle", 0.04);
  tone(920, 0.07, "sine", 0.03, 0.035);
}

function playBell() {
  tone(784, 0.22, "sine", 0.06);
  tone(1046, 0.28, "triangle", 0.045, 0.08);
  tone(1318, 0.24, "sine", 0.032, 0.16);
}

function playMoo() {
  sweep(190, 105, 0.46, "sawtooth", 0.045);
  tone(98, 0.5, "triangle", 0.045, 0.04);
}

function playJump() {
  sweep(310, 690, 0.16, "triangle", 0.045);
}

function playCollect() {
  tone(880, 0.07, "triangle", 0.045);
  tone(1174, 0.09, "sine", 0.04, 0.06);
}

function playGameOver() {
  tone(260, 0.18, "triangle", 0.05);
  tone(196, 0.24, "sine", 0.045, 0.13);
}

function startBackgroundMusic() {
  if (!audio.enabled || audio.musicTimer) return;
  const notes = [392, 440, 523, 494, 392, 330, 392, 523];
  audio.musicTimer = window.setInterval(() => {
    if (!audio.enabled) return;
    const note = notes[audio.musicStep % notes.length];
    tone(note, 0.14, "sine", 0.018);
    if (audio.musicStep % 2 === 0) tone(note / 2, 0.18, "triangle", 0.012, 0.02);
    audio.musicStep += 1;
  }, 720);
}

function stopBackgroundMusic() {
  if (audio.musicTimer) {
    window.clearInterval(audio.musicTimer);
    audio.musicTimer = null;
  }
}

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    ensureAudio();
    playClick();
  });
});

const soundToggle = document.getElementById("soundToggle");
const soundText = document.getElementById("soundText");

soundToggle.addEventListener("click", () => {
  audio.enabled = !audio.enabled;
  soundToggle.setAttribute("aria-pressed", String(audio.enabled));
  soundText.textContent = audio.enabled ? "Sound On" : "Sound Off";
  if (audio.enabled) {
    ensureAudio();
    playBell();
  } else {
    stopBackgroundMusic();
  }
});

document.addEventListener(
  "pointerdown",
  () => {
    ensureAudio();
  },
  { once: true }
);

const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = [...document.querySelectorAll("main section")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { threshold: 0.45 }
);

sections.forEach((section) => sectionObserver.observe(section));

const confettiLayer = document.getElementById("confettiLayer");
const openGreeting = document.getElementById("openGreeting");
const greetingCard = document.getElementById("greetingCard");
const typedGreeting = document.getElementById("typedGreeting");
const toast = document.getElementById("toast");
let typingStarted = false;
let toastTimer = null;

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2400);
}

function fireConfetti(amount = 90) {
  const colors = ["#f4b94f", "#7dcf85", "#ffd9df", "#ffffff", "#65bd72"];
  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--drift", `${Math.random() * 280 - 140}px`);
    piece.style.setProperty("--fall-duration", `${1.2 + Math.random() * 1.8}s`);
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    confettiLayer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

function revealGreeting() {
  greetingCard.classList.add("revealed");
  startTyping();
}

function startTyping() {
  if (typingStarted) return;
  typingStarted = true;
  typedGreeting.classList.remove("done");
  typedGreeting.textContent = "";
  let index = 0;
  const type = () => {
    typedGreeting.textContent = greetingText.slice(0, index);
    index += 1;
    if (index <= greetingText.length) {
      window.setTimeout(type, index % 12 === 0 ? 52 : 22);
    } else {
      typedGreeting.classList.add("done");
    }
  };
  type();
}

openGreeting.addEventListener("click", () => {
  playBell();
  fireConfetti();
  revealGreeting();
  showToast("Ucapan spesial dibuka pelan-pelan.");
  document.getElementById("ucapan").scrollIntoView({ behavior: "smooth", block: "start" });
});

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        revealGreeting();
      }
    });
  },
  { threshold: 0.3 }
);

cardObserver.observe(greetingCard);

function createBurst(x, y, amount = 14) {
  for (let index = 0; index < amount; index += 1) {
    const particle = document.createElement("span");
    particle.className = index % 3 === 0 ? "burst-star" : "burst-heart";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty("--x", `${Math.random() * 190 - 95}px`);
    particle.style.setProperty("--y", `${-60 - Math.random() * 120}px`);
    document.body.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove());
  }
}

const smileButton = document.getElementById("smileButton");
const smileModal = document.getElementById("smileModal");
const modalClose = document.getElementById("modalClose");
const modalOk = document.getElementById("modalOk");
const secretButton = document.getElementById("secretButton");
const secretMessage = document.getElementById("secretMessage");

function openSmileModal() {
  smileModal.classList.add("is-open");
  smileModal.setAttribute("aria-hidden", "false");
  modalOk.focus();
}

function closeSmileModal() {
  smileModal.classList.remove("is-open");
  smileModal.setAttribute("aria-hidden", "true");
  smileButton.focus();
}

smileButton.addEventListener("click", () => {
  const rect = smileButton.getBoundingClientRect();
  createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
  playBell();
  openSmileModal();
});

modalClose.addEventListener("click", closeSmileModal);
modalOk.addEventListener("click", closeSmileModal);
smileModal.addEventListener("click", (event) => {
  if (event.target === smileModal) closeSmileModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && smileModal.classList.contains("is-open")) {
    closeSmileModal();
  }
});

secretButton.addEventListener("click", () => {
  secretMessage.hidden = false;
  const rect = secretButton.getBoundingClientRect();
  createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
  playCollect();
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("scoreText");
const gameTip = document.getElementById("gameTip");
const gameMessage = document.getElementById("gameMessage");
const gameOverlay = document.getElementById("gameOverlay");
const overlayText = document.getElementById("overlayText");
const restartButton = document.getElementById("restartButton");

const game = {
  width: 960,
  height: 420,
  groundY: 326,
  state: "idle",
  frame: 0,
  distance: 0,
  speed: 5,
  score: 0,
  nextMessageScore: 40,
  obstacleTimer: 90,
  collectibleTimer: 58,
  obstacles: [],
  collectibles: [],
  particles: [],
  player: {
    x: 146,
    y: 254,
    w: 82,
    h: 72,
    vy: 0,
    grounded: true
  }
};

const obstacleTypes = [
  { type: "stone", w: 48, h: 30 },
  { type: "fence", w: 64, h: 58 },
  { type: "hay", w: 58, h: 46 },
  { type: "bucket", w: 42, h: 50 }
];

const itemTypes = [
  { type: "ketupat", value: 10 },
  { type: "star", value: 10 },
  { type: "leaf", value: 8 },
  { type: "heart", value: 12 }
];

function resetGame(mode = "idle") {
  game.state = mode;
  game.frame = 0;
  game.distance = 0;
  game.speed = 5;
  game.score = 0;
  game.nextMessageScore = 40;
  game.obstacleTimer = 80;
  game.collectibleTimer = 55;
  game.obstacles = [];
  game.collectibles = [];
  game.particles = [];
  game.player.x = 146;
  game.player.w = 82;
  game.player.h = 72;
  game.player.y = game.groundY - game.player.h;
  game.player.vy = 0;
  game.player.grounded = true;
  scoreText.textContent = "Skor Berkah: 0";
  gameMessage.textContent = "Bantu sapi kecil mengumpulkan berkah di kebun hijau.";
}

function startGame() {
  resetGame("running");
  gameOverlay.classList.add("hidden");
  restartButton.hidden = true;
  gameTip.textContent = "Space untuk melompat";
  gameMessage.textContent = "Lompat yang manis, ambil berkahnya.";
  playMoo();
}

function endGame() {
  game.state = "over";
  gameOverlay.classList.remove("hidden");
  restartButton.hidden = false;
  overlayText.textContent = "Sapi kecilnya kesandung, tapi tetap sayang kamu.";
  gameTip.textContent = "Main Lagi";
  gameMessage.textContent = "Sapi kecilnya kesandung, tapi tetap sayang kamu.";
  playGameOver();
}

function jumpPlayer() {
  if (game.state !== "running") return;
  if (!game.player.grounded) return;
  game.player.vy = -15.8;
  game.player.grounded = false;
  playJump();
}

function spawnObstacle() {
  const data = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
  game.obstacles.push({
    ...data,
    x: game.width + 30,
    y: game.groundY - data.h,
    passed: false
  });
}

function spawnCollectible() {
  const data = itemTypes[Math.floor(Math.random() * itemTypes.length)];
  const lane = Math.random() > 0.52 ? 118 : 166;
  game.collectibles.push({
    ...data,
    x: game.width + 40,
    y: game.groundY - lane,
    r: 18,
    wobble: Math.random() * Math.PI * 2
  });
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function playerHitbox() {
  return {
    x: game.player.x + 10,
    y: game.player.y + 14,
    w: game.player.w - 22,
    h: game.player.h - 16
  };
}

function obstacleHitbox(obstacle) {
  return {
    x: obstacle.x + 8,
    y: obstacle.y + 8,
    w: obstacle.w - 16,
    h: obstacle.h - 8
  };
}

function collectibleHitbox(item) {
  return {
    x: item.x - item.r + 4,
    y: item.y - item.r + 4,
    w: item.r * 2 - 8,
    h: item.r * 2 - 8
  };
}

function addCanvasParticles(x, y, color) {
  for (let index = 0; index < 10; index += 1) {
    game.particles.push({
      x,
      y,
      vx: Math.random() * 4 - 2,
      vy: -2 - Math.random() * 3,
      life: 34,
      color
    });
  }
}

function updateGame() {
  if (game.state !== "running") return;

  game.frame += 1;
  game.distance += game.speed;
  game.speed = Math.min(9.6, game.speed + 0.0019);

  game.player.vy += 0.72;
  game.player.y += game.player.vy;
  if (game.player.y >= game.groundY - game.player.h) {
    game.player.y = game.groundY - game.player.h;
    game.player.vy = 0;
    game.player.grounded = true;
  }

  game.obstacleTimer -= 1;
  if (game.obstacleTimer <= 0) {
    spawnObstacle();
    game.obstacleTimer = Math.floor(78 + Math.random() * 74 - game.speed * 3);
  }

  game.collectibleTimer -= 1;
  if (game.collectibleTimer <= 0) {
    spawnCollectible();
    game.collectibleTimer = Math.floor(54 + Math.random() * 84);
  }

  const hitbox = playerHitbox();
  game.obstacles.forEach((obstacle) => {
    obstacle.x -= game.speed;
    if (rectsOverlap(hitbox, obstacleHitbox(obstacle))) {
      endGame();
    }
  });

  game.collectibles.forEach((item) => {
    item.x -= game.speed;
    item.wobble += 0.08;
    if (rectsOverlap(hitbox, collectibleHitbox(item))) {
      item.collected = true;
      game.score += item.value;
      scoreText.textContent = `Skor Berkah: ${game.score}`;
      playCollect();
      addCanvasParticles(item.x, item.y, item.type === "heart" ? "#f19aa8" : "#f4b94f");

      if (game.score >= game.nextMessageScore) {
        gameMessage.textContent = blessingMessages[Math.floor(Math.random() * blessingMessages.length)];
        game.nextMessageScore += 40;
      }
    }
  });

  game.obstacles = game.obstacles.filter((obstacle) => obstacle.x + obstacle.w > -20);
  game.collectibles = game.collectibles.filter((item) => !item.collected && item.x + item.r > -20);
}

function updateParticles() {
  game.particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.14;
    particle.life -= 1;
  });
  game.particles = game.particles.filter((particle) => particle.life > 0);
}

function roundedRect(context, x, y, w, h, radius) {
  const r = Math.min(radius, w / 2, h / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.closePath();
}

function drawCloud(x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.beginPath();
  ctx.ellipse(0, 18, 36, 18, 0, 0, Math.PI * 2);
  ctx.ellipse(34, 8, 34, 24, 0, 0, Math.PI * 2);
  ctx.ellipse(70, 18, 40, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, game.height);
  gradient.addColorStop(0, "#b5edff");
  gradient.addColorStop(0.58, "#e7fbff");
  gradient.addColorStop(0.59, "#c7edb5");
  gradient.addColorStop(1, "#6fc777");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, game.width, game.height);

  ctx.fillStyle = "#ffda6b";
  ctx.beginPath();
  ctx.arc(820, 64, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.28;
  ctx.beginPath();
  ctx.arc(820, 64, 66, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const cloudShift = game.state === "running" ? game.distance * 0.18 : game.frame * 0.18;
  for (let i = 0; i < 5; i += 1) {
    const x = ((i * 260 - cloudShift) % 1240) - 130;
    drawCloud(x, 54 + (i % 2) * 62, i % 2 ? 0.74 : 1);
  }

  ctx.fillStyle = "#9ed889";
  ctx.beginPath();
  ctx.ellipse(250, 290, 260, 78, 0, 0, Math.PI * 2);
  ctx.ellipse(650, 288, 340, 88, 0, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasMosque(414, 218, 0.85);
  drawCanvasTree(88, 226, 0.86);
  drawCanvasPalm(770, 228, 0.78);

  const fenceShift = game.state === "running" ? game.distance * 0.55 : 0;
  for (let x = -90 - (fenceShift % 150); x < game.width + 120; x += 150) {
    drawFence(x, 274);
  }

  const grassShift = game.state === "running" ? game.distance : game.frame * 0.2;
  ctx.fillStyle = "#58b867";
  ctx.fillRect(0, game.groundY, game.width, game.height - game.groundY);
  ctx.strokeStyle = "rgba(255,255,255,0.32)";
  ctx.lineWidth = 2;
  for (let x = -30 - (grassShift % 28); x < game.width + 30; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, game.groundY + 54);
    ctx.quadraticCurveTo(x + 10, game.groundY + 24, x + 26, game.groundY + 2);
    ctx.stroke();
  }
}

function drawCanvasMosque(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#fff8dc";
  roundedRect(ctx, -70, 10, 140, 70, 12);
  ctx.fill();
  ctx.fillStyle = "#f4c85e";
  ctx.beginPath();
  ctx.moveTo(-48, 12);
  ctx.quadraticCurveTo(0, -56, 48, 12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#78b779";
  roundedRect(ctx, -18, 38, 36, 42, 18);
  ctx.fill();
  ctx.fillStyle = "#fff8dc";
  roundedRect(ctx, -104, -10, 24, 92, 12);
  roundedRect(ctx, 80, -10, 24, 92, 12);
  ctx.fill();
  ctx.fillStyle = "#f4c85e";
  roundedRect(ctx, -101, -32, 18, 26, 8);
  roundedRect(ctx, 83, -32, 18, 26, 8);
  ctx.fill();
  ctx.restore();
}

function drawCanvasTree(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#966b43";
  roundedRect(ctx, -10, 8, 20, 80, 10);
  ctx.fill();
  ctx.fillStyle = "#5fbd72";
  ctx.beginPath();
  ctx.arc(-26, -5, 36, 0, Math.PI * 2);
  ctx.arc(18, -28, 42, 0, Math.PI * 2);
  ctx.arc(38, 10, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCanvasPalm(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.rotate(0.08);
  ctx.fillStyle = "#9c7044";
  roundedRect(ctx, -10, -4, 22, 112, 10);
  ctx.fill();
  ctx.rotate(-0.08);
  ctx.fillStyle = "#4caf66";
  for (let i = 0; i < 5; i += 1) {
    ctx.save();
    ctx.rotate(-1.25 + i * 0.62);
    roundedRect(ctx, -4, -64, 82, 24, 14);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawFence(x, y) {
  ctx.save();
  ctx.fillStyle = "#b67844";
  ctx.strokeStyle = "#8d5d3d";
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i += 1) {
    roundedRect(ctx, x + i * 42, y - 36, 16, 58, 5);
    ctx.fill();
    ctx.stroke();
  }
  roundedRect(ctx, x - 10, y - 22, 130, 12, 6);
  ctx.fill();
  roundedRect(ctx, x - 10, y + 2, 130, 12, 6);
  ctx.fill();
  ctx.restore();
}

function drawCow() {
  const p = game.player;
  const legWave = game.state === "running" && p.grounded ? Math.sin(game.frame * 0.32) * 8 : 0;
  ctx.save();
  ctx.translate(p.x, p.y);

  ctx.strokeStyle = "#d8e1d6";
  ctx.lineWidth = 4;
  ctx.fillStyle = "#ffffff";
  roundedRect(ctx, 4, 22, 78, 42, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#2d3f31";
  ctx.beginPath();
  ctx.ellipse(27, 36, 14, 9, -0.3, 0, Math.PI * 2);
  ctx.ellipse(61, 48, 11, 8, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#5e4a3b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(7, 36);
  ctx.quadraticCurveTo(-14, 28, -10, 18);
  ctx.stroke();
  ctx.fillStyle = "#2d3f31";
  ctx.beginPath();
  ctx.arc(-10, 18, 5, 0, Math.PI * 2);
  ctx.fill();

  drawCowLeg(18, 58, legWave);
  drawCowLeg(40, 58, -legWave);
  drawCowLeg(60, 58, legWave);

  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#d8e1d6";
  roundedRect(ctx, 54, -2, 46, 48, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#f2d38b";
  roundedRect(ctx, 66, -12, 8, 16, 4);
  roundedRect(ctx, 82, -12, 8, 16, 4);
  ctx.fill();

  ctx.fillStyle = "#ffd6de";
  ctx.beginPath();
  ctx.ellipse(58, 14, 13, 11, -0.5, 0, Math.PI * 2);
  ctx.ellipse(98, 14, 13, 11, 0.5, 0, Math.PI * 2);
  ctx.fill();

  const blink = game.frame % 180 > 170 ? 1 : 0;
  ctx.fillStyle = "#2a4332";
  if (blink) {
    ctx.fillRect(69, 17, 9, 2);
    ctx.fillRect(83, 17, 9, 2);
  } else {
    ctx.beginPath();
    ctx.arc(73, 17, 3.8, 0, Math.PI * 2);
    ctx.arc(87, 17, 3.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#ffd6de";
  roundedRect(ctx, 68, 27, 22, 14, 8);
  ctx.fill();
  ctx.fillStyle = "#9d6b72";
  ctx.beginPath();
  ctx.arc(75, 34, 2, 0, Math.PI * 2);
  ctx.arc(84, 34, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#2a4332";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(80, 35, 8, 0.1, Math.PI - 0.1);
  ctx.stroke();
  ctx.restore();
}

function drawCowLeg(x, y, wave) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((wave * Math.PI) / 180);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#d8e1d6";
  roundedRect(ctx, -5, 0, 12, 24, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#2d3f31";
  roundedRect(ctx, -7, 19, 16, 7, 4);
  ctx.fill();
  ctx.restore();
}

function drawObstacle(obstacle) {
  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);
  if (obstacle.type === "stone") {
    ctx.fillStyle = "#879882";
    ctx.beginPath();
    ctx.ellipse(24, 23, 25, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.beginPath();
    ctx.ellipse(15, 16, 9, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  if (obstacle.type === "fence") {
    drawFence(4, 35);
  }
  if (obstacle.type === "hay") {
    ctx.fillStyle = "#d9a447";
    roundedRect(ctx, 2, 12, 54, 34, 10);
    ctx.fill();
    ctx.strokeStyle = "#b77833";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(8, 26);
    ctx.lineTo(52, 21);
    ctx.moveTo(12, 38);
    ctx.lineTo(46, 34);
    ctx.stroke();
  }
  if (obstacle.type === "bucket") {
    ctx.fillStyle = "#8fc7d8";
    ctx.beginPath();
    ctx.moveTo(7, 8);
    ctx.lineTo(36, 8);
    ctx.lineTo(31, 50);
    ctx.lineTo(12, 50);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#4a8fa0";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(21, 11, 18, Math.PI, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawStar(x, y, radius) {
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? radius : radius * 0.42;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawHeart(x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 18, size / 18);
  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.bezierCurveTo(-18, -4, -8, -20, 0, -9);
  ctx.bezierCurveTo(8, -20, 18, -4, 0, 8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCollectible(item) {
  const bob = Math.sin(item.wobble) * 5;
  const x = item.x;
  const y = item.y + bob;
  ctx.save();
  ctx.translate(x, y);
  if (item.type === "ketupat") {
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#bddf73";
    roundedRect(ctx, -14, -14, 28, 28, 5);
    ctx.fill();
    ctx.strokeStyle = "#6da552";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(14, 0);
    ctx.moveTo(0, -14);
    ctx.lineTo(0, 14);
    ctx.stroke();
  }
  if (item.type === "star") {
    ctx.fillStyle = "#f4b94f";
    drawStar(0, 0, 18);
    ctx.fill();
  }
  if (item.type === "leaf") {
    ctx.fillStyle = "#4caf66";
    ctx.rotate(-0.7);
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#2f8f5b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(0, 16);
    ctx.stroke();
  }
  if (item.type === "heart") {
    ctx.fillStyle = "#f19aa8";
    drawHeart(0, 2, 24);
  }
  ctx.restore();
}

function drawParticles() {
  game.particles.forEach((particle) => {
    ctx.globalAlpha = Math.max(0, particle.life / 34);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function drawGame() {
  ctx.clearRect(0, 0, game.width, game.height);
  drawBackground();
  game.collectibles.forEach(drawCollectible);
  game.obstacles.forEach(drawObstacle);
  drawCow();
  drawParticles();
}

function loop() {
  game.frame += game.state === "running" ? 0 : 1;
  updateGame();
  updateParticles();
  drawGame();
  requestAnimationFrame(loop);
}

function handleSpace(event) {
  if (event.code !== "Space") return;
  event.preventDefault();
  ensureAudio();
  if (game.state === "idle" || game.state === "over") {
    startGame();
    return;
  }
  jumpPlayer();
}

window.addEventListener("keydown", handleSpace);

canvas.addEventListener("pointerdown", () => {
  ensureAudio();
  if (game.state === "idle" || game.state === "over") {
    startGame();
  } else {
    jumpPlayer();
  }
});

restartButton.addEventListener("click", startGame);

resetGame("idle");
drawGame();
loop();
