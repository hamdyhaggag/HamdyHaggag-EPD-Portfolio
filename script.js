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

/* ── 9. PROJECTS DATA & MODAL ─────────────────── */
const isEn = document.documentElement.lang === 'en';

const projectsData = {
  ar: [
    {
      id: 'p1',
      title: 'تصميم شبكة توزيع LV',
      type: 'مشروع بنية تحتية - تجاري سكني',
      tag: 'توزيع الجهد المنخفض (LV)',
      desc: 'تصميم كامل لشبكة توزيع جهد منخفض لمجمع مختلط يشمل حسابات الأحمال المعقدة وتوزيعها لضمان استقرار الشبكة.',
      role: 'مهندس توزيع كهرباء - مسؤول عن الحسابات والمخططات وتنسيق المسارات وتصميم اللوحات العمومية والفرعية.',
      challenge: 'موازنة الأحمال بين الفازات المختلفة مع مراعاة هبوط الجهد (Voltage Drop) في أبعد نقطة بالمجمع لضمان كفاءة وصول التيار.',
      tools: ['ETAP', 'AutoCAD Electrical', 'Excel', 'IEC 60364'],
      results: [
        'توفير 15% من استهلاك الكابلات بفضل التحسين الدقيق للمسارات.',
        'تحقيق كفاءة عالية في توزيع الأحمال بنسبة عدم توازن (Unbalance) أقل من 3%.',
        'ضمان مطابقة النظام بنسبة 100% لمعايير السلامة العالمية.'
      ],
      icon: 'fas fa-network-wired',
      colorClass: 'orange'
    },
    {
      id: 'p2',
      title: 'تصميم مبنى تجاري كهربائي',
      type: 'مشروع تجاري (مول / مجمع إداري)',
      tag: 'التصميم الداخلي الكامل',
      desc: 'إعداد المخططات الكهربائية والإنارة وتوزيع المآخذ وجداول اللوحات لمبنى إداري وتجاري متكامل مع نظام تيار خفيف.',
      role: 'مصمم أنظمة كهرباء - إعداد تقارير الإنارة وحصر الكميات (BOQ) وتصميم أنظمة الحماية والتنسيق مع التكييف.',
      challenge: 'توزيع الإنارة لتحقيق شدة الإضاءة المطلوبة مع تقليل الـ Glare وتفتيت أحمال التكييف والخدمات لتقليل الحمل الإجمالي.',
      tools: ['AutoCAD', 'DIALux EVO', 'Load Schedules', 'Revit'],
      results: [
        'تصميم نظام إنارة موفر للطاقة باستخدام تقنيات LED وحساسات الحركة.',
        'تقليل تكلفة المهمات الكهربائية بنسبة 10% بفضل التوزيع الذكي للأحمال.',
        'إكمال المشروع قبل الموعد بـ 10 أيام.'
      ],
      icon: 'fas fa-building',
      colorClass: 'amber'
    },
    {
      id: 'p3',
      title: 'تصميم نظام إنارة الشوارع',
      type: 'مشروع بنية تحتية - طرق',
      tag: 'إنارة خارجية دقيقة',
      desc: 'تصميم نظام إنارة شوارع موفر للطاقة يعتمد على تقنيات LED الحديثة مع حسابات الـ Photometry لضمان وضوح الرؤية.',
      role: 'مهندس إنارة - مسؤول عن توزيع القطب الكهربائي وحسابات شدة الإضاءة وتوزي القواعد الأرضية.',
      challenge: 'تحقيق توحيد الإضاءة (Uniformity) على طول الطريق مع تقليل التكلفة الإجمالية للأعمدة والكابلات المغذية.',
      tools: ['DIALux', 'Relux', 'AutoCAD'],
      results: [
        'تحقيق معايير السلامة المرورية العالمية لشدة الإضاءة المطلوبة.',
        'تقليل الفاقد الكهربائي بنسبة 12% باستخدام كوابل ذات بصمة كربونية منخفضة.',
        'استخدام تقنيات التحكم الذكي (Dimming) في الساعات المتأخرة لتوفير الطاقة.'
      ],
      icon: 'fas fa-road',
      colorClass: 'green'
    },
    {
      id: 'p4',
      title: 'أتمتة حسابات الأحمال بـ Python',
      type: 'ابتكار تقني - أتمتة',
      tag: 'برمجة هندسية',
      desc: 'تطوير كود بلغة بايثون يقوم بقراءة البيانات من ملفات الـ Excel وتحويلها تلقائياً إلى جداول أحمال (Panel Schedules) جاهزة.',
      role: 'مطور أدوات هندسية - تصميم المنطق البرمجي وربطه بقواعد البيانات الهندسية.',
      challenge: 'التعامل مع التغييرات المكررة في التصميم وتوفير وقت المهندس في إعادة كتابة البيانات يدوياً.',
      tools: ['Python', 'Pandas', 'Openpyxl', 'Tkinter'],
      results: [
        'تقليل وقت إنشاء جداول الأحمال بنسبة 70%.',
        'ضمان دقة الحسابات بنسبة 100% ومنع الخطأ البشري في النقل اليدوي.',
        'إمكانية تعديل الجداول وتحديثها فورياً عند تغيير قيمة أي حمل.'
      ],
      icon: 'fas fa-rocket',
      colorClass: 'blue'
    },
    {
      id: 'p5',
      title: 'تصميم نظام طاقة شمسية (PV)',
      type: 'طاقة متجددة - مشروع سكني',
      tag: 'أنظمة الطاقة المتجددة',
      desc: 'تصميم منظومة خلايا شمسية فوق أسطح مبنى إداري لتقليل الاعتماد على الشبكة العمومية وتوفير الطاقة.',
      role: 'مصمم أنظمة شمسية - دراسة الإشعاع الشمسي، اختيار الألواح والـ Inverters، وحسابات العائد الاقتصادي.',
      challenge: 'تحليل ظلال الأشجار والمباني المجاورة لضمان أقصى كفاءة للألواح على مدار العام.',
      tools: ['PVsyst', 'AutoCAD', 'SMA Design', 'PVSOL'],
      results: [
        'تغطية 40% من استهلاك الكهرباء السنوي للمبنى.',
        'استرداد تكلفة النظام (Payback Period) في أقل من 5 سنوات.',
        'تقليل الانبعاثات الكربونية بمقدار 12 طن سنوياً.'
      ],
      icon: 'fas fa-solar-panel',
      colorClass: 'green'
    },
    {
      id: 'p6',
      title: 'توزيع كهرباء مركز طبي متخصص',
      type: 'مشروع طبي - رعاية صحية',
      tag: 'أنظمة حرجة (IPS/UPS)',
      desc: 'تصميم الأنظمة الكهربائية لعيادات ومركز أشعة مع التركيز على استمرارية الخدمة (Continuity of Supply).',
      role: 'مهندس تصميم كهربائي - توزيع الأحمال الحرجة، أنظمة ה- UPS، والمولدات الاحتياطية.',
      challenge: 'الالتزام بمعايير الـ IEC 60364-7-710 الخاصة بالمنشآت الطبية لضمان سلامة المرضى من التيارات المتسربة.',
      tools: ['ETAP', 'Revit', 'Dialux EVO', 'IEC Standards'],
      results: [
        'تصميم نظام تأريض معزول (IPS) لغرف العمليات بمستوى أمان 100%.',
        'ضمان انتقال الطاقة للمولد خلال أقل من 10 ثواني عند انقطاع الشبكة.',
        'تنسيق كامل للمسارات لخدمات الغازات الطبية والتكييف.'
      ],
      icon: 'fas fa-hospital',
      colorClass: 'turquoise'
    }
  ],
  en: [
    {
      id: 'p1',
      title: 'LV Distribution Network Design',
      type: 'Infrastructure - Commercial/Residential',
      tag: 'Low Voltage (LV) Distribution',
      desc: 'Complete design of an LV distribution network for a mixed-use complex including complex load calculations.',
      role: 'Electrical Distribution Engineer - Responsible for calculations, plans, routing, and panel design.',
      challenge: 'Balancing loads between phases and managing Voltage Drop at the farthest points of the complex.',
      tools: ['ETAP', 'AutoCAD Electrical', 'Excel', 'IEC 60364'],
      results: [
        '15% reduction in cable consumption through optimized routing.',
        'Achieved high load balance with less than 3% unbalance.',
        '100% compliance with international safety standards.'
      ],
      icon: 'fas fa-network-wired',
      colorClass: 'orange'
    },
    {
      id: 'p2',
      title: 'Commercial Building Electrical Design',
      type: 'Commercial (Mall / Admin Complex)',
      tag: 'Full Indoor Design',
      desc: 'Preparation of electrical plans, lighting, socket distribution, and panel schedules for an integrated complex.',
      role: 'Electrical Systems Designer - Lighting reports, BOQ, protection system design, and HVAC coordination.',
      challenge: 'Achieving required LUX levels while minimizing glare and optimizing HVAC load distribution.',
      tools: ['AutoCAD', 'DIALux EVO', 'Load Schedules', 'Revit'],
      results: [
        'Energy-efficient lighting design using LED and motion sensors.',
        '10% reduction in electrical component costs through smart load distribution.',
        'Completed project 10 days ahead of schedule.'
      ],
      icon: 'fas fa-building',
      colorClass: 'amber'
    },
    {
      id: 'p3',
      title: 'Street Lighting System Design',
      type: 'Infrastructure - Roads',
      tag: 'Precision Outdoor Lighting',
      desc: 'Design of an energy-efficient street lighting system using modern LED technology and Photometry analysis.',
      role: 'Lighting Engineer - Responsible for pole placement, LUX calculations, and cable sizing.',
      challenge: 'Achieving lighting Uniformity along the road while minimizing the number of poles and cable lengths.',
      tools: ['DIALux', 'Relux', 'AutoCAD'],
      results: [
        'Met international traffic safety standards for lighting intensity.',
        '12% reduction in electrical losses using low-carbon footprint cables.',
        'Implemented smart dimming technologies for late-night energy saving.'
      ],
      icon: 'fas fa-road',
      colorClass: 'green'
    },
    {
      id: 'p4',
      title: 'Load Calculation Automation (Python)',
      type: 'Tech Innovation - Automation',
      tag: 'Engineering Programming',
      desc: 'Developed a Python-based tool to automatically read Excel data and generate ready-to-use Panel Schedules.',
      role: 'Engineering Tool Developer - Designing the logic and integrating with engineering databases.',
      challenge: 'Handling frequent design changes and saving engineering time by eliminating manual data entry.',
      tools: ['Python', 'Pandas', 'Openpyxl', 'Tkinter'],
      results: [
        '70% reduction in panel schedule creation time.',
        '100% mathematical accuracy, eliminating human transcription errors.',
        'Instant updates to all schedules when any load value changes.'
      ],
      icon: 'fas fa-rocket',
      colorClass: 'blue'
    },
    {
      id: 'p5',
      title: 'Solar PV System Design',
      type: 'Renewable Energy - Residential',
      tag: 'PV Systems',
      desc: 'Design of a rooftop solar PV system for an administrative building to reduce grid dependency.',
      role: 'Solar Systems Designer - Irradiation analysis, panel/inverter selection, and ROI calculation.',
      challenge: 'Shading analysis from nearby obstacles ensuring maximum annual yield.',
      tools: ['PVsyst', 'AutoCAD', 'SMA Design', 'PVSOL'],
      results: [
        'Covered 40% of the building\'s annual electricity consumption.',
        'Achieved a system payback period of under 5 years.',
        'Prevented 12 tons of CO2 emissions annually.'
      ],
      icon: 'fas fa-solar-panel',
      colorClass: 'green'
    },
    {
      id: 'p6',
      title: 'Medical Center Power Distribution',
      type: 'Medical Project - Healthcare',
      tag: 'Critical Power (IPS/UPS)',
      desc: 'Designing electrical systems for specialized clinics with focus on continuity of supply.',
      role: 'Design Engineer - Critical load partitioning, UPS systems, and standby generators.',
      challenge: 'Compliance with IEC 60364-7-710 for medical locations to ensure patient safety from leakage currents.',
      tools: ['ETAP', 'Revit', 'Dialux EVO', 'IEC Standards'],
      results: [
        '100% safety rating for Operation Theater isolated power system (IPS).',
        'Ensured generator transition time of less than 10 seconds.',
        'Zero coordination clashes with medical gas and HVAC services.'
      ],
      icon: 'fas fa-hospital',
      colorClass: 'turquoise'
    }
  ]
};

function renderProjects() {
  const wrapper = document.querySelector('.projects-swiper-electrical .swiper-wrapper');
  if (!wrapper) return;

  const list = isEn ? projectsData.en : projectsData.ar;

  wrapper.innerHTML = list.map(p => `
    <div class="swiper-slide">
      <div class="project-card glass-card">
        <div class="pc-icon-wrap ${p.colorClass}"><i class="${p.icon}"></i></div>
        <span class="pc-tag">${p.tag}</span>
        <h3 class="pc-title">${p.title}</h3>
        <p class="pc-desc">${p.desc.substring(0, 100)}...</p>
        <div class="pc-tech">
          ${p.tools.slice(0, 3).map(t => `<span>${t}</span>`).join('')}
        </div>
        <button class="btn btn-outline btn-full" style="margin-top:15px; padding: 10px;" onclick="openProject('${p.id}')">
          <i class="fas fa-eye"></i> ${isEn ? 'View Details' : 'تفاصيل المشروع'}
        </button>
      </div>
    </div>
  `).join('');
}

// Global modal elements
const projectModal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const modalOverlay = document.getElementById('modal-overlay');

window.openProject = function(id) {
  const list = isEn ? projectsData.en : projectsData.ar;
  const p = list.find(item => item.id === id);
  if (!p) return;

  const labels = isEn ? {
    type: 'Project Type', desc: 'Description', role: 'Role', challenge: 'Challenge', tools: 'Tools', results: 'Results', view: 'View Deliverables'
  } : {
    type: 'نوع المشروع', desc: 'وصف المشروع', role: 'دوري', challenge: 'التحدي', tools: 'الأدوات', results: 'النتائج', view: 'عرض المخرجات'
  };

  modalBody.innerHTML = `
    <h2>${p.title}</h2>
    <span class="modal-type"><i class="fas fa-bolt"></i> ${p.type}</span>
    <div class="modal-grid">
      <div class="modal-main">
        <div class="modal-section">
          <h4><i class="fas fa-align-left"></i> ${labels.desc}</h4>
          <p>${p.desc}</p>
        </div>
        <div class="modal-section">
          <h4><i class="fas fa-user-tag"></i> ${labels.role}</h4>
          <p>${p.role}</p>
        </div>
        <div class="modal-section">
          <h4><i class="fas fa-exclamation-triangle"></i> ${labels.challenge}</h4>
          <p>${p.challenge}</p>
        </div>
      </div>
      <div class="modal-side">
        <div class="modal-section">
          <h4><i class="fas fa-tools"></i> ${labels.tools}</h4>
          <div class="modal-tags-list">
            ${p.tools.map(t => `<span class="modal-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="modal-section">
          <h4><i class="fas fa-trophy"></i> ${labels.results}</h4>
          <ul>
            ${p.results.map(r => `<li><i class="fas fa-check-circle"></i> ${r}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
  projectModal.classList.add('open');
};

if (modalClose) modalClose.addEventListener('click', () => projectModal.classList.remove('open'));
if (modalOverlay) modalOverlay.addEventListener('click', () => projectModal.classList.remove('open'));

/* ── 10. SWIPER INSTANCES ─────────────────────── */
renderProjects();

new Swiper('.projects-swiper-electrical', {
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

/* ── 11. COUNTER ANIMATION ─────────────────────── */
const counters = document.querySelectorAll('.counter-num, .stat-num');
const startCounter = (el) => {
  const target = +el.getAttribute('data-target');
  let current = 0;
  const update = () => {
    current += target / 100;
    if (current < target) {
      el.innerText = Math.ceil(current);
      requestAnimationFrame(update);
    } else { el.innerText = target; }
  };
  update();
};
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
counters.forEach(c => counterObserver.observe(c));

