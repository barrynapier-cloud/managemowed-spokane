// ────────────────────────────────────────────────────────────
// Direction 02 · Protocol
// Scroll choreography: GSAP + ScrollTrigger
// All animations respect prefers-reduced-motion.
// ────────────────────────────────────────────────────────────

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─────────────────────────────────────────────
  // 1. Hero title line reveal (per-word stagger)
  // ─────────────────────────────────────────────
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    // Each .line wraps its text in a positioned span we can translate.
    heroTitle.querySelectorAll('.line').forEach((line) => {
      const text = line.innerHTML;
      line.innerHTML = `<span class="line-inner">${text}</span>`;
    });

    if (!reduceMotion && window.gsap) {
      gsap.set('.hero-title .line-inner', { yPercent: 110 });
      gsap.to('.hero-title .line-inner', {
        yPercent: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.12,
        delay: 0.15,
      });
    } else {
      heroTitle.querySelectorAll('.line-inner').forEach((s) => {
        s.style.transform = 'translateY(0)';
      });
    }
  }

  // ─────────────────────────────────────────────
  // 2. Stat count-up
  // ─────────────────────────────────────────────
  const statNums = document.querySelectorAll('.stat-num');
  statNums.forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = String(target).split('.')[1]?.length || 0;

    if (reduceMotion || !window.gsap) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'expo.out',
          onUpdate: () => {
            el.textContent = obj.val.toFixed(decimals) + suffix;
          },
        });
      },
    });
  });

  // ─────────────────────────────────────────────
  // 3. Word-by-word reveal for [data-split-words]
  // ─────────────────────────────────────────────
  const splitWordsEls = document.querySelectorAll('[data-split-words]');
  splitWordsEls.forEach((el) => {
    // Walk text nodes only so we don't break inner spans or <br>.
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((part) => {
          if (part.trim()) {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = part;
            frag.appendChild(span);
          } else if (part) {
            frag.appendChild(document.createTextNode(part));
          }
        });
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
        Array.from(node.childNodes).forEach(walk);
      }
    };
    Array.from(el.childNodes).forEach(walk);

    if (reduceMotion || !window.gsap) return;

    const words = el.querySelectorAll('.word');
    gsap.set(words, { yPercent: 100, opacity: 0 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to(words, {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.04,
        });
      },
    });
  });

  // ─────────────────────────────────────────────
  // 4. Horizontal pinned scroll for the playbook
  // ─────────────────────────────────────────────
  const playbookStage = document.querySelector('.playbook-stage');
  const playbookTrack = document.querySelector('#playbook-track');
  const isMobile = window.matchMedia('(max-width: 720px)').matches;

  if (playbookStage && playbookTrack && !isMobile && !reduceMotion && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const setupPin = () => {
      const totalWidth = playbookTrack.scrollWidth;
      const viewportWidth = window.innerWidth;
      const distance = totalWidth - viewportWidth;

      gsap.to(playbookTrack, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: playbookStage,
          start: 'top top',
          end: () => `+=${distance}`,
          scrub: 1,
          pin: false,
          invalidateOnRefresh: true,
        },
      });
      // Match the section height to the scroll distance for natural pacing.
      playbookStage.style.height = `${distance + window.innerHeight}px`;
    };

    setupPin();
    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });
  } else if (playbookStage) {
    // Fall back to vertical reading on mobile / reduced motion.
    playbookStage.style.height = 'auto';
    if (playbookTrack) {
      playbookTrack.style.position = 'static';
      playbookTrack.style.height = 'auto';
      playbookTrack.style.flexDirection = 'column';
      playbookTrack.style.transform = 'none';
      playbookTrack.querySelectorAll('.day-card, .playbook-intro').forEach((c) => {
        c.style.width = '100%';
        c.style.height = 'auto';
        c.style.borderRight = 'none';
        c.style.borderBottom = '1px solid var(--line)';
      });
    }
  }

  // ─────────────────────────────────────────────
  // 5. Section reveal on scroll for non-hero blocks
  // ─────────────────────────────────────────────
  if (!reduceMotion && window.gsap && window.ScrollTrigger) {
    const fadeUp = [
      '.permission-line',
      '.pillar',
      '.proof-text',
      '.coa-card',
      '.team-card',
      '.show-callout',
      '.cta-final-lede',
    ];
    fadeUp.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true,
          },
        });
      });
    });
  }

  // ─────────────────────────────────────────────
  // 6. Hero orb parallax (subtle)
  // ─────────────────────────────────────────────
  if (!reduceMotion && window.gsap) {
    gsap.to('.hero-orb-1', {
      yPercent: 30,
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero-orb-2', {
      yPercent: -20,
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }
})();
