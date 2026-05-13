/* ============================================================
   ABOUT.JS — Timeline animations, counter, scroll effects
   ============================================================ */

(function() {
  'use strict';

  // ── Timeline progressive reveal ──
  const timelineEntries = document.querySelectorAll('.timeline-entry');

  if (timelineEntries.length) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -40px 0px'
    });

    timelineEntries.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      item.style.transition = `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`;
      timelineObserver.observe(item);
    });
  }

  // ── Animated number counters ──
  const statNumbers = document.querySelectorAll('.about-stat-number[data-target]');

  if (statNumbers.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';

          // Don't re-animate
          if (el.classList.contains('counted')) return;
          el.classList.add('counted');

          let current = 0;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          const stepTime = duration / steps;

          const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(counter);
            }
            el.textContent = Math.floor(current).toLocaleString() + suffix;
          }, stepTime);
        }
      });
    }, {
      threshold: 0.3
    });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  // ── Globe parallax ──
  const globe = document.querySelector('.globe-visual');
  if (globe) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      globe.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }

  // ── Hero parallax on scroll ──
  const heroBgImg = document.querySelector('.about-hero-bg-img');
  if (heroBgImg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBgImg.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
      }
    }, { passive: true });
  }

})();
