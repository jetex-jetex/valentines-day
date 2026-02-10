// --- Password Protection ---
const correctPassword = 'jafetandrosario<3';
const passwordScreen = document.getElementById('passwordScreen');
const passwordInput = document.getElementById('passwordInput');
const btnUnlock = document.getElementById('btnUnlock');
const errorMessage = document.getElementById('errorMessage');

function checkPassword() {
  const enteredPassword = passwordInput.value;

  if (enteredPassword === correctPassword) {
    passwordScreen.classList.remove('active');
    setTimeout(() => {
      questionScreen.classList.add('active');
    }, 600);
  } else {
    errorMessage.textContent = 'Hmm, that\'s not quite right... try again!';
    passwordInput.value = '';
    passwordInput.focus();

    setTimeout(() => {
      errorMessage.textContent = '';
    }, 3000);
  }
}

btnUnlock.addEventListener('click', checkPassword);
passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    checkPassword();
  }
});

// --- Floating Hearts Background ---
const heartsBg = document.getElementById('heartsBg');
const heartChars = ['♥', '♡', '❤', '❥', '💕'];

function createFloatingHeart() {
  const heart = document.createElement('span');
  heart.classList.add('floating-heart');
  heart.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
  heart.style.left = Math.random() * 100 + '%';
  heart.style.fontSize = (Math.random() * 24 + 12) + 'px';
  heart.style.animationDuration = (Math.random() * 6 + 6) + 's';
  heart.style.animationDelay = Math.random() * 2 + 's';
  heartsBg.appendChild(heart);

  setTimeout(() => heart.remove(), 14000);
}

setInterval(createFloatingHeart, 500);
for (let i = 0; i < 15; i++) {
  setTimeout(createFloatingHeart, i * 200);
}

// --- No Button Runaway Logic ---
const btnNo = document.getElementById('btnNo');
const btnYes = document.getElementById('btnYes');
const questionScreen = document.getElementById('questionScreen');
const successScreen = document.getElementById('successScreen');

const noMessages = [
  'No',
  'Are you sure?',
  'Really sure?',
  'Think again!',
  'Pretty please?',
  'With a cherry on top?',
  'Don\'t break my heart!',
  'I\'ll cry...',
  'You\'re making me sad :(',
  'Fine... just kidding!',
];

let noCount = 0;
let yesScale = 1;

btnNo.addEventListener('mouseenter', () => {
  if (noCount >= 2) {
    runAway();
  }
});

btnNo.addEventListener('click', () => {
  noCount++;

  // Update no button text
  if (noCount < noMessages.length) {
    btnNo.textContent = noMessages[noCount];
  }

  // Grow the yes button
  yesScale += 0.15;
  btnYes.style.transform = `scale(${yesScale})`;
  btnYes.classList.add('growing');
  setTimeout(() => btnYes.classList.remove('growing'), 500);

  // After a couple clicks, make it run away
  if (noCount >= 2) {
    runAway();
  }
});

function runAway() {
  const padding = 80;
  const maxX = window.innerWidth - btnNo.offsetWidth - padding;
  const maxY = window.innerHeight - btnNo.offsetHeight - padding;

  const newX = Math.random() * maxX + padding / 2;
  const newY = Math.random() * maxY + padding / 2;

  btnNo.classList.add('runaway');
  btnNo.style.left = newX + 'px';
  btnNo.style.top = newY + 'px';
}

// --- Yes Button ---
btnYes.addEventListener('click', () => {
  questionScreen.classList.remove('active');

  setTimeout(() => {
    successScreen.classList.add('active');
    launchConfetti();
  }, 400);
});

// --- Confetti ---
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let confettiPieces = [];
let confettiActive = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const confettiColors = [
  '#43a047', '#66bb6a', '#81c784', '#a5d6a7',
  '#4caf50', '#8bc34a', '#e91e63', '#f48fb1',
  '#ff80ab', '#ff4081', '#43a047', '#2e7d32',
];

function createConfettiPiece() {
  return {
    x: Math.random() * canvas.width,
    y: -10,
    w: Math.random() * 10 + 5,
    h: Math.random() * 6 + 3,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 3 + 2,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    opacity: 1,
  };
}

function launchConfetti() {
  confettiActive = true;
  confettiPieces = [];

  // Burst of confetti
  for (let i = 0; i < 150; i++) {
    setTimeout(() => {
      confettiPieces.push(createConfettiPiece());
    }, i * 20);
  }

  // Secondary burst
  setTimeout(() => {
    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        confettiPieces.push(createConfettiPiece());
      }, i * 30);
    }
  }, 1500);

  animateConfetti();
}

function animateConfetti() {
  if (!confettiActive) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiPieces.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05; // gravity
    p.rotation += p.rotationSpeed;

    if (p.y > canvas.height) {
      p.opacity -= 0.02;
    }

    if (p.opacity <= 0) {
      confettiPieces.splice(i, 1);
      return;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });

  if (confettiPieces.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
