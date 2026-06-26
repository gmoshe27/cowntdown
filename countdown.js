// Target: Saturday, June 27, 2026 at 5:00 PM Eastern (America/New_York = EDT, UTC-4)
const TARGET = new Date('2026-06-27T17:00:00-04:00');

const els = {
  days:    document.getElementById('days'),
  hours:   document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
};

let prev = {};

function pad(n) { return String(n).padStart(2, '0'); }

// ?t=0 preview mode: instantly jump to the celebration state
const PREVIEW_ZERO = new URLSearchParams(location.search).get('t') === '0';

function update() {
  const now = new Date();
  let diff = PREVIEW_ZERO ? 0 : (TARGET - now);

  if (diff <= 0) {
    celebrate();
    return;
  }

  const days    = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours   = Math.floor(diff / 3600000);  diff -= hours * 3600000;
  const minutes = Math.floor(diff / 60000);    diff -= minutes * 60000;
  const seconds = Math.floor(diff / 1000);

  setVal('days', pad(days));
  setVal('hours', pad(hours));
  setVal('minutes', pad(minutes));
  setVal('seconds', pad(seconds));
}

function setVal(key, val) {
  if (prev[key] !== val) {
    els[key].textContent = val;
    els[key].classList.add('bump');
    setTimeout(() => els[key].classList.remove('bump'), 180);
    prev[key] = val;
  }
}

let celebrating = false;
function celebrate() {
  els.days.textContent = '00';
  els.hours.textContent = '00';
  els.minutes.textContent = '00';
  els.seconds.textContent = '00';
  if (celebrating) return;
  celebrating = true;
  document.body.classList.add('celebrate');
  const card = document.querySelector('.card');
  if (!document.getElementById('itsTime')) {
    const msg = document.createElement('div');
    msg.id = 'itsTime';
    msg.style.cssText = 'font-family:Caveat,cursive;font-size:48px;color:#e76aa0;margin-top:18px;';
    msg.innerHTML = "🎉 It's time! Moo-ve out! 🐮💕";
    card.appendChild(msg);
  }
  showBigCow();
  startFireworks();
  spawnHearts(true);
}

// Big happy cow in the center
function showBigCow() {
  if (document.getElementById('bigCow')) return;
  const cow = document.createElement('div');
  cow.id = 'bigCow';
  cow.textContent = '🐮';
  cow.setAttribute('aria-label', 'Big happy cow');
  document.body.appendChild(cow);
}

// Fireworks
const FIREWORK_EMOJIS = ['🎉','❤️','🎊'];
function startFireworks() {
  launchFirework();
  setInterval(launchFirework, 600);
}

function launchFirework() {
  const layer = document.getElementById('hearts');
  const x = 10 + Math.random() * 80; // vw
  const y = 15 + Math.random() * 50; // vh
  const count = 14;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'firework';
    p.textContent = FIREWORK_EMOJIS[Math.floor(Math.random() * FIREWORK_EMOJIS.length)];
    const angle = (Math.PI * 2 * i) / count;
    const dist = 90 + Math.random() * 60;
    p.style.left = x + 'vw';
    p.style.top = y + 'vh';
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    p.style.fontSize = (16 + Math.random() * 16) + 'px';
    p.style.animationDuration = (0.9 + Math.random() * 0.6) + 's';
    layer.appendChild(p);
    setTimeout(() => p.remove(), 1600);
  }
}

// Floating hearts in the background
const heartsLayer = document.getElementById('hearts');
const HEART_CHARS = ['💕','💖','🌸','🌼','🐮','💐','✨'];

function spawnHeart() {
  const h = document.createElement('div');
  h.className = 'heart';
  h.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
  h.style.left = (Math.random() * 100) + 'vw';
  h.style.fontSize = (16 + Math.random() * 22) + 'px';
  const duration = 8 + Math.random() * 8;
  h.style.animationDuration = duration + 's';
  heartsLayer.appendChild(h);
  setTimeout(() => h.remove(), duration * 1000);
}

function spawnHearts(burst = false) {
  const count = burst ? 30 : 1;
  for (let i = 0; i < count; i++) {
    setTimeout(spawnHeart, i * 80);
  }
}

setInterval(update, 250);
setInterval(spawnHearts, 700);
update();
spawnHearts();
