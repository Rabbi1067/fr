/* ============================================================
   FAZLEY RABBI — PORTFOLIO  |  js/main.js
   Author : Fazley Rabbi
   Domain : fazleyrabbi.dev
   ============================================================ */

/* ---- 0. Dark / Light Theme Toggle ----
   How it works:
   1. On page load, check localStorage for a saved theme choice.
      If none is saved, fall back to the visitor's OS-level preference
      (prefers-color-scheme). Default to dark if nothing is detected.
   2. Apply the chosen theme by setting the `data-theme` attribute on
      the <html> element. The CSS variables in styles.css (see the
      :root and [data-theme="light"] blocks) react to this attribute
      and swap all the colors automatically.
   3. When the toggle button is clicked, flip the theme and save the
      new choice to localStorage so it persists on the next visit. */



const THEME_STORAGE_KEY = 'fazley-portfolio-theme'; // key used in localStorage
const htmlEl       = document.documentElement;
const themeToggle  = document.getElementById('themeToggle');

// Work out which theme to start with.
// Priority: saved choice in localStorage > DARK (default).
// Note: we intentionally do NOT check the OS/browser color-scheme
// preference here, so the site always opens in dark mode by default
// unless the visitor has explicitly switched to light mode before.
function getInitialTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return 'dark'; // default theme
}

// Apply a theme name ('dark' or 'light') to the page
function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  themeToggle.setAttribute('aria-pressed', theme === 'light');
}

// Switch between dark and light, then remember the choice
function toggleTheme() {
  const current = htmlEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem(THEME_STORAGE_KEY, next);
}

// Set the correct theme as soon as the script runs (before paint flicker)
applyTheme(getInitialTheme());

// Wire up the click on the toggle button in the navbar
themeToggle.addEventListener('click', toggleTheme);


/* ---- 1. Custom Cursor ---- */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animateCursor() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, .cp-card, .skill-card, .cert-card, .c-link, .proj-card')
  .forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovered'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovered'));
  });


/* ---- 2. Navbar: scroll shrink ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});


/* ---- 3. Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


/* ---- 4. Scroll reveal ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ---- 5. Skill bar animation ---- */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.sk-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(c => barObserver.observe(c));


/* ---- 6. Smooth nav click ---- */
navLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
