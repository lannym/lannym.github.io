// ============================================================
// LANNY MADHAVAN — Portfolio JS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── HAMBURGER NAV ────────────────────────────────────────
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const menuToggle = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('closeBtn');

  function openMenu() {
    sidebar.classList.add('open');
    overlay.classList.add('visible');
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.contains('open') ? closeMenu() : openMenu();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  // ── ACTIVE NAV ON SCROLL ─────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, {
    threshold: 0.25
  });

  sections.forEach(section => sectionObserver.observe(section));

  // ── CAROUSEL ─────────────────────────────────────────────
  const slidesEl = document.getElementById('slides');
  const dotsEl = document.getElementById('dots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (slidesEl && dotsEl) {
    const slides = Array.from(slidesEl.querySelectorAll('.slide'));
    const totalSlides = slides.length;
    let currentSlide = 0;
    let timer;

    function updateCarousel() {
      slidesEl.style.transform = `translateX(-${currentSlide * 100}%)`;

      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
      });

      dotsEl.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
        dot.setAttribute('aria-current', index === currentSlide ? 'true' : 'false');
      });
    }

    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      updateCarousel();
      restartTimer();
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startTimer() {
      timer = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
      }, 4500);
    }

    function restartTimer() {
      clearInterval(timer);
      startTimer();
    }

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (index === 0 ? ' active' : '');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');

      dot.addEventListener('click', () => {
        goToSlide(index);
      });

      dotsEl.appendChild(dot);
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }

    slides[0].classList.add('active');
    updateCarousel();
    startTimer();
  }

  // ── FOOTER YEAR ──────────────────────────────────────────
  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ── LUCIDE ICONS ─────────────────────────────────────────
  if (window.lucide) {
    lucide.createIcons();
  }

});