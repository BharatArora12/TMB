/**
 * ==============================================================================
 * THEME CONTROLLER (Light / Dark Mode Engine)
 * Towards My Bharat (TMB) Web Platform
 * ==============================================================================
 *
 * ARCHITECTURAL ROLE:
 * - Manages website-wide color theme state (Light vs. Dark mode).
 * - Implemented as an Immediately Invoked Function Expression (IIFE) that executes
 *   synchronously in the <head> of all pages (index.html, about.html, blog.html, etc.).
 *
 * WHY THIS IS CRITICAL FOR NEW DEVELOPERS:
 * - Running this script before page rendering prevents FOUC (Flash of Unstyled Content),
 *   where a user in dark mode briefly sees a white flash before JS loads.
 *
 * RELATIONSHIP TO OTHER SYSTEM COMPONENTS:
 * - HTML: Toggles the `data-theme` attribute on `document.documentElement` (<html> tag).
 *         e.g., <html data-theme="dark"> or <html data-theme="light">.
 * - CSS (style.css & about.css):
 *         Stylesheets define color tokens as CSS Custom Properties on `:root` and
 *         override them using attribute selectors like `html[data-theme="dark"]`.
 * - Browser Storage: Persists user preference across page navigations in `localStorage`.
 * - DOM Controls: Binds to `#themeToggle` button to update accessibility attributes
 *         (`aria-pressed`, `aria-label`, `title`) and Material Symbols icon content.
 *
 * KEY TERMS & CONCEPTS:
 * - IIFE: Immediately Invoked Function Expression `(() => { ... })()` creating a private scope.
 * - FOUC: Flash of Unstyled Content, avoided by setting `root.dataset.theme` immediately.
 * - data-theme: Modern HTML5 data-attribute used by CSS selectors to swap theme palettes.
 * - ARIA: Accessible Rich Internet Applications attributes for screen reader compatibility.
 * ==============================================================================
 */

(() => {
  // 1. CONSTANTS & DOM REFERENCES
  // ----------------------------------------------------------------------------
  // Storage key used in window.localStorage to persist user preference.
  const themeStorageKey = 'tmb-theme';

  // The root <html> element where `data-theme` is applied.
  const root = document.documentElement;

  // 2. IMMEDIATE EXECUTION (Pre-Render Theme Initialization)
  // ----------------------------------------------------------------------------
  // Check localStorage immediately; default to 'light' if not explicitly set to 'dark'.
  // Applying this before DOMContentLoaded ensures the page renders in the correct theme instantly.
  root.dataset.theme = localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light';

  // 3. INTERACTIVE UI BINDING (After DOM Tree is Parsed)
  // ----------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // Reference the theme toggle button rendered in the navigation bar.
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return; // Guard clause in case a page omits the toggle element

    // Reference the icon inside the toggle button (Google Material Symbols)
    const icon = toggle.querySelector('.material-symbols-outlined');

    /**
     * Synchronizes toggle button visual state & ARIA metadata with the active theme.
     * Ensures accessibility standards for assistive devices (screen readers).
     */
    const updateToggle = () => {
      const isDark = root.dataset.theme === 'dark';
      const label = `Switch to ${isDark ? 'light' : 'dark'} mode`;

      // Update screen-reader accessibility labels
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.title = label;

      // Update the Material Symbol icon name ('light_mode' displays a sun, 'dark_mode' displays a moon)
      if (icon) {
        icon.textContent = isDark ? 'light_mode' : 'dark_mode';
      }
    };

    /**
     * Click Event Listener:
     * Alternates theme between 'light' and 'dark', persists choice, and refreshes UI.
     */
    toggle.addEventListener('click', () => {
      // Toggle dataset.theme value
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';

      // Save user choice to browser storage
      localStorage.setItem(themeStorageKey, root.dataset.theme);

      // Re-synchronize icon and ARIA attributes
      updateToggle();
    });

    // Initial sync of button state on page load
    updateToggle();
  });
})();

