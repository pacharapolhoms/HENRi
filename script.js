const root = document.documentElement;
const toggle = document.querySelector('.lang-toggle');
const ageTargets = document.querySelectorAll('[data-age]');
const navLinks = document.querySelectorAll('nav a');
const contactForm = document.querySelector('[data-contact-form]');
const contactStatuses = document.querySelectorAll('[data-contact-status]');
const textureLayer = document.querySelector('.texture');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getAge() {
  const dob = new Date(2007, 5, 10);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasBirthdayPassed) age -= 1;
  return age;
}

function setLanguage(lang) {
  const nextLang = lang === 'en' ? 'en' : 'th';
  root.classList.remove('lang-th', 'lang-en');
  root.classList.add(`lang-${nextLang}`);
  root.setAttribute('lang', nextLang);
  localStorage.setItem('henri-lang', nextLang);

  if (toggle) {
    toggle.textContent = nextLang === 'th' ? 'ไทย / EN' : 'TH / English';
    toggle.setAttribute('aria-label', nextLang === 'th' ? 'สลับภาษาเป็น English' : 'Switch language to Thai');
  }
}

function populateAge() {
  const age = getAge();
  ageTargets.forEach((node) => {
    const type = node.getAttribute('data-age');
    node.textContent = type === 'th' ? `${age} ปี` : `${age}`;
  });
}

function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === path;
    link.classList.toggle('is-active', active);
    if (active) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function setTextureVariant() {
  if (!textureLayer) return;
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const variants = { index: 'a', about: 'b', materials: 'c', ordering: 'b', contact: 'a', 'thank-you': 'c' };
  const key = path.replace('.html', '');
  const next = variants[key] || 'a';
  textureLayer.setAttribute('data-variant', next);
  textureLayer.animate([{ opacity: 0.06 }, { opacity: 0.1 }], {
    duration: reduceMotion ? 1 : 280,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    fill: 'forwards'
  });
}

function setContactStatus(message) {
  contactStatuses.forEach((node) => {
    node.textContent = message;
  });
}

function initContactForm() {
  if (!contactForm || !contactStatuses.length) return;

  const honeypot = contactForm.querySelector('input[name="_honey"]');
  const emailInput = contactForm.querySelector('input[name="email"]');

  contactForm.addEventListener('submit', (event) => {
    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const invalidEmail = !emailInput || !emailInput.checkValidity();

    if (!name || !email || invalidEmail || !message) {
      event.preventDefault();
      setContactStatus(
        root.classList.contains('lang-th')
          ? 'กรุณากรอกชื่อ อีเมลที่ถูกต้อง และข้อความให้ครบก่อนส่ง'
          : 'Please complete name, valid email, and message before submitting.'
      );
      return;
    }

    if (honeypot && String(honeypot.value || '').trim()) {
      event.preventDefault();
      setContactStatus(
        root.classList.contains('lang-th')
          ? 'ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง'
          : 'Unable to submit. Please try again.'
      );
      return;
    }

    setContactStatus(
      root.classList.contains('lang-th')
        ? 'กำลังส่งข้อความ...'
        : 'Sending your message...'
    );
  });
}

function initPageTransition() {
  document.body.classList.add('page-enter');
  const internalLinks = document.querySelectorAll('a[href$=".html"], a[href="index.html"]');
  internalLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || link.target === '_blank') return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http')) return;
      event.preventDefault();
      if (reduceMotion) {
        window.location.href = href;
        return;
      }
      document.body.classList.add('page-leave');
      setTimeout(() => {
        window.location.href = href;
      }, 190);
    });
  });
}

function initSectionReveal() {
  const sections = document.querySelectorAll('.reveal-section');
  sections.forEach((section) => {
    const targets = section.querySelectorAll('h1, h2, h3, p, li, .btn, .card');
    targets.forEach((node, index) => {
      node.classList.add('reveal-item');
      node.style.transitionDelay = `${Math.min(index * 40, 240)}ms`;
    });
  });

  if (reduceMotion) {
    sections.forEach((section) => section.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  sections.forEach((section) => observer.observe(section));
}

populateAge();
setLanguage(localStorage.getItem('henri-lang') || 'th');
setActiveNav();
setTextureVariant();
initContactForm();
initPageTransition();
initSectionReveal();

toggle?.addEventListener('click', () => {
  setLanguage(root.classList.contains('lang-th') ? 'en' : 'th');
});
