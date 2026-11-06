/* Shared disclosure navigation; CSS supplies the no-script fallback. */
(() => {
  const desktop = window.matchMedia('(min-width:1001px)');
  document.querySelectorAll('.nav-group').forEach(group => {
    const button = group.querySelector('.nav-group-btn');
    let hoverTimer;
    const setOpen = open => {
      clearTimeout(hoverTimer);
      const expanded = open && desktop.matches;
      group.dataset.open = String(expanded);
      button.setAttribute('aria-expanded', String(expanded));
    };
    group.dataset.navReady = 'true';
    button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
    group.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') hoverTimer = setTimeout(() => setOpen(true), 100);
    });
    group.addEventListener('pointerleave', () => {
      clearTimeout(hoverTimer);
      if (!group.contains(document.activeElement)) setOpen(false);
    });
    group.addEventListener('focusout', event => {
      if (!group.contains(event.relatedTarget)) setOpen(false);
    });
    group.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        button.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!group.contains(event.target)) setOpen(false);
    });
    desktop.addEventListener('change', () => setOpen(false));
  });
})();
