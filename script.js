const root = document.documentElement;
const toggle = document.querySelector('.lang-toggle');
const ageTargets = document.querySelectorAll('[data-age]');
const navLinks = document.querySelectorAll('nav a');
const contactForm = document.querySelector('[data-contact-form]');
const contactStatuses = document.querySelectorAll('[data-contact-status]');

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
    node.textContent = type === 'th' ? `${age} ปี` : `${age} years old`;
  });
}

function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === path;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
  });
}

function initContactForm() {
  if (!contactForm || !contactStatuses.length) return;

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !message) {
      const statusMessage = root.classList.contains('lang-th')
        ? 'กรุณากรอกข้อมูลให้ครบก่อนส่งข้อความ'
        : 'Please complete all fields before sending.';
      contactStatuses.forEach((node) => {
        node.textContent = statusMessage;
      });
      return;
    }

    const subject = encodeURIComponent(`HENRi Contact — ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:henritradingplus@gmail.com?subject=${subject}&body=${body}`;

    const statusMessage = root.classList.contains('lang-th')
      ? 'ระบบได้เปิดอีเมลเพื่อส่งข้อความเรียบร้อยแล้ว'
      : 'Your email app has been opened with your message draft.';
    contactStatuses.forEach((node) => {
      node.textContent = statusMessage;
    });
  });
}

populateAge();
setLanguage(localStorage.getItem('henri-lang') || 'th');
setActiveNav();
initContactForm();

toggle?.addEventListener('click', () => {
  setLanguage(root.classList.contains('lang-th') ? 'en' : 'th');
});
