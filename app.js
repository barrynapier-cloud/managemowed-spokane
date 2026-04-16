/* ========================================
   ManageMowed Seattle — App JS
   ======================================== */

// === NAVBAR SCROLL BEHAVIOR ===
(function () {
  const nav = document.getElementById('navbar');
  let lastScroll = 0;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    if (y > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    if (y > lastScroll && y > 400) {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }
    lastScroll = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
})();

// === MOBILE MENU ===
(function () {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    toggle.classList.toggle('active');
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      toggle.classList.remove('active');
      menu.classList.remove('open');
    });
  });
})();

// (Trust banner uses CSS transitions only, no JS animation needed)

// === GSAP SCROLL ANIMATIONS ===
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.from('.hero-badge', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.3,
    ease: 'power3.out'
  });

  gsap.from('.hero-title .line', {
    opacity: 0,
    y: 40,
    duration: 1,
    stagger: 0.15,
    delay: 0.5,
    ease: 'power3.out'
  });

  gsap.from('.hero-description', {
    opacity: 0,
    x: -30,
    duration: 0.8,
    delay: 1,
    ease: 'power3.out'
  });

  gsap.from('.hero-ctas', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 1.2,
    ease: 'power3.out'
  });

  gsap.from('.hero-trust .trust-item', {
    opacity: 0,
    y: 15,
    duration: 0.6,
    stagger: 0.1,
    delay: 1.5,
    ease: 'power3.out'
  });

  // Service cards
  gsap.from('.service-card', {
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Process steps
  gsap.from('.process-step', {
    scrollTrigger: {
      trigger: '.process-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.2,
    ease: 'power3.out'
  });

  // Area groups
  gsap.from('.area-group', {
    scrollTrigger: {
      trigger: '.areas-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out'
  });

  // Testimonials
  gsap.from('.testimonial-card', {
    scrollTrigger: {
      trigger: '.testimonials-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // About section
  gsap.from('.about-content-col .section-label', {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 70%'
    },
    opacity: 0,
    x: -20,
    duration: 0.6,
    ease: 'power3.out'
  });

  gsap.from('.about-content-col .section-title', {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 70%'
    },
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.1,
    ease: 'power3.out'
  });

  gsap.from('.about-feature', {
    scrollTrigger: {
      trigger: '.about-features',
      start: 'top 85%'
    },
    opacity: 0,
    x: -20,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Snow section
  gsap.from('.snow-content > *', {
    scrollTrigger: {
      trigger: '.snow-break',
      start: 'top 70%'
    },
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power3.out'
  });

  // Guarantee cards
  gsap.from('.guarantee-card', {
    scrollTrigger: {
      trigger: '.guarantees-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // News cards
  gsap.from('.news-card', {
    scrollTrigger: {
      trigger: '.news-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.2,
    ease: 'power3.out'
  });

  // CTA banner
  gsap.from('.cta-inner', {
    scrollTrigger: {
      trigger: '.cta-banner',
      start: 'top 80%'
    },
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power3.out'
  });

  // Contact section
  gsap.from('.contact-info-inner > *', {
    scrollTrigger: {
      trigger: '.contact-wrapper',
      start: 'top 70%'
    },
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out'
  });

  // Hero parallax on background
  gsap.to('.hero-img', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: 120,
    ease: 'none'
  });
})();

// === FORM HANDLING ===
(function () {
  const form = document.getElementById('leadForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Simple validation
    var name = form.querySelector('#fullName');
    var email = form.querySelector('#email');
    var valid = true;

    if (!name.value.trim()) {
      name.style.borderColor = '#ff4444';
      valid = false;
    } else {
      name.style.borderColor = '';
    }

    if (!email.value.trim() || !email.value.includes('@')) {
      email.style.borderColor = '#ff4444';
      valid = false;
    } else {
      email.style.borderColor = '';
    }

    if (!valid) return;

    // Show success
    var col = form.parentElement;
    col.innerHTML = '<div class="form-success">' +
      '<span class="material-symbols-outlined">check_circle</span>' +
      '<h3>Assessment Requested</h3>' +
      '<p>Thank you! A ManageMowed landscape consultant will reach out within 24 hours to schedule your free site assessment.</p>' +
      '</div>';
  });
})();

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var id = this.getAttribute('href');
    if (id === '#') return;
    var target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
