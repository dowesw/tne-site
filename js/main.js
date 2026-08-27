/* ═══════════════════════════════════════════════════
   TNE — Main JavaScript
   ═══════════════════════════════════════════════════ */

// ─── Navbar Scroll Effect ──────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── Mobile Menu ───────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ─── Scroll Reveal ─────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ─── Network Canvas (homepage only) ────────────────
const canvas = document.getElementById('networkCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height, nodes;
  const NUM_NODES = 70;
  const MAX_DIST = 140;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function createNodes() {
    nodes = [];
    for (let i = 0; i < NUM_NODES; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1
      });
    }
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(30, 140, 58, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(46, 204, 113, 0.7)';
      ctx.fill();
    });
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
    });
    requestAnimationFrame(drawNetwork);
  }

  window.addEventListener('resize', () => { resize(); createNodes(); });
  resize();
  createNodes();
  drawNetwork();
}

// ─── Active Nav Link on Scroll ──────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

if (sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObserver.observe(s));
}

// ─── Nav active style ──────────────────────────────
const activeStyle = document.createElement('style');
activeStyle.textContent = `.nav-link.active { color: var(--accent) !important; }`;
document.head.appendChild(activeStyle);

// ─── Contact Form ───────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '✓ Message envoyé !';
    btn.style.background = 'linear-gradient(135deg, #1e8c3a, #2ecc71)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = 'Envoyer le message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}
