/* ============================================================
   SUMMIT.DEV — Main Script
   Contains: Navbar, Custom Cursor, Canvas Particles,
   Typewriter, Counter Animation, Scroll Trail,
   Tilt Cards, Ripple Effect, Form Handler, Mobile Menu
   ============================================================ */

'use strict';

// ============================================================
// INIT AOS (Scroll Animations)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 750,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    once: true,
    offset: 80,
  });

  initNavbar();
  initCustomCursor();
  initParticleCanvas();
  initTypewriter();
  initCounters();
  initRippleEffect();
  initTiltCards();
  initTrailProgress();
  initMobileMenu();
  initFormFocusEffects();
  initCVDownload();
});


// ============================================================
// NAVBAR — Glassmorphism on scroll
// ============================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll state
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting based on scroll position
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Smooth scroll on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  // Logo click → scroll top
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    logo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}


// ============================================================
// MOBILE MENU (Hamburger)
// ============================================================
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

function closeMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger) hamburger.classList.remove('active');
  if (navLinks)  navLinks.classList.remove('open');
}


// ============================================================
// CUSTOM CURSOR
// ============================================================
function initCustomCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) return; // touch device

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows immediately
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with lag
  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(animateRing);
  };
  animateRing();

  // Hover effect on interactive elements
  const hoverTargets = 'a, button, .skill-card, .role-card, .timeline-card, .social-link, .chip';

  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}


// ============================================================
// CANVAS PARTICLE SYSTEM
// (Stars / digital nodes in background)
// ============================================================
function initParticleCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width  = W;
  canvas.height = H;

  // Particle config
  const PARTICLE_COUNT = Math.min(Math.floor(W * H / 10000), 120);
  const CONNECTION_DIST = 140;
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.8 + 0.4;
      this.alpha = Math.random() * 0.6 + 0.1;
      this.pulse = Math.random() * Math.PI * 2; // phase offset
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.02;

      if (this.x < -10 || this.x > W + 10) this.vx *= -1;
      if (this.y < -10 || this.y > H + 10) this.vy *= -1;
    }

    draw() {
      const pulsedAlpha = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${pulsedAlpha})`;
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // Grid lines (faint code grid)
  function drawGrid() {
    const gridSize = 60;
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.018)';
    ctx.lineWidth = 0.5;

    for (let x = 0; x < W; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
  }

  // Draw connections between close particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
  }, { passive: true });
}


// ============================================================
// TYPEWRITER EFFECT
// ============================================================
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Navigating Code, Conquering Summits',
    'Leader. Sweeper. Developer.',
    'Building Digital Trails',
    'No Bug Left Behind',
    'From Basecamp to Production',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;
  let timeout;

  function type() {
    const current = phrases[phraseIdx];

    if (!isDeleting) {
      el.textContent = current.slice(0, ++charIdx);

      if (charIdx === current.length) {
        isDeleting = true;
        timeout = setTimeout(type, 2200); // pause at full word
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);

      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
        timeout = setTimeout(type, 400);
        return;
      }
    }

    const speed = isDeleting ? 40 : 60;
    timeout = setTimeout(type, speed);
  }

  // Start after small delay
  setTimeout(type, 800);
}


// ============================================================
// COUNTER ANIMATION (Hero stats)
// ============================================================
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const dur    = 1800;
      const step   = 16;
      const steps  = dur / step;
      const inc    = target / steps;
      let current  = 0;

      const timer = setInterval(() => {
        current += inc;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}


// ============================================================
// SCROLL TRAIL PROGRESS (Experience section)
// ============================================================
function initTrailProgress() {
  const trail    = document.getElementById('trailProgress');
  const timeline = document.querySelector('.timeline-wrapper');
  if (!trail || !timeline) return;

  const updateTrail = () => {
    const rect   = timeline.getBoundingClientRect();
    const winH   = window.innerHeight;
    const start  = rect.top;
    const end    = rect.bottom - winH;
    const total  = rect.height;

    if (start > winH || end < -winH) return;

    const scrolled   = Math.max(0, -start);
    const percentage = Math.min(100, (scrolled / (total - winH * 0.5)) * 100);
    trail.style.height = percentage + '%';
  };

  window.addEventListener('scroll', updateTrail, { passive: true });
  updateTrail();
}


// ============================================================
// RIPPLE EFFECT on Buttons
// ============================================================
function initRippleEffect() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect   = this.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const size   = Math.max(rect.width, rect.height) * 2;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
      `;

      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}


// ============================================================
// TILT EFFECT on Skill Cards
// ============================================================
function initTiltCards() {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;
  if (window.matchMedia('(hover: none)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -8;
      const rotateY = ((x - cx) / cx) * 8;

      card.style.transform = `
        translateY(-6px)
        perspective(600px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'translateY(0) perspective(600px) rotateX(0) rotateY(0)';
      card.style.transition = 'transform 0.4s ease';
    });
  });
}


// ============================================================
// FORM FOCUS GLOW (input-line animation)
// ============================================================
function initFormFocusEffects() {
  const inputs = document.querySelectorAll('.form-group input, .form-group textarea');

  inputs.forEach(input => {
    const line = input.nextElementSibling;

    input.addEventListener('focus', () => {
      if (line) line.style.width = '100%';
    });

    input.addEventListener('blur', () => {
      if (line && !input.value) {
        line.style.width = '0%';
      }
    });
  });
}


// ============================================================
// CONTACT FORM SUBMIT HANDLER
// ============================================================
function handleFormSubmit() {
  const name    = document.getElementById('name');
  const email   = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  const btn     = document.querySelector('.btn-submit');

  // Simple validation
  if (!name?.value.trim() || !email?.value.trim() || !message?.value.trim()) {
    shakeButton(btn);
    return;
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    shakeButton(btn);
    email.focus();
    return;
  }

  // Simulate sending
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Mengirim...</span>';

  setTimeout(() => {
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');

    if (form && success) {
      form.style.display    = 'none';
      success.style.display = 'flex';
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i><span>Kirim Pesan</span><div class="btn-glow"></div>';
  }, 1600);
}

function shakeButton(btn) {
  if (!btn) return;
  btn.classList.add('shake');
  btn.addEventListener('animationend', () => btn.classList.remove('shake'), { once: true });

  // Add shake CSS dynamically if not present
  if (!document.getElementById('shakeStyle')) {
    const style = document.createElement('style');
    style.id = 'shakeStyle';
    style.textContent = `
      @keyframes shake {
        0%,100% { transform: translateX(0); }
        20%      { transform: translateX(-6px); }
        40%      { transform: translateX(6px); }
        60%      { transform: translateX(-4px); }
        80%      { transform: translateX(4px); }
      }
      .shake { animation: shake 0.4s ease; }
    `;
    document.head.appendChild(style);
  }
}


// ============================================================
// SMOOTH SCROLL for all anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') { e.preventDefault(); return; }
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


// ============================================================
// ACTIVE NAV STYLE (inject)
// ============================================================
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
  .nav-link.active {
    color: var(--neon-blue) !important;
    background: var(--neon-blue-dim);
  }
  
  /* Skill progress bar animation trigger */
  .skill-progress {
    width: 0% !important;
    transition: width 1.2s ease 0.3s !important;
  }
  
  .aos-animate .skill-progress {
    width: var(--progress) !important;
  }
`;
document.head.appendChild(activeNavStyle);


// ============================================================
// GLITCH HOVER on hero title — random trigger
// ============================================================
(function() {
  const glitches = document.querySelectorAll('.glitch');
  glitches.forEach(el => {
    let timer;
    el.addEventListener('mouseenter', () => {
      clearTimeout(timer);
    });
    el.addEventListener('mouseleave', () => {
      timer = setTimeout(() => {
        // Trigger random subtle glitch
      }, 200);
    });
  });
})();


// ============================================================
// SCROLL REVEAL — Skill progress bars via IntersectionObserver
// (handles them even if AOS fires before we add the active style)
// ============================================================
(function() {
  const skillCards = document.querySelectorAll('.skill-card');
  const observer   = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.skill-progress');
        if (bar) {
          bar.style.width = bar.style.getPropertyValue('--progress') || 
                            getComputedStyle(bar).getPropertyValue('--progress');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillCards.forEach(card => observer.observe(card));
})();


// ============================================================
// PAGE LOAD — Fade in body
// ============================================================
(function() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
})();

// ============================================================
// DOWNLOAD CV HANDLER (GOOGLE DRIVE VERSION)
// ============================================================
function initCVDownload() {
  const ctaBtn = document.getElementById('ctaBtn');
  if (!ctaBtn) return;

  ctaBtn.addEventListener('click', function(e) {
    e.preventDefault(); // Mencegah lompatan halaman karena '#'

    // MASUKKAN LINK DIRECT DOWNLOAD YANG SUDAH KAMU UBAH DI SINI
    const fileUrl = 'https://docs.google.com/uc?export=download&id=1LqSXx0XrfLvAuxyNxh7_S5gfR81noJai'; 

    // Proses otomatis download di latar belakang
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'CV_Valda.pdf'; // Nama file saat tersimpan di device user
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}