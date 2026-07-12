// ============================================================
// LANNY MADHAVAN — Portfolio JS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── HAMBURGER NAV ────────────────────────────────────────
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const menuToggle = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('closeBtn');
  const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openMenu() {
    sidebar.removeAttribute('inert');
    sidebar.setAttribute('aria-hidden', 'false');
    sidebar.classList.add('open');
    overlay.classList.add('visible');
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation');
    document.body.classList.add('menu-open');
    closeBtn.focus();
  }

  function closeMenu(restoreFocus = false) {
    if (!sidebar.classList.contains('open')) return;
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    sidebar.setAttribute('aria-hidden', 'true');
    sidebar.setAttribute('inert', '');
    document.body.classList.remove('menu-open');
    if (restoreFocus) menuToggle.focus();
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.contains('open') ? closeMenu() : openMenu();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeMenu(true));
  }

  if (overlay) {
    overlay.addEventListener('click', () => closeMenu(true));
  }

  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => closeMenu(true));
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && sidebar.classList.contains('open')) {
      closeMenu(true);
    }

    if (event.key === 'Tab' && sidebar.classList.contains('open')) {
      const focusable = Array.from(sidebar.querySelectorAll(focusableSelector));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // ── ACTIVE NAV ON SCROLL ─────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const isCurrent = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', isCurrent);
          if (isCurrent) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, {
    threshold: 0.25
  });

  sections.forEach(section => sectionObserver.observe(section));

  // ── CAROUSEL ─────────────────────────────────────────────
  //
  // Root cause of the "slides within one image" bug:
  // translateX(-N * 100%) works correctly ONLY when each .slide
  // is exactly 100% wide relative to its own scroll parent (the
  // .hero-carousel container, not the .slides flex wrapper).
  //
  // The fix is already in CSS: .slide { min-width:100%; width:100%; }
  // That means every slide is as wide as .hero-carousel, and the
  // flex wrapper grows to totalSlides × carouselWidth automatically.
  // translateX(-N * 100%) then shifts by exactly one slide per step.
  //
  const carousel = document.querySelector('.hero-carousel');
  const slidesEl = document.getElementById('slides');
  const dotsEl   = document.getElementById('dots');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const carouselStatus = document.getElementById('carouselStatus');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (slidesEl && dotsEl && carousel) {
    const slides      = Array.from(slidesEl.querySelectorAll('.slide'));
    const totalSlides = slides.length;
    let currentSlide  = 0;
    let timer;
    let userPaused = reduceMotion.matches;
    let interactionPaused = false;

    function updateCarousel() {
      // Each slide is 100% of the carousel width, so shifting by
      // (currentSlide * 100%) moves exactly one full slide at a time.
      slidesEl.style.transform = `translateX(-${currentSlide * 100}%)`;

      slides.forEach((slide, index) => {
        const isActive = index === currentSlide;
        slide.classList.toggle('active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      dotsEl.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
        dot.setAttribute('aria-current', index === currentSlide ? 'true' : 'false');
      });
    }

    function goToSlide(index, announce = true) {
      currentSlide = (index + totalSlides) % totalSlides;
      updateCarousel();
      restartTimer();
      if (announce && carouselStatus) {
        const caption = slides[currentSlide].querySelector('.slide-caption p').textContent;
        carouselStatus.textContent = `Slide ${currentSlide + 1} of ${totalSlides}: ${caption}`;
      }
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startTimer() {
      if (userPaused || interactionPaused || reduceMotion.matches || document.hidden) return;
      clearInterval(timer);
      timer = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
      }, 4500);
    }

    function restartTimer() {
      clearInterval(timer);
      startTimer();
    }

    function updatePauseButton() {
      if (!pauseBtn) return;
      pauseBtn.textContent = userPaused ? '▶' : 'Ⅱ';
      pauseBtn.setAttribute('aria-label', userPaused ? 'Play carousel' : 'Pause carousel');
      pauseBtn.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
    }

    function setInteractionPaused(paused) {
      interactionPaused = paused;
      if (paused) clearInterval(timer);
      else startTimer();
    }

    // Build dots
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (index === 0 ? ' active' : '');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => goToSlide(index));
      dotsEl.appendChild(dot);
    });

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        userPaused = !userPaused;
        if (userPaused) clearInterval(timer);
        else startTimer();
        updatePauseButton();
      });
    }

    carousel.addEventListener('mouseenter', () => setInteractionPaused(true));
    carousel.addEventListener('mouseleave', () => setInteractionPaused(false));
    carousel.addEventListener('focusin', () => setInteractionPaused(true));
    carousel.addEventListener('focusout', event => {
      if (!carousel.contains(event.relatedTarget)) setInteractionPaused(false);
    });
    document.addEventListener('visibilitychange', restartTimer);
    reduceMotion.addEventListener('change', event => {
      if (event.matches) clearInterval(timer);
      else startTimer();
    });

    // Touch / swipe support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) {
        delta < 0 ? nextSlide() : prevSlide();
      }
    }, { passive: true });

    slides[0].classList.add('active');
    updateCarousel();
    updatePauseButton();
    startTimer();
  }

  // ── STAT TICKER ──────────────────────────────────────────
  //
  // Animates each .stat-ticker from 0 up to data-target when
  // the stat section scrolls into view (fires once per element).
  //
  // data-target    : final numeric value (can be decimal e.g. 4.5)
  // data-suffix    : text appended after the number  e.g. "+"  "M"
  // data-decimal   : decimal places to show           e.g. "1"
  // data-display-suffix : overrides suffix for display while ticking
  //                  e.g. for 5000 → show "5k+" not "5000+"
  //
  const tickers = document.querySelectorAll('.stat-ticker');

  if (tickers.length) {
    const tickerObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        tickerObserver.unobserve(entry.target);
        animateTicker(entry.target);
      });
    }, { threshold: 0.6 });

    tickers.forEach(el => tickerObserver.observe(el));
  }

  function animateTicker(el) {
    const target      = parseFloat(el.dataset.target);
    const suffix      = el.dataset.suffix      || '';
    const decimals    = parseInt(el.dataset.decimal || '0', 10);
    const isKilo      = el.dataset.displaySuffix === 'k+'; // 5000 → show as 5k+
    const duration    = 1800; // ms
    const startTime   = performance.now();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Easing: ease-out cubic
    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value    = easeOut(progress) * target;

      let display;
      if (isKilo) {
        // Always show as e.g. "5k+"
        display = (value / 1000).toFixed(decimals) + 'k' + suffix.replace('k+', '').replace('+', '') + '+';
        // Simplify: for 5000 target display as "5k+"
        display = Math.round(value / 1000) + 'k+';
      } else {
        display = value.toFixed(decimals) + suffix;
      }

      el.textContent = display;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // Snap to exact final value
        el.textContent = isKilo
          ? (target / 1000) + 'k+'
          : target.toFixed(decimals) + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  // ── FOOTER YEAR ──────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
