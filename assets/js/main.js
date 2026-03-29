/**
 * Reychem — REACH Consulting
 * Main JavaScript — navigation, animations, FAQ, form handling
 */

'use strict';

/* ── Utility ──────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── 1. Navigation ────────────────────────────────────────── */
function initNav() {
  const navWrap = $('#nav');         // <header id="nav">
  const navEl   = $('.nav');         // <nav class="nav ..."> inside
  if (!navWrap && !navEl) return;
  const header = navWrap || navEl;

  const hamburger  = $('#nav-hamburger');
  const isHeroPage = !!$('.hero');

  // Scroll solid / transparent behaviour
  const updateNav = () => {
    const scrolled = window.scrollY > 60;
    header.classList.toggle('nav-solid',       scrolled || !isHeroPage);
    header.classList.toggle('nav-transparent', !scrolled && isHeroPage);
  };
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  // Mobile hamburger — toggle .nav-links visibility
  if (hamburger) {
    const navLinks = $('.nav-links');
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
      header.classList.toggle('nav-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && header.classList.contains('nav-open')) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        header.classList.remove('nav-open');
        document.body.style.overflow = '';
      }
    });

    // Close on nav link click (mobile)
    $$('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        header.classList.remove('nav-open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ── 2. Scroll Animations ─────────────────────────────────── */
function initScrollAnimations() {
  // Support both old fade-up/fade-in and new animate-up classes
  const targets = $$('.fade-up, .fade-in, .animate-up');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ── 3. FAQ Accordion ─────────────────────────────────────── */
function initFAQ() {
  $$('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = btn.nextElementSibling;
      const isOpen = item.classList.contains('open');

      // Close all open items
      $$('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        const q = openItem.querySelector('.faq-question');
        const a = openItem.querySelector('.faq-answer');
        if (q) q.setAttribute('aria-expanded', 'false');
        if (a) a.hidden = true;
      });

      // Open clicked (if it wasn't already open)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        if (answer) answer.hidden = false;
      }
    });
  });
}

/* ── 4. Contact Form ──────────────────────────────────────── */
function initContactForm() {
  const form = $('#contact-form') || $('#contactForm');
  if (!form) return;

  // Check for ?sent=1 in URL (Formspree redirect)
  if (window.location.search.includes('sent=1')) {
    showFormSuccess();
    return;
  }

  form.addEventListener('submit', async (e) => {
    // If form action is Formspree, let it submit naturally
    const action = form.getAttribute('action') || '';
    if (action.includes('formspree') && !action.includes('YOUR_FORM_ID')) {
      // Real Formspree endpoint — allow natural submit
      return;
    }

    // Demo / placeholder fallback
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    if (!btn) return;

    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin" aria-hidden="true"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Sending…';
    btn.disabled = true;

    await new Promise(r => setTimeout(r, 1500));
    showFormSuccess();

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    }, 5000);
  });

  function showFormSuccess() {
    const success = $('#form-success') || $('#formSuccess');
    if (success) {
      form.hidden = true;
      success.hidden = false;
    }
  }
}

/* ── 5. Cookie Banner ─────────────────────────────────────── */
function initCookieBanner() {
  // Support both old and new ID names
  const banner    = $('#cookie-banner') || $('#cookieBanner');
  const acceptBtn = $('#cookie-accept') || $('#cookieAccept');
  if (!banner) return;

  if (localStorage.getItem('rc-cookies-ok')) {
    banner.classList.add('hidden');
    banner.hidden = true;
    return;
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('rc-cookies-ok', '1');
      banner.classList.add('hidden');
      // Also set hidden after transition
      setTimeout(() => { banner.hidden = true; }, 300);
    });
  }

  // "What does that mean?" expands inline detail
  const learnMore  = document.getElementById('cookie-learn-more');
  const cookieInfo = document.getElementById('cookie-detail');
  if (learnMore && cookieInfo) {
    learnMore.addEventListener('click', (e) => {
      e.preventDefault();
      const isHidden = cookieInfo.hidden;
      cookieInfo.hidden = !isHidden;
      learnMore.textContent = isHidden ? 'Show less' : 'What does that mean?';
    });
  }
}

/* ── 6. Animated Counters ─────────────────────────────────── */
function initCounters() {
  const counters = $$('.stat-number[data-target]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = target * easeOut(progress);
      el.textContent = prefix + (Number.isInteger(target)
        ? Math.floor(value).toLocaleString()
        : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── 7. Back to Top ───────────────────────────────────────── */
function initBackToTop() {
  const btn = $('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── 8. Smooth scroll for hash anchors ───────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id     = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── 9. Add global keyframe styles ───────────────────────── */
function addGlobalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 0.8s linear infinite; display:inline-block; }
  `;
  document.head.appendChild(style);
}

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  addGlobalStyles();
  initNav();
  initScrollAnimations();
  initFAQ();
  initContactForm();
  initCookieBanner();
  initCounters();
  initBackToTop();
  initSmoothScroll();
});
