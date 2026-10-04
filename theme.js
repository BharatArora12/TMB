(() => {
  const themeStorageKey = 'tmb-theme';
  const root = document.documentElement;
  root.dataset.theme = localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light';

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    const icon = toggle.querySelector('.material-symbols-outlined');

    const updateToggle = () => {
      const isDark = root.dataset.theme === 'dark';
      const label = `Switch to ${isDark ? 'light' : 'dark'} mode`;
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.title = label;
      icon.textContent = isDark ? 'light_mode' : 'dark_mode';
    };

    toggle.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(themeStorageKey, root.dataset.theme);
      updateToggle();
    });

    updateToggle();
  });
})();
