// ================= THEME TOGGLE (HERO ONLY) =================
const themeCheckbox = document.getElementById("theme-checkbox");
const body = document.body;

themeCheckbox.addEventListener("change", () => {
  if (themeCheckbox.checked) {
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
  }
});

// ================= SECTION FADE-IN =================
const allSections = document.querySelectorAll("section");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.5 }
);

allSections.forEach(section => observer.observe(section));

// ================= TIMELINE + HERO STATE =================
const timeline = document.getElementById("timeline");
const heroSection = document.getElementById("hero");
const rocket = document.getElementById("rocket");

const heroObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // HERO VISIBLE
        body.classList.add("in-hero");
        timeline.classList.remove("visible");
        rocket.classList.remove("idle");
      } else {
        // HERO NOT VISIBLE
        body.classList.remove("in-hero");
        timeline.classList.add("visible");
        rocket.classList.add("idle");
      }
    });
  },
  { threshold: 0.6 }
);

heroObserver.observe(heroSection);

// ================= ROCKET SCROLL MOVEMENT =================
const dots = document.querySelectorAll(".timeline-dot");
const sections = document.querySelectorAll("section:not(#hero)");

function updateRocketPosition() {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const allSecs = [heroSection, ...sections];

  // Find active section
  let activeIndex = 0;
  allSecs.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= viewportHeight / 2 && rect.bottom >= viewportHeight / 2) {
      activeIndex = index;
    }
  });

  // Highlight dot
  dots.forEach(dot => dot.classList.remove("active"));
  if (dots[activeIndex]) dots[activeIndex].classList.add("active");

  // Continuous rocket movement
  const sectionCenters = allSecs.map(s => s.offsetTop + s.offsetHeight / 2);
  let lowerIndex = 0;
  for (let i = 0; i < sectionCenters.length - 1; i++) {
    if (
      scrollY + viewportHeight / 2 >= sectionCenters[i] &&
      scrollY + viewportHeight / 2 <= sectionCenters[i + 1]
    ) {
      lowerIndex = i;
      break;
    }
  }
  const upperIndex = Math.min(lowerIndex + 1, sectionCenters.length - 1);
  const secLower = sectionCenters[lowerIndex];
  const secUpper = sectionCenters[upperIndex];
  const progress =
    secUpper - secLower === 0
      ? 0
      : (scrollY + viewportHeight / 2 - secLower) / (secUpper - secLower);

  const dotLower =
    dots[lowerIndex].offsetTop + dots[lowerIndex].offsetHeight / 2 - rocket.offsetHeight / 2;
  const dotUpper =
    dots[upperIndex].offsetTop + dots[upperIndex].offsetHeight / 2 - rocket.offsetHeight / 2;

  const rocketY = dotLower + (dotUpper - dotLower) * progress;
  rocket.style.transform = `translateY(${rocketY}px)`;
}

// ================= DYNAMIC SECTION BACKGROUNDS =================
function updateSectionBackgrounds() {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const allSecs = [heroSection, ...sections];
  const startColor = [52, 73, 94];  // #34495e
  const endColor = [107, 147, 187]; // #6b93bb

  allSecs.slice(1).forEach((section, i) => {
    const t = i / (allSecs.length - 2);
    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * t);
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * t);
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * t);
    section.style.backgroundColor = `rgb(${r},${g},${b})`;
  });
}

// ================= SCROLL IDLE DETECTION =================
let scrollTimeout;
window.addEventListener("scroll", () => {
  rocket.classList.remove("idle");
  updateRocketPosition();
  updateSectionBackgrounds();

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    rocket.classList.add("idle");
  }, 150);
});

// Initialize
updateSectionBackgrounds();
updateRocketPosition();
document.getElementById("year").textContent = new Date().getFullYear();

// ================= TIMELINE DOT CLICK =================
dots.forEach(dot => {
  dot.addEventListener("click", () => {
    const sectionId = dot.dataset.section;
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // Show tooltip with section name on hover
  dot.addEventListener("mouseenter", () => {
    const name = dot.dataset.section;
    const tooltip = document.createElement("div");
    tooltip.className = "timeline-tooltip";
    tooltip.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    document.body.appendChild(tooltip);

    const rect = dot.getBoundingClientRect();
    tooltip.style.left = `${rect.right + 10}px`;
    tooltip.style.top = `${rect.top + rect.height / 2 - tooltip.offsetHeight / 2}px`;

    dot._tooltip = tooltip;
  });

  dot.addEventListener("mouseleave", () => {
    if (dot._tooltip) {
      dot._tooltip.remove();
      dot._tooltip = null;
    }
  });
});

// ================= HERO MENU ACTIVE STATE =================
const heroMenuLinks = document.querySelectorAll(".menu-hero a");
heroMenuLinks.forEach(link => {
  link.addEventListener("click", () => {
    heroMenuLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

let lastScrollY = window.scrollY;
//const rocket = document.getElementById("rocket");

window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
        // Scrolling DOWN
        rocket.classList.remove("up");
    } else {
        // Scrolling UP
        rocket.classList.add("up");
    }

    lastScrollY = currentScrollY;
});



function updateHeroDarkSwap() {
    const darkSwapImgs = document.querySelectorAll(".hero-img-dark-swap");
    darkSwapImgs.forEach(img => {
        if (document.body.classList.contains("dark")) {
            img.src = img.dataset.dark;
        } else {
            img.src = img.dataset.light;
        }
    });
}

// Run on page load
updateHeroDarkSwap();

// Run whenever theme toggles
const themeToggle = document.getElementById("theme-checkbox");
themeToggle.addEventListener("change", updateHeroDarkSwap);


/* ================= MORE SECTION ANIMATIONS ================= */
const overlay = document.getElementById("easter-overlay");

/* --- Row 2: Snow + Skier --- */
const skiImage = document.getElementById("ski-image");
skiImage.addEventListener("click", () => startSnowAndSkier());

function startSnowAndSkier() {
  overlay.innerHTML = "";

  // Snowflakes
  for (let i = 0; i < 50; i++) {
    const flake = document.createElement("div");
    flake.className = "snowflake";
    flake.style.position = "absolute";
    flake.style.top = "-10px";
    flake.style.left = `${Math.random() * window.innerWidth}px`;
    flake.style.fontSize = `${8 + Math.random() * 12}px`;
    flake.textContent = "❄️";
    overlay.appendChild(flake);

    animateSnowflake(flake);
  }

  //SKIER ANIMATION
const skier = document.createElement("img");
skier.src = "images/skier.svg"; // 🔧 Replace with your skier SVG
skier.style.position = "absolute";
skier.style.width = "100px";     // 🔧 Change size here
overlay.appendChild(skier);

const screenWidth = overlay.clientWidth;
const screenHeight = overlay.clientHeight;

let progress = 0;              // 0 → 1 from top to bottom
const speed = 0.0025;          // 🔧 Adjust for downhill speed
const curveAmplitude = 200;    // 🔧 Max horizontal displacement from center
const curveFrequency = 2;      // 🔧 Number of curves (waves) along the slope

function moveSkier() {
    progress += speed;
    if (progress > 1) {
        skier.remove();        // remove when reached bottom
        return;
    }

    // Vertical position goes from top to bottom
    const y = progress * screenHeight;

    // Horizontal sine curve centered on screen
    const centerX = screenWidth / 2;
    const x = centerX + curveAmplitude * Math.sin(progress * Math.PI * curveFrequency);

    skier.style.left = `${x}px`;
    skier.style.top = `${y}px`;

    // Flip skier depending on slope (derivative of sine)
    const slope = Math.cos(progress * Math.PI * curveFrequency);
    skier.style.transform = `scaleX(${slope >= 0 ? 1 : -1})`;

    requestAnimationFrame(moveSkier);
}

moveSkier();



  function animateSnowflake(flake) {
    let y = -10;
    const speedY = 0.8 + Math.random() * 1.2;
    const xAmplitude = 5 + Math.random() * 3; // smaller horizontal oscillation
    let xBase = parseFloat(flake.style.left);

    function fall() {
      y += speedY;
      flake.style.top = y + "px";
      flake.style.left = xBase + Math.sin(y / 100) * xAmplitude + "px"; // smoother
      if (y < window.innerHeight) requestAnimationFrame(fall);
      else flake.remove();
    }
    fall();
  }
}

/* --- Row 2: Hiker Animation (SEPARATE) --- */
const hikeImage = document.getElementById("hike-image");
hikeImage.addEventListener("click", () => startHikeAnimation());

function startHikeAnimation() {
    overlay.innerHTML = "";

    /* --- Hiking Emojis (Sun + Boots) --- */
    const hikeEmojis = ["☀️", "🥾"];

    for (let i = 0; i < 25; i++) { // 🔧 HALF the amount (was 50)
    const emoji = document.createElement("div");
    emoji.className = "hike-emoji";
    emoji.textContent = hikeEmojis[Math.floor(Math.random() * hikeEmojis.length)];

    emoji.style.position = "absolute";
    emoji.style.top = "-20px"; // 🔧 start above screen
    emoji.style.left = `${Math.random() * window.innerWidth}px`;
    emoji.style.fontSize = `${16 + Math.random() * 10}px`;
    emoji.style.pointerEvents = "none";

    overlay.appendChild(emoji);

    animateHikeEmoji(emoji);
}

    // Hiker SVG
    const hiker = document.createElement("img");
    hiker.src = "images/hiker.svg";
    hiker.style.position = "absolute";
    hiker.style.width = "150px";
    overlay.appendChild(hiker);

    let y = window.innerHeight + 60;
    const speed = 1.5;
    const amplitude = 80;
    const frequency = 2;
    const centerX = window.innerWidth / 2;

    function moveHiker() {
        y -= speed;
        const progress = 1 - y / window.innerHeight;

        const x = centerX + amplitude * Math.sin(progress * Math.PI * frequency);
        hiker.style.left = x + "px";
        hiker.style.top = y + "px";

        const slope = Math.cos(progress * Math.PI * frequency);
        hiker.style.transform = `scaleX(${slope > 0 ? 1 : -1})`;

        if (y > -80) requestAnimationFrame(moveHiker);
        else hiker.remove();
    }

    moveHiker();
}

/* Falling emojis */

function animateHikeEmoji(el) {
  let y = -20;
  const speedY = 0.7 + Math.random() * 1.0; // 🔧 gentle falling speed
  const xAmplitude = 4 + Math.random() * 3; // 🔧 VERY small oscillation
  const xBase = parseFloat(el.style.left);

  function fall() {
    y += speedY;
    el.style.top = y + "px";
    el.style.left = xBase + Math.sin(y / 90) * xAmplitude + "px";

    if (y < window.innerHeight + 30) {
      requestAnimationFrame(fall);
    } else {
      el.remove();
    }
  }

  fall();
}


/* --- Row 3: F1 Animation (2 laps only) --- */
const f1Image = document.getElementById("f1-image");
f1Image.addEventListener("click", () => startF1Animation());

function startF1Animation() {
  overlay.innerHTML = "";

  const car = document.createElement("img");
  car.src = "images/f1.svg"; // 🔧 F1 animation car
  car.style.position = "absolute";
  car.style.top = "50%";
  car.style.transform = "translateY(-50%) scaleX(1)";
  car.style.width = "180px"; // 🔧 Bigger car
  overlay.appendChild(car);

  const screenWidth = window.innerWidth;
  let direction = 1; // 1=left→right, -1=right→left
  let x = -150;
  let laps = 0;

  function moveCar() {
    const car_speed = 4; // 🔧 CHANGE THIS (try 3–6)
    x += car_speed * direction;

    car.style.left = x + "px";
    car.style.transform = `translateY(-50%) scaleX(${direction})`;

    if ((direction === 1 && x > screenWidth) || (direction === -1 && x < -150)) {
      direction *= -1;
      x = direction === 1 ? -150 : screenWidth + 150;
      laps++;
    }

    if (laps < 2) requestAnimationFrame(moveCar); // stop after 2 laps
    else car.remove();
  }
  moveCar();
}

/* ================= F1 MINIGAME ================= */
function startF1Minigame() {
  overlay.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.zIndex = 1001;
  overlay.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // ================= SETTINGS =================
  const laneWidth = 120;                 
  const lanes = [canvas.width/2 - laneWidth, canvas.width/2]; // two lanes touching
  let carX = lanes[0];

  const carWidth = 120;                   
  const carHeight = 90;                  
  const carOffsetY = 10;                 

  const obstacles = [];
  let score = 0;
  let gameOver = false;

  // obstacle speed and acceleration
  let obstacleSpeed = 2;                 
  let speedIncrement = 0.002;             
  let spawnDelay = 1000;                  
  const minSpawnDelay = 400;             
  let lastSpawn = 0;

  // Key controls
  const keys = {left:false, right:false};
  document.addEventListener("keydown", e => {
    if(e.key==="ArrowLeft") keys.left=true;
    if(e.key==="ArrowRight") keys.right=true;
  });
  document.addEventListener("keyup", e => {
    if(e.key==="ArrowLeft") keys.left=false;
    if(e.key==="ArrowRight") keys.right=false;
  });

  // ================= SPAWN OBSTACLES =================
  function spawnObstacle() {
    if(gameOver) return;

    const lane = lanes[Math.floor(Math.random()*lanes.length)];

    // Randomize size
    const size = 60 + Math.random() * 40; // 🔧 between 60px and 100px
    // Slight horizontal offset to avoid exact overlap
    const offset = Math.random() * (laneWidth - size);

    obstacles.push({
      x: lane + offset,
      y: -size,
      width: size,
      height: size
    });
  }

  function dynamicSpawn(timestamp) {
    if(gameOver) return;
    if(!lastSpawn) lastSpawn = timestamp;

    if(timestamp - lastSpawn > spawnDelay) {
        spawnObstacle();
        lastSpawn = timestamp;
        // gradually decrease spawn delay to increase difficulty
        spawnDelay = Math.max(minSpawnDelay, spawnDelay * 0.97);
    }

    requestAnimationFrame(dynamicSpawn);
  }
  requestAnimationFrame(dynamicSpawn);

  // ================= DRAW ROAD =================
  function drawRoad() {
    ctx.fillStyle = "gray";
    ctx.fillRect(canvas.width/2 - laneWidth, 0, laneWidth*2, canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    // Side lines
    ctx.beginPath();
    ctx.moveTo(canvas.width/2 - laneWidth, 0);
    ctx.lineTo(canvas.width/2 - laneWidth, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width/2 + laneWidth, 0);
    ctx.lineTo(canvas.width/2 + laneWidth, canvas.height);
    ctx.stroke();

    // Middle dashed line
    ctx.setLineDash([20,20]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ================= GAME LOOP =================
  function gameLoop() {
    if(gameOver) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawRoad();

    // Move car
    if(keys.left) carX = lanes[0];
    if(keys.right) carX = lanes[1];

    // Draw car SVG
    const carImg = new Image();
    carImg.src = "images/f1_car.svg"; // 🔧 Replace with your minigame car SVG
    ctx.drawImage(carImg, carX, canvas.height - carHeight - carOffsetY, carWidth, carHeight);

    // Draw obstacles (tires)
    obstacles.forEach((obs, i) => {
      const tireImg = new Image();
      tireImg.src = "images/tire.svg"; // 🔧 Replace with your tire SVG
      ctx.drawImage(tireImg, obs.x, obs.y, obs.width, obs.height);

      obs.y += obstacleSpeed;

      // Collision detection
      if(obs.y + obs.height >= canvas.height - carHeight - carOffsetY &&
         obs.y <= canvas.height - carOffsetY &&
         obs.x < carX + carWidth &&
         obs.x + obs.width > carX) {  // more precise collision
           gameOver = true;
           alert(`Game Over! Score: ${score}`);
           overlay.innerHTML = "";
      }

      if(obs.y > canvas.height) obstacles.splice(i,1);
    });

    score++;
    obstacleSpeed += speedIncrement; // accelerate obstacles
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
}

/* --- F1 Minigame Info Button --- */
const f1InfoBtn = document.getElementById("f1-info-btn");
f1InfoBtn.addEventListener("click", () => {
    alert("Press the arrow keys to move left or right in the minigame. Enjoy!");
    startF1Minigame();
});


/* --- CAROUSEL (variable-width, centered, lazy-safe) --- */
document.querySelectorAll(".carousel").forEach(carousel => {

    const viewport = carousel.querySelector(".carousel-viewport");
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const prevBtn = carousel.querySelector(".carousel-arrow.left");
    const nextBtn = carousel.querySelector(".carousel-arrow.right");

    let index = 0;

    function update() {
        let offset = 0;

        for (let i = 0; i < index; i++) {
            offset += slides[i].offsetWidth;
        }

        track.style.transform = `translateX(-${offset}px)`;

        /* resize viewport to current slide */
        viewport.style.width = slides[index].offsetWidth + "px";
    }

    prevBtn.addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        update();
    });

    nextBtn.addEventListener("click", () => {
        index = (index + 1) % slides.length;
        update();
    });

    slides.forEach(slide => {
        const img = slide.querySelector("img");
        if (!img.complete) img.addEventListener("load", update);
    });

    update();
});
