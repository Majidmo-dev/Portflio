'use strict';

/* ============================================================
   FORMSPREE SETUP
   ─────────────────────────────────────────────────────────────
   To receive real emails from the contact form:
   1. Go to https://formspree.io and create a FREE account
   2. Click "New Form", name it "Portfolio Contact"
   3. Copy your Form ID (looks like: xpwzabcd)
   4. Replace 'YOUR_FORM_ID' below with your actual ID
   ============================================================ */
const FORMSPREE_ID = 'YOUR_FORM_ID';


/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */
const typewriterEl = document.getElementById('typewriter');
const words = [
    'Web Developer',
    'Software Engineer',
    'CS Student',
    'Forex Trader',
    'Problem Solver',
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function runTypewriter() {
    if (!typewriterEl) return;

    const currentWord = words[wordIndex];

    if (!isDeleting) {
        // Typing forward
        typewriterEl.textContent = currentWord.slice(0, ++charIndex);

        if (charIndex === currentWord.length) {
            // Pause at full word, then start deleting
            setTimeout(() => { isDeleting = true; runTypewriter(); }, 2000);
            return;
        }
        setTimeout(runTypewriter, 95);

    } else {
        // Deleting backward
        typewriterEl.textContent = currentWord.slice(0, --charIndex);

        if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(runTypewriter, 400); // brief pause before next word
            return;
        }
        setTimeout(runTypewriter, 55);
    }
}

// Start after a short delay so the page feels settled
setTimeout(runTypewriter, 600);


/* ============================================================
   HAMBURGER MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close menu on any nav link click
navLinks?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', closeMenu)
);

// Close menu on outside click
document.addEventListener('click', e => {
    if (
        navLinks?.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
    ) closeMenu();
});

function closeMenu() {
    navLinks?.classList.remove('open');
    hamburger?.classList.remove('active');
    hamburger?.setAttribute('aria-expanded', 'false');
}


/* ============================================================
   SCROLL EVENTS  (header shadow + back-to-top visibility)
   ============================================================ */
const header    = document.getElementById('header');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', handleScroll, { passive: true });

function handleScroll() {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 20);
    backToTop?.classList.toggle('show', y > 400);
}


/* ============================================================
   BACK TO TOP
   ============================================================ */
backToTop?.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
);


/* ============================================================
   SCROLL REVEAL  (Intersection Observer)
   ============================================================ */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target); // fire once
        }
    });
}, { threshold: 0.12 });

// Observe all elements already marked with [data-reveal]
document.querySelectorAll('[data-reveal]').forEach(el =>
    revealObserver.observe(el)
);

// Stagger the grid children (project cards & skill cards)
document.querySelectorAll('.projects-grid, .skills-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
        child.setAttribute('data-reveal', '');
        child.style.transitionDelay = `${i * 65}ms`;
        revealObserver.observe(child);
    });
});


/* ============================================================
   ACTIVE NAV LINK  (Intersection Observer)
   ============================================================ */
const sections  = document.querySelectorAll('section[id]');
const allNavAs  = document.querySelectorAll('.nav-links a[href^="#"]');

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            allNavAs.forEach(a => a.classList.remove('active'));
            document
                .querySelector(`.nav-links a[href="#${entry.target.id}"]`)
                ?.classList.add('active');
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));


/* ============================================================
   CONTACT FORM — VALIDATION + FORMSPREE SUBMISSION
   ============================================================ */
const form       = document.getElementById('contact-form');
const submitBtn  = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

/** Validation rules for each field */
const rules = {
    name: {
        validate: v => v.trim().length >= 2
            ? ''
            : 'Please enter your full name (at least 2 characters).',
    },
    email: {
        validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
            ? ''
            : 'Please enter a valid email address.',
    },
    message: {
        validate: v => v.trim().length >= 10
            ? ''
            : 'Your message must be at least 10 characters long.',
    },
};

// Attach elements & wire up live validation events
Object.keys(rules).forEach(id => {
    const el    = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    if (!el || !error) return;

    rules[id].el    = el;
    rules[id].error = error;

    // Validate on blur
    el.addEventListener('blur', () => validateField(id));

    // Re-validate on input once the field has been touched (has .invalid class)
    el.addEventListener('input', () => {
        if (el.classList.contains('invalid')) validateField(id);
    });
});

function validateField(id) {
    const { el, error, validate } = rules[id];
    if (!el) return true;

    const msg = validate(el.value);
    error.textContent = msg;
    el.classList.toggle('invalid', !!msg);
    el.classList.toggle('valid',   !msg);
    return !msg; // true = field is valid
}

function validateAll() {
    return Object.keys(rules)
        .map(id => validateField(id))
        .every(Boolean);
}

/** Submit handler */
form?.addEventListener('submit', async e => {
    e.preventDefault();

    // Run full validation first
    if (!validateAll()) return;

    // Clear any previous status
    hideStatus();
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    // ── Formspree not yet configured ──────────────────────────
    if (FORMSPREE_ID === 'YOUR_FORM_ID') {
        await delay(800); // simulate network
        showStatus(
            'success',
            '✓ Form is ready! Replace YOUR_FORM_ID in app.js with your Formspree ID to send real emails.'
        );
        resetBtn();
        return;
    }

    // ── Live Formspree submission ──────────────────────────────
    try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method:  'POST',
            body:    new FormData(form),
            headers: { Accept: 'application/json' },
        });

        if (res.ok) {
            showStatus('success', '✓ Message sent! I\'ll get back to you soon.');
            form.reset();
            // Clear valid/invalid states
            Object.values(rules).forEach(({ el }) => {
                el?.classList.remove('valid', 'invalid');
            });
        } else {
            const data = await res.json().catch(() => ({}));
            const msg  = data?.errors?.[0]?.message || 'Submission failed.';
            throw new Error(msg);
        }
    } catch (err) {
        showStatus(
            'error',
            `✕ ${err.message} — please email me directly at majidmohdally@gmail.com`
        );
    } finally {
        resetBtn();
    }
});

/* Helpers */
function showStatus(type, msg) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className   = `form-status ${type}`;
}

function hideStatus() {
    if (!formStatus) return;
    formStatus.textContent = '';
    formStatus.className   = 'form-status';
}

function resetBtn() {
    if (!submitBtn) return;
    submitBtn.textContent = 'Send Message →';
    submitBtn.disabled    = false;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
