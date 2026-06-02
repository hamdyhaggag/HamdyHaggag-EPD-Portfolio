/* ==============================
   HAMDY HAGGAG — PORTFOLIO JS
   ==============================*/

'use strict';

/* ── 1. AOS INIT ─────────────────────────────── */
AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });

/* ── 2. THEME TOGGLE ────────────────────────── */
const html        = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');

(function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', saved);
  themeIcon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
})();

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeIcon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

/* ── 3. NAVBAR SCROLL ───────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── 4. HAMBURGER ──────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

/* ── 5. SCROLL PROGRESS BAR ─────────────────── */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const docH   = document.documentElement.scrollHeight - window.innerHeight;
  const pct    = docH > 0 ? (window.scrollY / docH) * 100 : 0;
  progressBar.style.width = pct + '%';
});

/* ── 6. CUSTOM CURSOR ──────────────────────── */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

if (cursor && cursorFollower) {
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animFollower() {
    fx += (mx - fx) * 0.14;
    fy += (my - fy) * 0.14;
    cursorFollower.style.left = fx + 'px';
    cursorFollower.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  })();

  document.querySelectorAll('a, button, .glass-card, .aig-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)';
      cursorFollower.style.transform = 'translate(-50%,-50%) scale(1.5)';
      cursorFollower.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursorFollower.style.transform = 'translate(-50%,-50%) scale(1)';
      cursorFollower.style.opacity = '0.5';
    });
  });
}

/* ── 7. THREE.JS HERO BACKGROUND ────────────── */
(function initThreeHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.z = 30;

  /* Grid‑like power‑lines */
  const lineMat = new THREE.LineBasicMaterial({ color: 0xFF8C42, transparent: true, opacity: 0.15 });
  const gridGroup = new THREE.Group();

  for (let i = -20; i <= 20; i += 4) {
    const hGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-40, i, 0), new THREE.Vector3(40, i, 0)]);
    const vGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(i * 2, -30, 0), new THREE.Vector3(i * 2, 30, 0)]);
    gridGroup.add(new THREE.Line(hGeo, lineMat));
    gridGroup.add(new THREE.Line(vGeo, lineMat));
  }
  scene.add(gridGroup);

  /* Floating nodes */
  const nodeMat  = new THREE.MeshBasicMaterial({ color: 0xFF8C42 });
  const nodeGeo  = new THREE.SphereGeometry(0.22, 8, 8);
  const nodes    = [];
  for (let i = 0; i < 40; i++) {
    const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone());
    mesh.position.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 20);
    mesh.material.opacity = Math.random() * 0.5 + 0.1;
    mesh.material.transparent = true;
    nodes.push({ mesh, vx: (Math.random() - 0.5) * 0.04, vy: (Math.random() - 0.5) * 0.04 });
    scene.add(mesh);
  }

  /* Energy pulse ring */
  const ringGeo = new THREE.RingGeometry(4, 4.1, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xFFC857, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
  const ring    = new THREE.Mesh(ringGeo, ringMat);
  scene.add(ring);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    gridGroup.rotation.z  = t * 0.02;
    camera.position.x += (mouseX * 6 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 4 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    ring.scale.setScalar(1 + Math.sin(t * 2) * 0.08);
    ring.material.opacity = 0.12 + Math.sin(t * 3) * 0.08;

    nodes.forEach(n => {
      n.mesh.position.x += n.vx;
      n.mesh.position.y += n.vy;
      if (Math.abs(n.mesh.position.x) > 40) n.vx *= -1;
      if (Math.abs(n.mesh.position.y) > 30) n.vy *= -1;
      n.mesh.material.opacity = 0.15 + Math.abs(Math.sin(t + n.mesh.position.x)) * 0.35;
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();

/* ── 8. PARTICLES.JS ─────────────────────────── */
(function initParticles() {
  if (typeof particlesJS === 'undefined') return;
  particlesJS('particles-js', {
    particles: {
      number: { value: 35, density: { enable: true, value_area: 900 } },
      color: { value: '#FF8C42' },
      shape: { type: 'circle' },
      opacity: { value: 0.25, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.05 } },
      size: { value: 2.5, random: true },
      line_linked: { enable: true, distance: 160, color: '#FF8C42', opacity: 0.08, width: 1 },
      move: { enable: true, speed: 1.2, direction: 'none', random: true, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
      modes: { grab: { distance: 150, line_linked: { opacity: 0.25 } }, push: { particles_nb: 2 } }
    },
    retina_detect: true
  });
})();

/* ── 9. SWIPER.JS PROJECTS ──────────────────── */
function initSwiper(selector) {
  return new Swiper(selector, {
    slidesPerView: 1,
    spaceBetween: 28,
    grabCursor: true,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
      600:  { slidesPerView: 1.4, spaceBetween: 24 },
      900:  { slidesPerView: 2,   spaceBetween: 28 },
      1200: { slidesPerView: 2.5, spaceBetween: 32 }
    }
  });
}

const swiperElec = initSwiper('.projects-swiper-electrical');



/* ── 10. ANIMATED COUNTERS ──────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step     = 16;
  const inc      = target / (duration / step);
  let current    = 0;

  const timer = setInterval(() => {
    current += inc;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-num, .counter-num').forEach(el => counterObserver.observe(el));

/* ── 11. SKILL BAR ANIMATION ────────────────── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      bar.style.width = bar.dataset.width + '%';
      barObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.sw-fill').forEach(bar => barObserver.observe(bar));

/* ── 12. GSAP SCROLL ANIMATIONS ─────────────── */
(function initGSAP() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  /* Floating pulse on hero badge */
  gsap.to('.hero-badge', {
    y: -6, duration: 2.2,
    ease: 'sine.inOut', yoyo: true, repeat: -1
  });

  /* Section titles stagger */
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      scrollTrigger: { trigger: title, start: 'top 88%' },
      opacity: 0, y: 30, duration: 0.7, ease: 'power3.out'
    });
  });

  /* Why cards stagger */
  gsap.from('.why-card', {
    scrollTrigger: { trigger: '.why-grid', start: 'top 80%' },
    opacity: 0, y: 40, stagger: 0.12, duration: 0.6, ease: 'power2.out'
  });

  /* Cert cards stagger */
  gsap.from('.cert-card', {
    scrollTrigger: { trigger: '.cert-grid', start: 'top 82%' },
    opacity: 0, scale: 0.95, stagger: 0.1, duration: 0.5, ease: 'back.out(1.5)'
  });

  /* Journey advantage cards */
  gsap.from('.ja-card', {
    scrollTrigger: { trigger: '.ja-cards', start: 'top 82%' },
    opacity: 0, x: -20, stagger: 0.12, duration: 0.55, ease: 'power2.out'
  });

  /* Hero title dramatic reveal */
  gsap.from('.hero-title', {
    opacity: 0, y: 60, duration: 1.1, ease: 'power4.out', delay: 0.4
  });
})();

/* ── 13. CONTACT FORM ───────────────────────── */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const btn = document.getElementById('form-submit');
    const originalBtnHTML = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    fetch("https://formsubmit.co/ajax/hamdyhaggag74@gmail.com", {
      method: "POST",
      headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      contactForm.reset();
      btn.innerHTML = originalBtnHTML;
      btn.disabled = false;
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    })
    .catch(error => {
      console.error(error);
      btn.innerHTML = originalBtnHTML;
      btn.disabled = false;
      alert("Error sending message. Please try again or use direct email.");
    });
  });
}

/* ── 14. CV DOWNLOAD PLACEHOLDER ────────────── */
document.getElementById('download-cv')?.addEventListener('click', e => {
  e.preventDefault();
  alert('📄 CV will be available for download soon. Please contact me via email or WhatsApp for now!');
});

/* ── 15. ACTIVE NAV LINK ON SCROLL ─────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const matching = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (matching) matching.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* Active nav link style */
const navStyle = document.createElement('style');
navStyle.textContent = `.nav-link.active { color: var(--orange); background: rgba(255,140,66,0.08); }`;
document.head.appendChild(navStyle);

/* ── 16. SMOOTH ANCHOR SCROLL ───────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── 17. FLOATING ELECTRICAL PULSE (canvas) ── */
(function floatingPulse() {
  const canvas = document.createElement('canvas');
  canvas.id    = 'pulse-canvas';
  Object.assign(canvas.style, {
    position: 'fixed', bottom: '0', left: '0', width: '100%', height: '100px',
    pointerEvents: 'none', zIndex: '1', opacity: '0.35'
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = 100;
  }
  resize();
  window.addEventListener('resize', resize);

  let phase = 0;
  function drawPulse() {
    ctx.clearRect(0, 0, w, h);
    const theme = document.documentElement.getAttribute('data-theme');
    ctx.strokeStyle = theme === 'dark' ? 'rgba(255,140,66,0.5)' : 'rgba(255,140,66,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x <= w; x++) {
      const y = h * 0.5 + Math.sin((x / w) * Math.PI * 6 + phase) * 18 + Math.sin((x / w) * Math.PI * 12 + phase * 1.5) * 7;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    phase += 0.04;
    requestAnimationFrame(drawPulse);
  }
  drawPulse();
})();

console.log('%c⚡ Hamdy Haggag Portfolio', 'color:#FF8C42;font-size:20px;font-weight:900;');
console.log('%cElectrical Power & Distribution Engineer', 'color:#FFC857;font-size:12px;');
