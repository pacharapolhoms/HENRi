const root = document.documentElement;
const toggle = document.querySelector('.lang-toggle');
const ageTargets = document.querySelectorAll('[data-age]');

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

populateAge();
setLanguage(localStorage.getItem('henri-lang') || 'th');

toggle?.addEventListener('click', () => {
  setLanguage(root.classList.contains('lang-th') ? 'en' : 'th');
});
