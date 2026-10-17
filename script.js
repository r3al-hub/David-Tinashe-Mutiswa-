/** DTM Portfolio — lightweight, accessible interactive behaviour. No framework needed. */
(() => {
  document.documentElement.classList.add('js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Copyright year
  $$('.current-year').forEach(el => { el.textContent = new Date().getFullYear(); });

  // Mobile navigation
  const toggle = $('.menu-toggle');
  const nav = $('#primary-nav');
  const closeMenu = () => {
    if (!toggle || !nav) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      nav.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    });
    $$('a', nav).forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) closeMenu();
    });
    window.addEventListener('resize', () => { if (innerWidth > 900) closeMenu(); });
  }

  // Scroll reading progress (requestAnimationFrame throttled)
  const progress = $('.reading-progress span');
  let scrollQueued = false;
  const onScroll = () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      if (progress) {
        const available = document.documentElement.scrollHeight - innerHeight;
        const fraction = available > 0 ? Math.min(1, Math.max(0, scrollY / available)) : 0;
        progress.style.transform = `scaleX(${fraction})`;
      }
      scrollQueued = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Section navigation active state
  const navigation = $$('#primary-nav a');
  const sections = $$('main section[id]').filter(s => navigation.some(link => link.getAttribute('href') === '#' + s.id));
  if ('IntersectionObserver' in window && sections.length) {
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navigation.forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(section => activeObserver.observe(section));
  }

  // In-view motion: content remains visible without IntersectionObserver
  const reveals = $$('.reveal');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -50px 0px', threshold: .07 });
    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // Count-up statistics, values sourced from the accompanying CV
  const figures = $$('[data-count]');
  const runCounter = el => {
    const end = Number(el.dataset.count);
    if (!Number.isFinite(end)) return;
    if (reducedMotion) { el.textContent = String(end); return; }
    const duration = 1150;
    let start = null;
    const step = time => {
      if (start === null) start = time;
      const t = Math.min(1, (time - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(end * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && figures.length) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: .5 });
    figures.forEach(el => countObserver.observe(el));
  }

  // Portfolio: real combined category and free-text filtering
  const chips = $$('.filter-chip');
  const cards = $$('.project-card');
  const search = $('#project-search');
  const count = $('#portfolio-count');
  const empty = $('#no-results');
  let activeCategory = 'all';
  const filterProjects = () => {
    const query = (search?.value || '').trim().toLowerCase();
    let matches = 0;
    cards.forEach(card => {
      const categories = (card.dataset.category || '').split(/\s+/);
      const searchable = (card.dataset.search || '') + ' ' + card.textContent;
      const categoryMatches = activeCategory === 'all' || categories.includes(activeCategory);
      const textMatches = !query || searchable.toLowerCase().includes(query);
      const show = categoryMatches && textMatches;
      card.hidden = !show;
      if (show) matches++;
    });
    if (count) count.textContent = `${matches} engagement${matches === 1 ? '' : 's'}`;
    if (empty) empty.hidden = matches > 0;
  };
  chips.forEach(chip => chip.addEventListener('click', () => {
    activeCategory = chip.dataset.filter || 'all';
    chips.forEach(btn => {
      const active = btn === chip;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    filterProjects();
  }));
  search?.addEventListener('input', filterProjects);
  $('#reset-projects')?.addEventListener('click', () => {
    activeCategory = 'all';
    if (search) search.value = '';
    chips.forEach(btn => {
      const active = btn.dataset.filter === 'all';
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    filterProjects();
    search?.focus();
  });

  // Formspree contact: preserve existing provider; provide explicit success/error messages.
  const form = $('.contact-form');
  if (form) {
    const feedback = $('.form-feedback', form);
    const submit = $('button[type="submit"]', form);
    form.addEventListener('submit', async event => {
      if (!form.checkValidity()) return;
      event.preventDefault();
      if ($('input[name="_gotcha"]', form)?.value) return;
      if (!feedback || !submit) { form.submit(); return; }
      feedback.hidden = true;
      feedback.classList.remove('error');
      submit.disabled = true;
      const label = $('span', submit);
      if (label) label.textContent = 'Sending…';
      try {
        const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Message service unavailable');
        form.reset();
        feedback.textContent = 'Thank you. Your message has been sent successfully.';
      } catch (error) {
        feedback.classList.add('error');
        feedback.textContent = 'Your message could not be sent right now. Please contact me directly at mutiswadavid@gmail.com.';
      } finally {
        feedback.hidden = false;
        submit.disabled = false;
        if (label) label.textContent = 'Send message';
      }
    });
  }
})();


/** Persistent, accessible colour-mode control on every page. */
(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeButton) return;
  const applyTheme = (theme) => {
    const isDark = theme !== 'light';
    root.dataset.theme = isDark ? 'dark' : 'light';
    const action = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    themeButton.setAttribute('aria-label', action);
    themeButton.setAttribute('title', action);
    const label = themeButton.querySelector('.theme-toggle-text');
    if (label) label.textContent = isDark ? 'Light mode' : 'Dark mode';
    if (themeMeta) themeMeta.setAttribute('content', isDark ? '#081620' : '#f5f7f1');
  };
  applyTheme(root.dataset.theme);
  themeButton.addEventListener('click', () => {
    const newTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    try { localStorage.setItem('dtm-theme', newTheme); } catch (error) { /* Private browsing can block storage. */ }
  });
})();
