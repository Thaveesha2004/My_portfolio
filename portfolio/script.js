// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function setMenuOpen(open) {
  navLinks.classList.toggle('open', open);
  document.body.classList.toggle('nav-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

navToggle.addEventListener('click', () => {
  setMenuOpen(!navLinks.classList.contains('open'));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    setMenuOpen(false);
    navToggle.focus();
  }
});

// Typewriter effect for hero role
const roles = [
  'Aspiring Cybersecurity Analyst',
  'Cloud Security Enthusiast',
  'Network Security Learner',
  'Full-Stack Developer'
];
const typewriterEl = document.getElementById('typewriter');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typewriterEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typewriterEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

// Fake terminal boot text
const terminalLines = [
  '$ whoami',
  'thaveesha_weerasinghe',
  '',
  '$ cat focus.txt',
  '> Cybersecurity',
  '> Cloud Security',
  '> Network Security',
  '',
  '$ status --check',
  '[OK] Building projects',
  '[OK] Learning daily',
  '[..] Open to opportunities_'
];
const terminalBody = document.getElementById('terminalBody');
let lineIdx = 0;

function typeTerminal() {
  if (lineIdx >= terminalLines.length) return;
  const line = terminalLines[lineIdx];
  let i = 0;
  const rowEl = document.createElement('div');
  terminalBody.appendChild(rowEl);
  const interval = setInterval(() => {
    rowEl.textContent = line.slice(0, i + 1);
    i++;
    if (i >= line.length) {
      clearInterval(interval);
      lineIdx++;
      setTimeout(typeTerminal, 220);
    }
  }, 18);
}
typeTerminal();

// Scroll reveal
const revealTargets = document.querySelectorAll(
  '.about-grid, .skills-grid .skill-card, .projects-grid .project-card, .timeline-item, .cert-grid .cert-card, .contact-grid .contact-card'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => observer.observe(el));

// Active nav link on scroll + glass edge
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a:not(.btn)');

function updateNavState() {
  let current = 'home';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`);
  });
  nav.classList.toggle('is-scrolled', window.scrollY > 8);
}

window.addEventListener('scroll', updateNavState, { passive: true });
updateNavState();
