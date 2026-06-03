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

    nodes.forEach(n => {
      n.mesh.position.x += n.vx;
      n.mesh.position.y += n.vy;
      if (Math.abs(n.mesh.position.x) > 40) n.vx *= -1;
      if (Math.abs(n.mesh.position.y) > 30) n.vy *= -1;
    });

    const s = 1 + Math.sin(t * 2.5) * 0.15;
    ring.scale.set(s, s, s);
    ring.material.opacity = 0.2 + Math.cos(t * 4) * 0.05;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  });
})();

// Form handling is now done via FormSubmit.co



const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('form-submit');
    const originalBtnHTML = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    // Get form data and convert to JSON
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => { data[key] = value });

    // Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    // FormSubmit.co AJAX version
    fetch("https://formsubmit.co/ajax/hamdyhaggag74@gmail.com", {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
      signal: controller.signal
    })
    .then(response => {
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      submitBtn.innerHTML = originalBtnHTML;
      submitBtn.disabled = false;
      if (data.success === "true" || data.success === true) {
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      } else {
        // Provide more details if available
        const errorMsg = data.message || 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة لاحقاً.';
        alert(errorMsg);
      }
    })
    .catch(error => {
      submitBtn.innerHTML = originalBtnHTML;
      submitBtn.disabled = false;
      
      if (error.name === 'AbortError') {
        alert('انتهت مهلة الاتصال. يرجى التأكد من جودة الإنترنت والمحاولة مرة أخرى.');
      } else {
        alert('حدث خطأ في الاتصال. يرجى التأكد من اتصالك بالإنترنت والمحاولة مجدداً.');
      }
      console.error('FormSubmit Error:', error);
    });


  });
}

/* ── 9. PHASE SWITCHER (PROJECTS) ───────────── */
const phaseBtns = document.querySelectorAll('.phase-btn');
const phases    = document.querySelectorAll('.projects-phase');

phaseBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-phase');
    phaseBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    phases.forEach(p => {
      p.classList.remove('active');
      if (p.id === target) p.classList.add('active');
    });
  });
});

/* ── 10. SWIPER INSTANCES ─────────────────────── */
new Swiper('.projects-swiper', {
  slidesPerView: 1,
  spaceBetween: 24,
  loop: true,
  autoplay: { delay: 4000, disableOnInteraction: false },
  pagination: { el: '.swiper-pagination', clickable: true },
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  breakpoints: {
    768: { slidesPerView: 2 },
    1100: { slidesPerView: 3 }
  }
});
