/* ========================================
   ManageMowed — App JS (multi-tenant)
   ======================================== */

// === NAVBAR SCROLL BEHAVIOR ===
(function () {
  const nav = document.getElementById('navbar');
  let lastScroll = 0;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    if (y > 80) nav.classList.add('scrolled');
    else        nav.classList.remove('scrolled');
    if (y > lastScroll && y > 400) nav.classList.add('hidden');
    else                            nav.classList.remove('hidden');
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
  const menu   = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'mobileMenu');

  function setOpen(open) {
    toggle.classList.toggle('active', open);
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', function () {
    setOpen(!menu.classList.contains('open'));
  });

  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
})();

// === GSAP SCROLL ANIMATIONS ===
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-title .line', { opacity: 0, y: 40, duration: 1, stagger: 0.15, delay: 0.5, ease: 'power3.out' });
  gsap.from('.hero-description', { opacity: 0, x: -30, duration: 0.8, delay: 1, ease: 'power3.out' });
  gsap.from('.hero-ctas',        { opacity: 0, y: 20, duration: 0.8, delay: 1.2, ease: 'power3.out' });
  gsap.from('.hero-trust .trust-item', { opacity: 0, y: 15, duration: 0.6, stagger: 0.1, delay: 1.5, ease: 'power3.out' });

  gsap.from('.service-card', {
    scrollTrigger: { trigger: '.services-grid', start: 'top 80%', toggleActions: 'play none none none' },
    opacity: 0, y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out'
  });
  gsap.from('.area-group', {
    scrollTrigger: { trigger: '.areas-grid', start: 'top 80%', toggleActions: 'play none none none' },
    opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out'
  });
  gsap.from('.about-content-col .section-label', {
    scrollTrigger: { trigger: '.about-section', start: 'top 70%' },
    opacity: 0, x: -20, duration: 0.6, ease: 'power3.out'
  });
  gsap.from('.about-content-col .section-title', {
    scrollTrigger: { trigger: '.about-section', start: 'top 70%' },
    opacity: 0, y: 20, duration: 0.8, delay: 0.1, ease: 'power3.out'
  });
  gsap.from('.about-feature', {
    scrollTrigger: { trigger: '.about-features', start: 'top 85%' },
    opacity: 0, x: -20, duration: 0.6, stagger: 0.15, ease: 'power3.out'
  });
  gsap.from('.snow-content > *', {
    scrollTrigger: { trigger: '.snow-break', start: 'top 70%' },
    opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out'
  });
  gsap.from('.news-card-featured, .news-card-compact', {
    scrollTrigger: { trigger: '.news-grid-dynamic', start: 'top 80%', toggleActions: 'play none none none' },
    opacity: 0, y: 30, duration: 0.7, stagger: 0.15, ease: 'power3.out'
  });
  gsap.from('.contact-info-inner > *', {
    scrollTrigger: { trigger: '.contact-wrapper', start: 'top 70%' },
    opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: 'power3.out'
  });
  gsap.to('.hero-img', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    y: 120, ease: 'none'
  });
})();

// === FORM HANDLING (XSS-safe DOM, inline error banner) ===
(function () {
  var form = document.getElementById('leadForm');
  if (!form) return;
  var submitBtn  = form.querySelector('button[type="submit"]');
  var submitText = submitBtn ? submitBtn.querySelector('span:first-child') : null;

  // Remove any existing error banner
  function clearError() {
    var existing = form.querySelector('.form-error-banner');
    if (existing) existing.remove();
  }

  // Show an inline error banner above the submit button
  function showError(message) {
    clearError();
    var banner = document.createElement('div');
    banner.className = 'form-error-banner';
    banner.setAttribute('role', 'alert');
    banner.style.cssText =
      'padding:12px 16px;margin-bottom:12px;border-radius:8px;' +
      'background:#fdecea;color:#7a1a13;border:1px solid #f5b8b1;' +
      'font-size:0.9375rem;line-height:1.45;';
    banner.textContent = message;
    if (submitBtn && submitBtn.parentNode === form) {
      form.insertBefore(banner, submitBtn);
    } else {
      form.appendChild(banner);
    }
  }

  // Build the success card via DOM methods (no innerHTML on user data)
  function renderSuccess(parent, firstName) {
    while (parent.firstChild) parent.removeChild(parent.firstChild);

    var wrap = document.createElement('div');
    wrap.className = 'form-success';

    var icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.textContent = 'check_circle';

    var h = document.createElement('h3');
    h.textContent = 'Request Received!';

    var p = document.createElement('p');
    p.textContent = 'Thank you, ' + firstName +
      '! A ManageMowed representative will reach out within 24 hours.';

    wrap.appendChild(icon);
    wrap.appendChild(h);
    wrap.appendChild(p);
    parent.appendChild(wrap);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();

    var name  = form.querySelector('#fullName');
    var email = form.querySelector('#email');
    var valid = true;

    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.style.borderColor = '';
    });
    if (!name.value.trim())                                { name.style.borderColor  = '#ff4444'; valid = false; }
    if (!email.value.trim() || !email.value.includes('@')) { email.style.borderColor = '#ff4444'; valid = false; }
    if (!valid) {
      showError('Please enter your name and a valid email address.');
      return;
    }

    if (submitBtn)  submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Submitting...';

    var data = {
      fullName:     form.querySelector('#fullName').value.trim(),
      email:        form.querySelector('#email').value.trim(),
      phone:        form.querySelector('#phone')        ? form.querySelector('#phone').value.trim()        : '',
      company:      form.querySelector('#company')      ? form.querySelector('#company').value.trim()      : '',
      propertyType: form.querySelector('#propertyType') ? form.querySelector('#propertyType').value        : '',
      service:      form.querySelector('#service')      ? form.querySelector('#service').value             : '',
      details:      form.querySelector('#details')      ? form.querySelector('#details').value.trim()      : ''
    };

    fetch('/api/leads', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data)
    })
    .then(function (res) {
      if (!res.ok && res.status === 429) throw new Error('Too many requests. Please wait a minute and try again.');
      return res.json().then(function (json) { return { ok: res.ok, json: json }; });
    })
    .then(function (result) {
      if (result.ok && result.json.success) {
        var firstName = data.fullName.split(' ')[0] || 'there';
        renderSuccess(form.parentElement, firstName);
      } else {
        if (submitBtn)  submitBtn.disabled = false;
        if (submitText) submitText.textContent = 'Request a Quote';
        showError((result.json && result.json.error) || 'Something went wrong. Please try again.');
      }
    })
    .catch(function (err) {
      if (submitBtn)  submitBtn.disabled = false;
      if (submitText) submitText.textContent = 'Request a Quote';
      var fallbackPhone = (document.body && document.body.getAttribute('data-contact-phone')) || '';
      var msg = err.message || 'Connection error. Please try again' + (fallbackPhone ? ' or call ' + fallbackPhone : '') + '.';
      showError(msg);
    });
  });
})();

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
  slider.addEventListener('mousedown',  function (e) { e.preventDefault(); isDragging = true; updateSlider(getPosition(e)); });
  slider.addEventListener('touchstart', function (e) { isDragging = true; updateSlider(getPosition(e)); }, { passive: true });
  window.addEventListener('mousemove',  function (e) { if (!isDragging) return; e.preventDefault(); updateSlider(getPosition(e)); });
  window.addEventListener('touchmove',  function (e) { if (!isDragging) return; updateSlider(getPosition(e)); }, { passive: true });
  window.addEventListener('mouseup',    function () { isDragging = false; });
  window.addEventListener('touchend',   function () { isDragging = false; });
})();

// === ANIMATED STAT COUNTERS ===
(function () {
  var section  = document.querySelector('.stats-counter');
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
        if (progress < 1) requestAnimationFrame(step);
        else              el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runAnimation(); obs.disconnect(); }
      });
    }, { threshold: 0.25 });
    observer.observe(section);
  } else {
    runAnimation();
  }
})();

/* ==================== FAQ ACCORDION ==================== */
(function () {
  var faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isActive = item.classList.contains('active');
      faqItems.forEach(function (other) {
        other.classList.remove('active');
        var otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
