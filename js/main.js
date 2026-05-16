// ============================================================
// LANNY MADHAVAN — Portfolio JS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── HAMBURGER NAV (desktop + mobile) ─────────────────────
  const sidebar    = document.getElementById('sidebar');
  const overlay    = document.getElementById('overlay');
  const menuToggle = document.getElementById('menuToggle');
  const closeBtn   = document.getElementById('closeBtn');

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

  menuToggle.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeMenu() : openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Close on nav link click
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // ── ACTIVE NAV ON SCROLL ─────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(s => sectionObserver.observe(s));

  // ── CAROUSEL ─────────────────────────────────────────────
  const slidesEl = document.getElementById('slides');
  const dotsEl   = document.getElementById('dots');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');

  if (slidesEl) {
    const total = slidesEl.children.length;
    let cur = 0, timer;

    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }

    function goTo(n) {
      cur = (n + total) % total;
      slidesEl.style.transform = `translateX(-${cur * 100}%)`;
      document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === cur);
      });
      clearInterval(timer);
      timer = setInterval(() => goTo(cur + 1), 4500);
    }

    prevBtn.addEventListener('click', () => goTo(cur - 1));
    nextBtn.addEventListener('click', () => goTo(cur + 1));
    timer = setInterval(() => goTo(cur + 1), 4500);
  }

  // ── CONTACT FORM ─────────────────────────────────────────
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('successMsg');

  if (submitBtn) {
    submitBtn.addEventListener('click', e => {
      e.preventDefault();
      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill in your name, email and message.');
        return;
      }

      successMsg.style.display = 'block';
      submitBtn.textContent    = 'Sent ✓';
      submitBtn.disabled       = true;
    });
  }

  // ── FOOTER YEAR ──────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
