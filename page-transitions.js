/**
 * ==============================================================================
 * TOWARDS MY BHARAT (TMB) — HIGH-PERFORMANCE PAGE TRANSITION & ROUTER CONTROLLER
 * ==============================================================================
 * 
 * Provides an instantaneous, luxury cinematic loading state when users navigate
 * between pages across the TMB platform.
 * 
 * ARCHITECTURAL DESIGN:
 * 1. Progress Bar:
 *    - Luminous top progress bar with glowing saffron-to-emerald gradient and comet head.
 *    - Advances progressively during navigation and completes smoothly on page arrival.
 * 2. Glassmorphic Brand Loader:
 *    - Ambient backdrop blur with theme-adaptive palette.
 *    - Concentric rotating orbits framing the pulsing TMB emblem and shimmering wordmark.
 * 3. Event Safety & Performance:
 *    - Event delegation on `document` targeting only same-origin HTML page navigations.
 *    - Ignores in-page anchor jumps (e.g., #hero, #origin-story, #contact).
 *    - Ignores external links, target="_blank", modifier keys (Ctrl/Cmd/Shift/Alt), and downloads.
 *    - Fully compatible with browser Back/Forward Cache (bfcache) via `pageshow`.
 *    - Failsafe timeout prevents any stuck loading state.
 * ==============================================================================
 */

(() => {
  'use strict';

  // Prevent multiple initializations if script is loaded multiple times
  if (window.__tmbPageTransitionsInitialized) return;
  window.__tmbPageTransitionsInitialized = true;

  let progressBar = null;
  let pageLoader = null;
  let progressInterval = null;
  let isNavigating = false;

  /**
   * Dynamically constructs and mounts the progress bar and loader overlay.
   * Self-healing: if elements already exist in HTML, reuses them.
   */
  function ensureLoaderDOM() {
    if (!progressBar) {
      progressBar = document.getElementById('tmbPageProgressBar');
      if (!progressBar && document.body) {
        progressBar = document.createElement('div');
        progressBar.id = 'tmbPageProgressBar';
        progressBar.className = 'tmb-page-progress-bar';
        progressBar.innerHTML = '<span class="tmb-progress-comet" aria-hidden="true"></span>';
        document.body.appendChild(progressBar);
      }
    }

    if (!pageLoader) {
      pageLoader = document.getElementById('tmbPageLoader');
      if (!pageLoader && document.body) {
        pageLoader = document.createElement('div');
        pageLoader.id = 'tmbPageLoader';
        pageLoader.className = 'tmb-page-loader';
        pageLoader.setAttribute('aria-hidden', 'true');
        pageLoader.innerHTML = `
          <div class="tmb-loader-content">
            <div class="tmb-loader-orbit-wrap">
              <div class="tmb-loader-orbit-outer"></div>
              <div class="tmb-loader-orbit-inner"></div>
              <img src="photos/TMB Logo.png" alt="Towards My Bharat Logo" class="tmb-loader-emblem">
            </div>
            <div class="tmb-loader-meta">
              <span class="tmb-loader-brand">Towards My Bharat</span>
              <span class="tmb-loader-caption">Awakening Sovereign Horizons</span>
            </div>
          </div>
        `;
        document.body.appendChild(pageLoader);
      }
    }
  }

  /**
   * Initiates the outgoing transition physics and displays the progress bar & loader.
   */
  function startTransition(destinationUrl) {
    if (isNavigating) return;
    isNavigating = true;

    ensureLoaderDOM();

    // 1. Activate Top Progress Bar
    if (progressBar) {
      progressBar.classList.remove('is-active');
      progressBar.style.width = '0%';
      // Force GPU reflow
      void progressBar.offsetWidth;
      progressBar.classList.add('is-active');
      progressBar.style.width = '28%';
    }

    // Progress increments with smooth stochastic pacing
    let currentPct = 28;
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      if (currentPct < 85) {
        currentPct += Math.random() * 12 + 6;
        if (currentPct > 85) currentPct = 85;
        if (progressBar) progressBar.style.width = `${currentPct}%`;
      }
    }, 110);

    // 2. Trigger Subtle Exit Physics on Page Body
    if (document.body) {
      document.body.classList.add('tmb-page-leaving');
    }

    // 3. Display Glassmorphic Loader Overlay
    if (pageLoader) {
      pageLoader.classList.add('is-active');
      pageLoader.setAttribute('aria-hidden', 'false');
    }

    // 4. Dispatch Navigation
    setTimeout(() => {
      if (isNavigating) {
        window.location.href = destinationUrl;
      }
    }, 180);

    // 5. Safety Failsafe: Reset after 6s in case navigation is cancelled or interrupted
    setTimeout(() => {
      resetTransition();
    }, 6000);
  }

  /**
   * Completes the progress bar and smoothly dismisses the loader overlay.
   */
  function completeTransition() {
    clearInterval(progressInterval);

    if (progressBar) {
      progressBar.style.width = '100%';
      setTimeout(() => {
        progressBar.style.opacity = '0';
        setTimeout(() => {
          progressBar.classList.remove('is-active');
          progressBar.style.width = '0%';
          progressBar.style.opacity = '';
        }, 300);
      }, 140);
    }

    if (pageLoader) {
      pageLoader.classList.remove('is-active');
      pageLoader.setAttribute('aria-hidden', 'true');
    }

    if (document.body) {
      document.body.classList.remove('tmb-page-leaving');
    }

    isNavigating = false;
  }

  /**
   * Full reset of transition state (e.g., when revived from browser Back-Forward Cache).
   */
  function resetTransition() {
    clearInterval(progressInterval);
    isNavigating = false;

    if (document.body) {
      document.body.classList.remove('tmb-page-leaving');
    }

    if (progressBar) {
      progressBar.classList.remove('is-active');
      progressBar.style.width = '0%';
      progressBar.style.opacity = '';
    }

    if (pageLoader) {
      pageLoader.classList.remove('is-active');
      pageLoader.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Evaluates whether a clicked anchor should trigger an internal page transition.
   */
  function isInternalPageNavigation(anchor) {
    if (!anchor || anchor.tagName !== 'A') return false;
    if (anchor.target && anchor.target !== '_self') return false;
    if (anchor.hasAttribute('download')) return false;

    const href = anchor.getAttribute('href');
    if (!href) return false;

    // Discard non-HTTP protocols and hash-only links
    if (
      href.startsWith('javascript:') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#')
    ) {
      return false;
    }

    try {
      const targetUrl = new URL(anchor.href, window.location.href);

      // Must be same origin (domain/protocol/port)
      if (targetUrl.origin !== window.location.origin) return false;

      // Normalize paths for accurate comparison
      const normalizePath = (path) => {
        let p = path.replace(/\/index\.html$/i, '/').replace(/\/$/, '');
        return p === '' ? '/' : p;
      };

      const currentPath = normalizePath(window.location.pathname);
      const destinationPath = normalizePath(targetUrl.pathname);

      // If pointing to the exact same page path:
      if (currentPath === destinationPath && targetUrl.search === window.location.search) {
        // This is an anchor jump or reload on current page — do NOT trigger full page loader
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Global Click Interception via Event Delegation
   */
  document.addEventListener('click', (e) => {
    // Only intercept primary (left) button clicks without modifier keys
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) {
      return;
    }

    const anchor = e.target.closest('a');
    if (!anchor) return;

    if (isInternalPageNavigation(anchor)) {
      e.preventDefault();
      startTransition(anchor.href);
    }
  });

  /**
   * DOM Lifecycle Initialization & Bfcache Handling
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureLoaderDOM();
      completeTransition();
    });
  } else {
    ensureLoaderDOM();
    completeTransition();
  }

  window.addEventListener('load', completeTransition);

  // Instant restoration when navigating back/forward via browser history
  window.addEventListener('pageshow', (event) => {
    resetTransition();
  });
})();
