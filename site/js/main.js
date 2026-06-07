/* jspeckrealestate.com — main.js */

/* ---- Sticky nav: transparent → solid on scroll ---- */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const threshold = 20;
  function update() {
    if (window.scrollY > threshold) {
      header.classList.add('scrolled');
      header.classList.remove('at-top');
    } else {
      header.classList.remove('scrolled');
      header.classList.add('at-top');
    }
  }
  window.addEventListener('scroll', update, { passive: true });
  update(); // run on load in case page is already scrolled
})();

/* ---- Mobile nav ---- */
(function () {
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  if (!toggle || !mobile) return;

  toggle.addEventListener('click', () => {
    const open = mobile.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !mobile.contains(e.target)) {
      mobile.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on nav link click
  mobile.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobile.classList.remove('open'))
  );
})();

/* ---- Accordion ---- */
document.querySelectorAll('.accordion-header').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.accordion-item.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ---- Mortgage Calculator ---- */
(function () {
  const form = document.getElementById('mortgageCalc');
  if (!form) return;

  function calcMonthly(principal, annualRate, termYears) {
    if (annualRate === 0) return principal / (termYears * 12);
    const r = annualRate / 100 / 12;
    const n = termYears * 12;
    return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  function fmt(n) {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  }

  form.addEventListener('input', () => {
    const price    = parseFloat(document.getElementById('calcPrice').value)    || 0;
    const down     = parseFloat(document.getElementById('calcDown').value)     || 0;
    const rate     = parseFloat(document.getElementById('calcRate').value)     || 0;
    const term     = parseInt(document.getElementById('calcTerm').value)       || 30;
    const taxes    = parseFloat(document.getElementById('calcTax').value)      || 0;
    const ins      = parseFloat(document.getElementById('calcInsurance').value)|| 0;
    const pmiPct   = parseFloat(document.getElementById('calcPmi').value)      || 0;

    const downAmt  = price * (down / 100);
    const principal = price - downAmt;
    const pmi      = downAmt / price < 0.20 ? (principal * (pmiPct / 100) / 12) : 0;
    const pi       = calcMonthly(principal, rate, term);
    const monthly  = pi + (taxes / 12) + (ins / 12) + pmi;

    const el = id => document.getElementById(id);
    if (el('calcResult'))     el('calcResult').textContent     = fmt(monthly);
    if (el('calcPI'))         el('calcPI').textContent         = fmt(pi);
    if (el('calcTaxMonth'))   el('calcTaxMonth').textContent   = fmt(taxes / 12);
    if (el('calcInsMonth'))   el('calcInsMonth').textContent   = fmt(ins / 12);
    if (el('calcPmiMonth'))   el('calcPmiMonth').textContent   = pmi > 0 ? fmt(pmi) : '—';
    if (el('calcLoanAmt'))    el('calcLoanAmt').textContent    = fmt(principal);
  });

  // Trigger on load
  form.dispatchEvent(new Event('input'));
})();

/* ---- Active nav link ---- */
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();
