(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#nav-principal');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navToggle.setAttribute('aria-label', expanded ? 'Abrir menú' : 'Cerrar menú');
      nav.classList.toggle('is-open', !expanded);
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú');
        nav.classList.remove('is-open');
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú');
        nav.classList.remove('is-open');
      }
    });
  }

  const form = document.querySelector('#demo-form');
  const formStatus = document.querySelector('#form-status');
  if (form && formStatus) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const contact = form.querySelector('#email');
      if (contact?.value && !contact.validity.valid) {
        contact.focus();
        contact.reportValidity();
        return;
      }
      form.reset();
      formStatus.textContent = 'Simulación completada. No se ha enviado ni guardado ningún dato.';
    });
    form.addEventListener('input', () => { formStatus.textContent = ''; });
  }

  const storageKey = 'brava-demo-privacy-choice-v1';
  const banner = document.querySelector('#cookie-banner');
  const dialog = document.querySelector('#preferences-dialog');
  const record = document.querySelector('#consent-record');
  let savedChoice = null;
  try {
    savedChoice = JSON.parse(localStorage.getItem(storageKey) || 'null');
  } catch {
    savedChoice = null;
  }

  const storeChoice = (choice) => {
    const entry = {
      choice,
      optionalCategories: [],
      savedAt: new Date().toISOString(),
      noticeVersion: 'demo-2026-10-18',
      demoOnly: true,
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(entry));
      savedChoice = entry;
      if (record) record.textContent = `Elección de demostración guardada en este navegador: ${choiceLabel(choice)} · ${new Date(entry.savedAt).toLocaleString('es-ES')}. No se envía a un servidor.`;
      return true;
    } catch {
      if (record) record.textContent = 'Este navegador no permite guardar preferencias. En esta demo no se activarán tecnologías opcionales.';
      return false;
    }
  };
  const choiceLabel = (choice) => ({all: 'aceptar todas (ninguna opcional activa)', necessary: 'solo necesarias', configured: 'preferencias guardadas'})[choice] || 'sin elección';
  const closeDialog = () => { if (dialog?.open) dialog.close(); };
  const showBanner = () => { if (banner) banner.hidden = false; };
  const hideBanner = () => { if (banner) banner.hidden = true; };
  if (!savedChoice) showBanner();

  document.querySelector('#cookie-accept')?.addEventListener('click', () => {
    storeChoice('all');
    hideBanner();
  });
  document.querySelector('#cookie-reject')?.addEventListener('click', () => {
    storeChoice('necessary');
    hideBanner();
  });
  const openPreferences = () => {
    if (!dialog) return;
    if (record) {
      record.textContent = savedChoice
        ? `Última elección de demostración en este navegador: ${choiceLabel(savedChoice.choice)} · ${new Date(savedChoice.savedAt).toLocaleString('es-ES')}.`
        : 'Todavía no hay una elección guardada en este navegador.';
    }
    dialog.showModal();
  };
  document.querySelector('#cookie-configure')?.addEventListener('click', openPreferences);
  document.querySelector('#cookie-settings')?.addEventListener('click', openPreferences);
  document.querySelector('#cookie-save')?.addEventListener('click', () => {
    storeChoice('configured');
    closeDialog();
    hideBanner();
  });
  document.querySelector('#cookie-clear')?.addEventListener('click', () => {
    try { localStorage.removeItem(storageKey); } catch { /* La demo sigue sin activar servicios opcionales. */ }
    savedChoice = null;
    if (record) record.textContent = 'Elección local borrada. No se ha activado ninguna tecnología de seguimiento.';
    showBanner();
  });
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });
})();
