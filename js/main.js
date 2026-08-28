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

// ─── Contact Form — Web3Forms ──────────────────────────
const WEB3FORMS_KEY = '3b9792cf-1439-4031-8ce6-fe5013b43b86';

const form = document.getElementById('contactForm');
if (form) {
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnSpinner = document.getElementById('btnSpinner');
  const feedback = document.getElementById('formFeedback');

  const MSG = {
    sending: { fr: 'Envoi en cours…', en: 'Sending…' },
    success: {
      fr: '✅ Votre message a été envoyé ! Nous vous répondrons dans les plus brefs délais.',
      en: '✅ Your message has been sent! We will get back to you shortly.'
    },
    error: {
      fr: '❌ Une erreur est survenue. Veuillez réessayer ou écrire directement à contact@tne-cm.com',
      en: '❌ Something went wrong. Please try again or email contact@tne-cm.com directly.'
    }
  };

  function getLang() {
    return localStorage.getItem('tne-lang') === 'en' ? 'en' : 'fr';
  }

  function showFeedback(type, msg) {
    feedback.textContent = msg;
    feedback.style.display = 'block';
    feedback.style.background = type === 'success'
      ? 'rgba(30,140,58,.18)'
      : 'rgba(220,38,38,.18)';
    feedback.style.color = type === 'success' ? '#4ade80' : '#f87171';
    feedback.style.border = '1px solid ' + (type === 'success' ? '#1e8c3a55' : '#dc262655');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = getLang();

    // Loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnSpinner.style.display = 'inline';
    feedback.style.display = 'none';

    try {
      const data = Object.fromEntries(new FormData(form));
      data.access_key = WEB3FORMS_KEY;
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();

      if (res.ok && json.success) {
        showFeedback('success', MSG.success[lang]);
        form.reset();
        setTimeout(() => { feedback.style.display = 'none'; }, 6000);
      } else {
        throw new Error(json.message || 'Server error');
      }
    } catch {
      showFeedback('error', MSG.error[lang]);
    } finally {
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnSpinner.style.display = 'none';
    }
  });
}
