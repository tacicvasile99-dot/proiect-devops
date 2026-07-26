// MURA — interacțiuni minimale, în slujba atmosferei

// 1. Counter animat pentru registru (ledger) — pornește când intră în ecran
const nums = document.querySelectorAll('.ledger__num');

const countUp = (el) => {
  const target = parseInt(el.dataset.count, 10);
  if (target === 0) { el.textContent = '0'; return; }
  const dur = 1400;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    // ease-out
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const ledgerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      countUp(entry.target);
      ledgerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

nums.forEach((n) => ledgerObserver.observe(n));

// 2. Reveal la scroll pentru carduri și secțiuni
const revealTargets = document.querySelectorAll('.card, .dossier__head, .breach__inner, .oath__inner');
revealTargets.forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.classList.contains('card') ? i * 90 : 0;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });

revealTargets.forEach((el) => revealObserver.observe(el));

// 3. Parallax ușor pe zid la scroll
const wall = document.querySelector('.wall');
const scaleFig = document.querySelector('.scale');
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (wall && y < window.innerHeight) {
        wall.style.transform = `translateY(${y * 0.15}px)`;
        if (scaleFig) scaleFig.style.transform = `translateY(${y * 0.15}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }
});

// 4. Confirmarea jurământului
const form = document.querySelector('.oath__form');
const note = document.getElementById('oathNote');
if (form && note) {
  form.addEventListener('submit', () => {
    note.hidden = false;
    form.querySelector('button').textContent = 'Înregistrat';
  });
}
