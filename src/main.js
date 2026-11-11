const body = document.body;
const menu = document.querySelector('#mobile-menu');
const menuToggle = document.querySelector('.menu-toggle');
const requestDialog = document.querySelector('#request-dialog');
const requestForm = document.querySelector('#request-form');
const nameInput = document.querySelector('#request-name');
const phoneInput = document.querySelector('#request-phone');
const commentInput = document.querySelector('#request-comment');
const formStatus = document.querySelector('.form-status');
const submitButton = document.querySelector('.submit-button');
const lightbox = document.querySelector('#lightbox');
let activeGalleryIndex = 0;

function syncBodyLock() {
  const hasOpenLayer = !menu.hidden || requestDialog.open || lightbox.open;
  body.classList.toggle('is-locked', hasOpenLayer);
}

function openMenu() {
  menu.hidden = false;
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Закрыть меню');
  syncBodyLock();
  menu.querySelector('a')?.focus();
}

function closeMenu(returnFocus = false) {
  if (menu.hidden) return;
  menu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
  syncBodyLock();
  if (returnFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
  if (menu.hidden) openMenu();
  else closeMenu(true);
});

menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => closeMenu());
});

function clearFieldError(input, errorElement) {
  input.removeAttribute('aria-invalid');
  errorElement.textContent = '';
}

function openRequest(service = '') {
  closeMenu();
  if (lightbox.open) lightbox.close();
  formStatus.textContent = '';
  submitButton.disabled = false;
  submitButton.textContent = 'ОТПРАВИТЬ';
  clearFieldError(nameInput, document.querySelector('#name-error'));
  clearFieldError(phoneInput, document.querySelector('#phone-error'));
  if (service) commentInput.value = service;
  if (!requestDialog.open) requestDialog.showModal();
  syncBodyLock();
  window.setTimeout(() => nameInput.focus(), 30);
}

document.querySelectorAll('[data-modal-open]').forEach((button) => {
  button.addEventListener('click', () => openRequest());
});

document.querySelectorAll('[data-service]').forEach((button) => {
  button.addEventListener('click', () => openRequest(button.dataset.service));
});

document.querySelector('[data-dialog-close]').addEventListener('click', () => requestDialog.close());
requestDialog.addEventListener('close', syncBodyLock);

function closeOnBackdrop(dialog, event) {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  const isOutside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (isOutside) dialog.close();
}

requestDialog.addEventListener('click', (event) => closeOnBackdrop(requestDialog, event));

function formatPhone(value) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return '';

  let formatted = '+7';
  if (digits.length > 0) formatted += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) formatted += ')';
  if (digits.length > 3) formatted += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) formatted += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) formatted += `-${digits.slice(8, 10)}`;
  return formatted;
}

phoneInput.addEventListener('input', () => {
  phoneInput.value = formatPhone(phoneInput.value);
  clearFieldError(phoneInput, document.querySelector('#phone-error'));
});

nameInput.addEventListener('input', () => {
  clearFieldError(nameInput, document.querySelector('#name-error'));
});

function validateForm() {
  const nameError = document.querySelector('#name-error');
  const phoneError = document.querySelector('#phone-error');
  const isNameValid = nameInput.value.trim().length >= 2;
  const isPhoneValid = phoneInput.value.replace(/\D/g, '').length === 11;

  if (!isNameValid) {
    nameInput.setAttribute('aria-invalid', 'true');
    nameError.textContent = 'Введите имя — минимум 2 символа.';
  }
  if (!isPhoneValid) {
    phoneInput.setAttribute('aria-invalid', 'true');
    phoneError.textContent = 'Введите телефон полностью: +7 (999) 000-00-00.';
  }
  if (!isNameValid) nameInput.focus();
  else if (!isPhoneValid) phoneInput.focus();
  return isNameValid && isPhoneValid;
}

requestForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formStatus.textContent = '';
  if (!validateForm()) return;

  submitButton.disabled = true;
  submitButton.textContent = 'ГОТОВО';
  formStatus.textContent = 'Спасибо! Демо-заявка принята. Форма готова к подключению отправки.';
});

const galleryItems = [
  {
    src: './assets/work_1.jpg',
    alt: 'Фасад ЖК Северный с установленными кондиционерами',
    caption: 'ЖК «СЕВЕРНЫЙ» — 42 УСТАНОВКИ'
  },
  {
    src: './assets/work_2.jpg',
    alt: 'Фасад частного дома с внешними блоками кондиционеров',
    caption: 'ЧАСТНЫЙ ДОМ'
  },
  {
    src: './assets/work_3.jpg',
    alt: 'Офисное здание с двенадцатью сплит-системами',
    caption: 'ОФИС — 12 СПЛИТ-СИСТЕМ'
  },
  {
    src: './assets/work_4.jpg',
    alt: 'Фасадный монтаж кондиционеров в жилом доме',
    caption: 'ЖИЛОЙ ДОМ — ФАСАДНЫЙ МОНТАЖ, 2024'
  }
];

function updateLightbox(index) {
  activeGalleryIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[activeGalleryIndex];
  const image = document.querySelector('#lightbox-image');
  image.src = item.src;
  image.alt = item.alt;
  document.querySelector('#lightbox-caption').textContent = item.caption;
  document.querySelector('#lightbox-count').textContent = `${String(activeGalleryIndex + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;
}

function openLightbox(index) {
  closeMenu();
  updateLightbox(index);
  if (!lightbox.open) lightbox.showModal();
  syncBodyLock();
}

document.querySelectorAll('[data-gallery-index]').forEach((button) => {
  button.addEventListener('click', () => openLightbox(Number(button.dataset.galleryIndex)));
});
document.querySelector('[data-lightbox-close]').addEventListener('click', () => lightbox.close());
document.querySelector('[data-lightbox-prev]').addEventListener('click', () => updateLightbox(activeGalleryIndex - 1));
document.querySelector('[data-lightbox-next]').addEventListener('click', () => updateLightbox(activeGalleryIndex + 1));
lightbox.addEventListener('close', syncBodyLock);
lightbox.addEventListener('click', (event) => closeOnBackdrop(lightbox, event));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !menu.hidden) closeMenu(true);
  if (!lightbox.open) return;
  if (event.key === 'ArrowLeft') updateLightbox(activeGalleryIndex - 1);
  if (event.key === 'ArrowRight') updateLightbox(activeGalleryIndex + 1);
});
