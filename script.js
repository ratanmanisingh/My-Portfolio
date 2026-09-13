const portfolio = {
  projects: [
    { index: '01 / HANDS IN MOTION', title: 'Hand Gesture\nRecognition', description: 'A computer vision project exploring real-time interaction through hand movements.', tags: ['Python', 'Computer vision'], url: 'https://github.com/ratanmanisingh/Hand_gesture_project', accent: 'cyan' },
    { index: '02 / CHANCE & LOGIC', title: 'Dice Game', description: 'A text-based Python simulation built as a focused exercise in randomness, loops, and clear logic.', tags: ['Python', 'CLI', 'Logic'], url: 'https://github.com/ratanmanisingh/Dice-Game', accent: 'violet' },
    { index: '03 / DAILY PRACTICE', title: 'DSA Practice', description: 'An evolving collection of problem-solving work and patterns, built through consistent practice.', tags: ['C++', 'Algorithms', 'DSA'], url: 'https://github.com/ratanmanisingh/DSA-Practice', accent: 'gold' },
    { index: '04 / FOUNDATIONS', title: 'C++ Practice', description: 'A growing archive of solved problems that keeps the fundamentals sharp and the learning loop active.', tags: ['C++', 'Problem solving'], url: 'https://github.com/ratanmanisingh/Cpp-Practice-Problems', accent: 'cyan' }
  ]
};

const projectGrid = document.querySelector('#project-grid');
portfolio.projects.forEach((project) => {
  const card = document.createElement('article');
  card.className = 'project-card reveal';
  card.innerHTML = `<div><span class="project-index">${project.index}</span><h3 class="project-title">${project.title.replace('\n', '<br>')}</h3><p class="project-desc">${project.description}</p></div><div class="project-bottom"><div class="tags">${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div><a class="project-link" href="${project.url}" target="_blank" rel="noreferrer" aria-label="View ${project.title.replace('\n', ' ')} on GitHub">View source ↗</a></div>`;
  projectGrid.appendChild(card);
});

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const canvas = document.querySelector('#starfield');
const context = canvas.getContext('2d');
const cursorRing = document.querySelector('.cursor-ring');
let stars = [];
let pointerX = 0;
let pointerY = 0;
let ringX = 0;
let ringY = 0;
let targetRingX = 0;
let targetRingY = 0;
let shootingStars = [];
let lastShootingStar = 0;
function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(devicePixelRatio, devicePixelRatio);
  stars = Array.from({ length: Math.min(220, Math.floor(window.innerWidth / 6)) }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, radius: Math.random() * 1.35 + .2, alpha: Math.random() * .65 + .15, depth: Math.random() * .7 + .3, phase: Math.random() * Math.PI * 2, speed: Math.random() * .08 + .015 }));
}
function drawStars(time = 0) {
  const width = window.innerWidth; const height = window.innerHeight;
  context.clearRect(0, 0, width, height);
  stars.forEach((star) => { star.y -= star.speed * star.depth; if (star.y < -4) star.y = height + 4; const x = star.x + pointerX * star.depth * 10; const y = star.y + pointerY * star.depth * 10; const twinkle = Math.max(.08, star.alpha + Math.sin(time / 900 + star.phase) * .13); context.beginPath(); context.fillStyle = `rgba(207, 220, 255, ${twinkle})`; context.arc((x + width) % width, (y + height) % height, star.radius, 0, Math.PI * 2); context.fill(); });
  if (time - lastShootingStar > 4200 && Math.random() > .985) { shootingStars.push({ x: Math.random() * width, y: Math.random() * height * .55, length: Math.random() * 70 + 45, life: 0 }); lastShootingStar = time; }
  shootingStars = shootingStars.filter((star) => { star.x += 8; star.y += 5; star.life += 1; const gradient = context.createLinearGradient(star.x, star.y, star.x - star.length, star.y - star.length * .62); gradient.addColorStop(0, 'rgba(114,229,226,.8)'); gradient.addColorStop(1, 'rgba(114,229,226,0)'); context.strokeStyle = gradient; context.lineWidth = 1.5; context.beginPath(); context.moveTo(star.x, star.y); context.lineTo(star.x - star.length, star.y - star.length * .62); context.stroke(); return star.life < 34; });
  requestAnimationFrame(drawStars);
}
resizeCanvas(); drawStars();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('pointermove', (event) => { pointerX = event.clientX / window.innerWidth - .5; pointerY = event.clientY / window.innerHeight - .5; targetRingX = event.clientX; targetRingY = event.clientY; document.querySelector('.cursor-glow').style.left = `${event.clientX}px`; document.querySelector('.cursor-glow').style.top = `${event.clientY}px`; });

function animateCursor() {
  ringX += (targetRingX - ringX) * .16;
  ringY += (targetRingY - ringY) * .16;
  if (cursorRing) cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('.project-card, .codolio-panel, .signal-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 800) return;
    const bounds = card.getBoundingClientRect();
    const rotateX = ((event.clientY - bounds.top) / bounds.height - .5) * -3;
    const rotateY = ((event.clientX - bounds.left) / bounds.width - .5) * 3;
    card.style.setProperty('--tilt-x', `${rotateX}deg`);
    card.style.setProperty('--tilt-y', `${rotateY}deg`);
  });
  card.addEventListener('pointerleave', () => { card.style.setProperty('--tilt-x', '0deg'); card.style.setProperty('--tilt-y', '0deg'); });
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => { const isOpen = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', isOpen); });
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }));

const progressBar = document.querySelector('.scroll-progress span');
const dockLinks = [...document.querySelectorAll('.dock-dot')];
const trackedSections = [...document.querySelectorAll('main section[id]')];
const rotatingCopy = document.querySelector('[data-rotating-copy]');
const copyOptions = ['worth exploring.', 'feel alive.', 'solve real problems.'];
let copyIndex = 0;

function updateScrollProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0}%`;
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

if (rotatingCopy && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.setInterval(() => {
    rotatingCopy.classList.add('rotating-out');
    window.setTimeout(() => {
      copyIndex = (copyIndex + 1) % copyOptions.length;
      rotatingCopy.textContent = copyOptions[copyIndex];
      rotatingCopy.classList.remove('rotating-out');
    }, 280);
  }, 3200);
}

const dockObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    dockLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-42% 0px -48% 0px', threshold: 0 });
trackedSections.forEach((section) => dockObserver.observe(section));

document.querySelector('#contact-form').addEventListener('submit', (event) => { event.preventDefault(); const status = document.querySelector('.form-status'); status.textContent = 'Signal prepared. Opening your mail client...'; const formData = new FormData(event.currentTarget); const subject = encodeURIComponent(`Hello Ratanmani — ${formData.get('name')}`); const body = encodeURIComponent(`${formData.get('message')}\n\nReply to: ${formData.get('email')}`); window.location.href = `mailto:ratanmanisingh553@gmail.com?subject=${subject}&body=${body}`; });