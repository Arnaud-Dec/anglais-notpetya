document.addEventListener('DOMContentLoaded', () => {

  // ── Slide management ──────────────────────────────────
  const slides        = document.querySelectorAll('.slide');
  const prevBtn       = document.getElementById('prev-btn');
  const nextBtn       = document.getElementById('next-btn');
  const slideNumEl    = document.getElementById('current-slide-num');
  const progressFill  = document.getElementById('progress-bar-fill');

  let current = 0;
  const total = slides.length;
  const animDone = new Set();

  function goTo(idx) {
    slides[current].classList.remove('active', 'prev');
    slides[current].classList.add('prev');
    current = idx;
    slides[current].classList.remove('prev');
    slides[current].classList.add('active');
    slideNumEl.textContent = current + 1;
    progressFill.style.width = `${(current / (total - 1)) * 100}%`;
    prevBtn.style.opacity = current === 0         ? '0.3' : '1';
    nextBtn.style.opacity = current === total - 1 ? '0.3' : '1';
    triggerAnim(current, slides[current]);
  }

  function next() { if (current < total - 1) goTo(current + 1); }
  function prev() { if (current > 0)         goTo(current - 1); }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  document.addEventListener('keydown', e => {
    if (['ArrowRight','Space','Enter'].includes(e.key)) next();
    else if (e.key === 'ArrowLeft') prev();
  });

  // ── Generic card stagger (runs every visit) ───────────
  function staggerCards(slide) {
    const els = slide.querySelectorAll('.card, .why-item, .vocab-card');
    els.forEach((el, i) => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      setTimeout(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      }, 100 + i * 110);
    });
  }

  // ── Per-slide one-shot animations ─────────────────────
  function triggerAnim(idx, slide) {
    staggerCards(slide);
    if (animDone.has(idx)) return;
    animDone.add(idx);
    switch (idx) {
      case 0: animTerminal();       break;
      case 1: animAnecdote();       break;
      case 2: animGeoTimeline();    break;
      case 3: animSupplyChain();    break;
      case 4: animFileDeletion();   break;
      case 6: animDamageCounter();  break;
    }
  }

  // ── Slide 2: opening anecdote ─────────────────────────
  function animAnecdote() {
    const rowIds = ['anec-row-0','anec-row-1','anec-row-2','anec-row-3','anec-row-4'];
    const delays = [300, 1100, 2100, 5600, 6100];
    rowIds.forEach((id, i) => {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.classList.add('visible');
      }, delays[i]);
    });
    // infection counter
    setTimeout(() => {
      const el = document.getElementById('infection-counter');
      const dotsEl = document.getElementById('anec-dots');
      if (!el) return;
      const steps  = ['17', '312', '4,872', '80,000', '200,000+'];
      steps.forEach((val, i) => {
        setTimeout(() => {
          el.textContent = val;
          if (dotsEl && i < 12) {
            const dot = document.createElement('div');
            dot.className = 'anec-dot';
            dotsEl.appendChild(dot);
            requestAnimationFrame(() => dot.classList.add('lit'));
          }
        }, i * 550);
      });
    }, 2400);
    // aftermath items
    setTimeout(() => {
      document.querySelectorAll('.anec-impact-item').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 350);
      });
    }, 6400);
  }

  // ── Slide 1: typewriter terminal ──────────────────────
  function animTerminal() {
    const lines = document.querySelectorAll('.terminal-line');
    lines.forEach(line => {
      const delay = parseInt(line.dataset.delay) || 0;
      setTimeout(() => { line.style.opacity = '1'; }, delay);
    });
  }

  // ── Slide 2: timeline milestones ──────────────────────
  function animGeoTimeline() {
    const milestones = document.querySelectorAll('.geo-milestone');
    const segments   = document.querySelectorAll('.timeline-segment');
    milestones.forEach((m, i) => setTimeout(() => m.classList.add('visible'), i * 500));
    segments.forEach((s, i)   => setTimeout(() => s.classList.add('visible'), 350 + i * 500));
  }

  // ── Slide 3: supply chain nodes ───────────────────────
  function animSupplyChain() {
    const els = document.querySelectorAll('[data-chain]');
    els.forEach(el => el.classList.remove('visible'));
    els.forEach((el, i) => setTimeout(() => el.classList.add('visible'), 200 + i * 320));
  }

  // ── Slide 4: file deletion demo ───────────────────────
  function animFileDeletion() {
    const files = document.querySelectorAll('.file-row');
    files.forEach(f => f.classList.remove('deleting', 'deleted'));
    files.forEach((f, i) => {
      setTimeout(() => {
        f.classList.add('deleting');
        setTimeout(() => f.classList.add('deleted'), 450);
      }, 2800 + i * 650);
    });
  }

  // ── Slide 6: damage counter ($0B → $10B+) ─────────────
  function animDamageCounter() {
    const el = document.getElementById('damage-counter');
    if (!el) return;
    const target   = 10;
    const duration = 2200;
    const startTime = Date.now();

    function tick() {
      const t = Math.min((Date.now() - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);          // cubic ease-out
      const val   = eased * target;
      el.textContent = val >= target ? '10+' : val.toFixed(1);
      if (t < 1) requestAnimationFrame(tick);
    }
    el.textContent = '0';
    setTimeout(() => requestAnimationFrame(tick), 400);
  }

  // ── Matrix rain background ────────────────────────────
  const canvas = document.getElementById('matrix-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars   = ('アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン' +
                   'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789').split('');
  const fontSize = 16;
  const drops    = Array(Math.floor(canvas.width / fontSize)).fill(1);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(5,5,5,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';
    drops.forEach((y, i) => {
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }
  setInterval(drawMatrix, 33);

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // ── Init ──────────────────────────────────────────────
  goTo(0);
});
