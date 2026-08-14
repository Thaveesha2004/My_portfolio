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
