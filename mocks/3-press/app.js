// ────────────────────────────────────────────────────────────
// Direction 03 · Press
// Hybrid motion: still by default, with chosen kinetic moments.
// Vanilla JS, no GSAP. Respects prefers-reduced-motion.
// ────────────────────────────────────────────────────────────

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─────────────────────────────────────────────
  // 1. Word-by-word reveal for the manifesto quote
  //    (the single kinetic moment of the page)
  // ─────────────────────────────────────────────
  const splitWords = (el) => {
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((part) => {
          if (part.trim()) {
            const span = document.createElement('span');
            span.className = 'word is-pre';
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
  };

  document.querySelectorAll('[data-press-reveal]').forEach((el) => {
    if (reduceMotion) return;
    splitWords(el);
    const words = el.querySelectorAll('.word');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          words.forEach((w, i) => {
            setTimeout(() => {
              w.classList.remove('is-pre');
              w.classList.add('is-in');
            }, i * 45);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    io.observe(el);
  });

  // ─────────────────────────────────────────────
  // 2. Generic reveal-on-scroll for chosen blocks
  // ─────────────────────────────────────────────
  const revealSelectors = [
    '.chapter',
    '.toc li',
    '.proof-figure',
    '.team-card',
    '.show-callout',
  ];
  if (!reduceMotion) {
    revealSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.classList.add('is-revealing');
      });
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-revealing');
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    revealSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => io.observe(el));
    });
  }
})();
