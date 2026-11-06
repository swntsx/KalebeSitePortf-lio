/* =========================================
   LENIS SMOOTH SCROLL (Inicialização)
   ========================================= */
if (typeof Lenis !== 'undefined') {
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    smooth: true,
    mouseMultiplier: 1,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

'use strict';

const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => [...document.querySelectorAll(selector)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const whatsappNumber = '5591999141205';

// Menu e navegação mobile
const menuButton = select('.menu-pill');
const menu = select('.menu-overlay');
function setMenu(open) {
  menu.classList.toggle('open', open);
  menu.setAttribute('aria-hidden', String(!open));
  menu.inert = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span').textContent = open ? 'FECHAR' : 'MENU';
  const icon = menuButton.querySelector('svg');
  icon.innerHTML = open
    ? '<path d="M18 6 6 18M6 6l12 12"/>'
    : '<path d="M4 5h16M4 12h16M4 19h16"/>';
  document.body.classList.toggle('menu-open', open);
}
setMenu(false);
if (menuButton && menu) {
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
}

// Entradas suaves (Reveals)
const revealElements = selectAll('.reveal, .project-card, .about-content-wrapper, .services-stage, .process-heading, .contact-form');
if (!reduceMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -8%' });
  revealElements.forEach((element) => { element.classList.add('reveal'); observer.observe(element); });
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

// Scrollspy
const rows = selectAll('.service-row');
const layers = selectAll('.visual-layer');
const steps = selectAll('.timeline-step');
const timeline = select('.timeline');
const progressBar = select('.timeline-progress');
const sections = selectAll('section[id]');
const navLinks = selectAll('.nav-pill-center .nav-link');

let frame = 0;
function updateScroll() {
  frame = 0;
  const anchor = window.innerHeight * 0.65;
  const current = (items) => Math.max(0, items.reduce((active, item, index) => item.getBoundingClientRect().top < anchor ? index : active, 0));
  
  const service = current(rows);
  rows.forEach((row, index) => row.classList.toggle('active', index === service));
  layers.forEach((layer, index) => layer.classList.toggle('active', index === service));
  
  const process = current(steps);
  steps.forEach((step, index) => step.classList.toggle('active', index <= process));
  
  if(timeline && progressBar) {
      const bounds = timeline.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (anchor - bounds.top) / bounds.height));
      progressBar.style.transform = `scaleY(${ratio})`;
  }

  let currentSectionId = '';
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop <= anchor) {
      currentSectionId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSectionId}`) {
      link.classList.add('active');
    }
  });
}
function scheduleScroll() { if (!frame) frame = requestAnimationFrame(updateScroll); }
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll);
updateScroll();

// FAQ
const faqItems = selectAll('.faq-item');
faqItems.forEach((item) => {
  const button = item.querySelector('button');
  if (button) {
    button.addEventListener('click', () => {
      const open = !item.classList.contains('open');
      faqItems.forEach((other) => {
        const selected = other === item && open;
        other.classList.toggle('open', selected);
        const btn = other.querySelector('button');
        if (btn) btn.setAttribute('aria-expanded', String(selected));
      });
    });
  }
});

// Formulário WhatsApp
const form = select('.contact-form');
if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const message = [
        'Olá, Kalebe! Quero solicitar um orçamento.', '',
        `Nome: ${data.get('nome')}`, `WhatsApp: ${data.get('telefone')}`,
        `E-mail: ${data.get('email')}`, `Serviço: ${data.get('servico')}`,
        `Mensagem: ${data.get('mensagem')}`,
      ].join('\n');
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      form.classList.add('submitted');
      form.reset();
      window.setTimeout(() => form.classList.remove('submitted'), 4500);
    });
}

/* =========================================
   CUSTOM SMOOTH CURSOR
   ========================================= */
if (window.matchMedia("(pointer: fine)").matches) {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX, cursorY = mouseY;
  let followerX = mouseX, followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.5;      
    cursorY += (mouseY - cursorY) * 0.5;
    followerX += (mouseX - followerX) * 0.12; 
    followerY += (mouseY - followerY) * 0.12;

    if (cursor) cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    if (follower) follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

/* =========================================
   CÁPSULA COMPACTA
   ========================================= */
(function () {
  const capsule = document.querySelector('.nav-pill-center');
  const firstSection = document.querySelector('#inicio');
  if (!capsule || !firstSection) return;

  let lastScrollY = Math.max(0, window.scrollY);
  let framePending = false;
  const scrollTolerance = 6;

  function updateCapsule() {
    framePending = false;
    const currentScrollY = Math.max(0, window.scrollY);
    const difference = currentScrollY - lastScrollY;
    const passedFirstSection = firstSection.getBoundingClientRect().bottom <= 0;

    if (!passedFirstSection) {
      capsule.classList.remove('is-compact');
      lastScrollY = currentScrollY;
      return;
    }

    if (Math.abs(difference) < scrollTolerance) return;

    capsule.classList.toggle('is-compact', difference > 0);
    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', () => {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(updateCapsule);
  }, { passive: true });
  window.addEventListener('resize', updateCapsule);
  updateCapsule();
})();

/* =========================================
   TILT 3D DINÂMICO NOS PROJETOS
   ========================================= */
if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    const glow = document.createElement('div');
    glow.classList.add('card-glow');
    card.appendChild(glow);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12; 
      const rotateY = ((x - centerX) / centerX) * 12;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.25), transparent 50%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
      glow.style.opacity = '0';
    });
    
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none'; 
      setTimeout(() => { glow.style.opacity = '1'; }, 10);
    });
  });
}

