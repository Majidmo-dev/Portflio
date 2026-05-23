/* ============================================================
   app.js — Portfolio interactivity
   ============================================================ */

// ── Hamburger menu toggle ──────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu when a link is clicked
navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger?.classList.remove('active');
        hamburger?.setAttribute('aria-expanded', 'false');
    });
});


// ── Sticky nav shadow on scroll ───────────────────────────
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


// ── Active nav link on scroll (intersection observer) ─────
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            allNavLinks.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(
                `.nav-links a[href="#${entry.target.id}"]`
            );
            active?.classList.add('active');
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));


// ── Contact form – basic client-side feedback ─────────────
const form = document.querySelector('.contact-form');

form?.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;

    btn.textContent  = '✓ Message sent!';
    btn.disabled     = true;
    btn.style.background = '#16a34a';

    setTimeout(() => {
        btn.textContent  = original;
        btn.disabled     = false;
        btn.style.background = '';
        form.reset();
    }, 3000);
});
