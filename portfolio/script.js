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

// Scroll reveal
const revealTargets = document.querySelectorAll(
  '.about-grid, .skills-grid .skill-card, .projects-grid .project-card, .timeline-item, .cert-grid .cert-card, .resume-grid, .contact-layout'
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

// Static contact form → mailto
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const subject = contactForm.subject.value.trim();
    const message = contactForm.message.value.trim();
    if (!name || !email || !subject || !message) {
      formStatus.textContent = 'Please fill in every field.';
      return;
    }
    const body = `From: ${name} <${email}>\n\n${message}`;
    const mailto = `mailto:thaveeshaweerasinghe2004@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    formStatus.textContent = 'Opening your email app…';
    window.location.href = mailto;
  });
}

// Network topology background
(function initNetworkBg() {
  const canvas = document.getElementById('net-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  const palette = [
    { r: 58, g: 169, b: 255 },
    { r: 51, g: 214, b: 166 },
    { r: 139, g: 124, b: 255 }
  ];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let particles = [];
  let raf = 0;
  let last = 0;
  let running = false;
  let dpr = 1;
  let linkDist = 130;

  function particleCount(w) {
    if (w < 480) return 22;
    if (w < 768) return 36;
    if (w < 1024) return 52;
    return 68;
  }

  function spawn() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const n = particleCount(w);
    linkDist = w < 768 ? 100 : 130;
    particles = [];
    for (let i = 0; i < n; i++) {
      const c = palette[i % palette.length];
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 24,
        vy: (Math.random() - 0.5) * 24,
        r: 1.1 + Math.random() * 1.3,
        c
      });
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawn();
  }

  function draw() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = dx * dx + dy * dy;
        if (dist < linkDist * linkDist) {
          const t = 1 - Math.sqrt(dist) / linkDist;
          const alpha = t * 0.2;
          ctx.strokeStyle = `rgba(${a.c.r},${a.c.g},${a.c.b},${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.fillStyle = `rgba(${p.c.r},${p.c.g},${p.c.b},0.22)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tick(ts) {
    if (!running) return;
    const dt = Math.min((ts - last) / 1000, 0.048);
    last = ts;
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      else if (p.x > w) { p.x = w; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      else if (p.y > h) { p.y = h; p.vy *= -1; }
    }
    draw();
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (running || reduceMotion.matches) return;
    if (document.visibilityState === 'hidden') return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  resize();
  draw();
  start();

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') stop();
    else start();
  });

  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) {
      stop();
      draw();
    } else {
      start();
    }
  });

  let resizeWait;
  window.addEventListener('resize', () => {
    clearTimeout(resizeWait);
    resizeWait = setTimeout(() => {
      resize();
      draw();
    }, 180);
  });
})();

