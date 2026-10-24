/**
 * ==============================================================================
 * TOWARDS MY BHARAT (TMB) — MINIMAL CINEMATIC PAGE TRANSITION CONTROLLER
 * ==============================================================================
 * 
 * Delivers the minimalist, elegant loading experience matching the theme:
 * - Centered bold, tracked-out brand title ("TOWARDS MY BHARAT").
 * - Clean horizontal loading bar line directly below the text.
 * - Theme-aware styling: Luxury Gold on Obsidian (#06090e) in Dark Mode,
 *   and Forest Green on Ivory (#F6FAF4) in Light Mode.
 * - Handles back/forward cache (pageshow) and prevents broken navigations.
 * ==============================================================================
 */

(() => {
  'use strict';

  if (window.__tmbPageTransitionsInitialized) return;
  window.__tmbPageTransitionsInitialized = true;

  let pageLoader = null;
  let lineFill = null;
  let progressInterval = null;
  let isNavigating = false;

  /**
   * Ensures the minimalist loader overlay exists in the DOM.
   */
  function ensureLoaderDOM() {
    if (!pageLoader) {
      pageLoader = document.getElementById('tmbPageLoader');
      if (!pageLoader && document.body) {
        pageLoader = document.createElement('div');
        pageLoader.id = 'tmbPageLoader';
        pageLoader.className = 'tmb-page-loader';
        pageLoader.setAttribute('aria-hidden', 'true');
        pageLoader.innerHTML = `
          <div class="tmb-loader-card">
            <div class="tmb-loader-title">TOWARDS MY BHARAT</div>
            <div class="tmb-loader-line-track">
              <div class="tmb-loader-line-fill" id="tmbLoaderLineFill"></div>
            </div>
          </div>
        `;
        document.body.appendChild(pageLoader);
      }
    }

    if (pageLoader && !lineFill) {
      lineFill = pageLoader.querySelector('.tmb-loader-line-fill');
    }
  }

  /**
   * Starts the page transition animation when switching to another page.
   */
  function startTransition(destinationUrl) {
    if (isNavigating) return;
    isNavigating = true;

    ensureLoaderDOM();

    if (lineFill) {
      lineFill.style.transition = 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
      lineFill.style.width = '0%';
    }

    if (pageLoader) {
      pageLoader.style.opacity = '';
      pageLoader.classList.add('is-active');
      pageLoader.setAttribute('aria-hidden', 'false');
    }

    if (document.body) {
      document.body.classList.add('tmb-page-leaving');
    }

    // Immediate initial step forward
    setTimeout(() => {
      if (lineFill && isNavigating) {
        lineFill.style.width = '38%';
      }
    }, 20);

    // Smooth progressive increments
    let currentPct = 38;
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      if (currentPct < 85 && isNavigating) {
        currentPct += Math.random() * 14 + 8;
        if (currentPct > 85) currentPct = 85;
        if (lineFill) lineFill.style.width = `${currentPct}%`;
      }
    }, 110);

    // Dispatch navigation
    setTimeout(() => {
      if (isNavigating) {
        window.location.href = destinationUrl;
      }
    }, 190);

    // Safety timeout in case navigation is delayed or cancelled
    setTimeout(() => {
      resetTransition();
    }, 6000);
  }

  /**
   * Completes the line animation to 100% and smoothly fades out the loader.
   */
  function completeTransition() {
    clearInterval(progressInterval);

    if (lineFill) {
      lineFill.style.transition = 'width 0.16s ease-out';
      lineFill.style.width = '100%';
    }

    setTimeout(() => {
      if (pageLoader) {
        pageLoader.style.transition = 'opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
        pageLoader.style.opacity = '0';
      }

      setTimeout(() => {
        if (pageLoader) {
          pageLoader.classList.remove('is-active');
          pageLoader.setAttribute('aria-hidden', 'true');
          pageLoader.style.opacity = '';
        }
        if (lineFill) {
          lineFill.style.width = '0%';
        }
        if (document.body) {
          document.body.classList.remove('tmb-page-leaving');
        }
        isNavigating = false;
      }, 280);
    }, 140);
  }

  /**
   * Immediate reset (used for browser Back/Forward navigation).
   */
  function resetTransition() {
    clearInterval(progressInterval);
    isNavigating = false;

    if (document.body) {
      document.body.classList.remove('tmb-page-leaving');
    }

    if (pageLoader) {
      pageLoader.classList.remove('is-active');
      pageLoader.setAttribute('aria-hidden', 'true');
      pageLoader.style.opacity = '';
    }

    if (lineFill) {
      lineFill.style.width = '0%';
    }
  }

  /**
   * Checks if an anchor tag points to an internal HTML page.
   */
  function isInternalPageNavigation(anchor) {
    if (!anchor || anchor.tagName !== 'A') return false;
    if (anchor.target && anchor.target !== '_self') return false;
    if (anchor.hasAttribute('download')) return false;

    const href = anchor.getAttribute('href');
    if (!href) return false;

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

      // Must be same origin
      if (targetUrl.origin !== window.location.origin) return false;

      const normalizePath = (path) => {
        let p = path.replace(/\/index\.html$/i, '/').replace(/\/$/, '');
        return p === '' ? '/' : p;
      };

      const currentPath = normalizePath(window.location.pathname);
      const destinationPath = normalizePath(targetUrl.pathname);

      // Same page anchor jump: do NOT trigger full-page loader
      if (currentPath === destinationPath && targetUrl.search === window.location.search) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Global Click Interception
   */
  document.addEventListener('click', (e) => {
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
   * DOM Lifecycle Listeners
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

  // Bfcache support for browser Back and Forward navigation
  window.addEventListener('pageshow', () => {
    resetTransition();
  });
})();
