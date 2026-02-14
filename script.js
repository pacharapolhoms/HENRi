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
  root.classList.remove('lang-th', 'lang-en');
  root.classList.add(`lang-${lang}`);
  localStorage.setItem('henri-lang', lang);
  if (toggle) toggle.textContent = lang === 'th' ? 'TH / EN' : 'EN / TH';
}

function populateAge() {
  const age = getAge();
  ageTargets.forEach((node) => {
    const type = node.getAttribute('data-age');
    node.textContent = type === 'th' ? `${age} ปี` : `${age} years old`;
  });
}

populateAge();
const stored = localStorage.getItem('henri-lang') || 'th';
setLanguage(stored);

toggle?.addEventListener('click', () => {
  const isThai = root.classList.contains('lang-th');
  setLanguage(isThai ? 'en' : 'th');
});
