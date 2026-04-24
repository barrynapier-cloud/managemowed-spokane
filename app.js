/* ========================================
   ManageMowed Spokane — App JS
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

  // News cards (dynamic layout)
  gsap.from('.news-card-featured, .news-card-compact', {
    scrollTrigger: {
      trigger: '.news-grid-dynamic',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.15,
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

// === BEFORE / AFTER SLIDER ===
(function () {
  var slider = document.getElementById('baSlider');
  var handle = document.getElementById('baHandle');
  if (!slider || !handle) return;
  var beforeEl = slider.querySelector('.ba-before');
  var isDragging = false;
  function getPosition(e) {
    var rect = slider.getBoundingClientRect();
    var x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    return Math.max(0, Math.min(x / rect.width, 1));
  }
  function updateSlider(pos) {
    var pct = pos * 100;
    beforeEl.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    handle.style.left = pct + '%';
  }
  slider.addEventListener('mousedown', function (e) { e.preventDefault(); isDragging = true; updateSlider(getPosition(e)); });
  slider.addEventListener('touchstart', function (e) { isDragging = true; updateSlider(getPosition(e)); }, { passive: true });
  window.addEventListener('mousemove', function (e) { if (!isDragging) return; e.preventDefault(); updateSlider(getPosition(e)); });
  window.addEventListener('touchmove', function (e) { if (!isDragging) return; updateSlider(getPosition(e)); }, { passive: true });
  window.addEventListener('mouseup',  function () { isDragging = false; });
  window.addEventListener('touchend', function () { isDragging = false; });
})();

// === ANIMATED STAT COUNTERS ===
(function () {
  var section = document.querySelector('.stats-counter');
  var counters = document.querySelectorAll('.stat-number');
  if (!section || !counters.length) return;

  function runAnimation() {
    counters.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-target')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 2000;
      var startTime = null;
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      }
      requestAnimationFrame(step);
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runAnimation();
          obs.disconnect();
        }
      });
    }, { threshold: 0.25 });
    observer.observe(section);
  } else {
    runAnimation();
  }
})();
