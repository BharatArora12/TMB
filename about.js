/**
 * ==============================================================================
 * ABOUT PAGE CONTROLLER — Sticky Left Rail & Cinematic Card Stacking
 * Towards My Bharat (TMB) Web Platform
 * ==============================================================================
 *
 * ARCHITECTURAL ROLE:
 * - Controls the interactive scroll physics for the About page story stream.
 * - Bridges the relationship between the fixed/sticky left navigation rail
 *   (`.rail-item`) and the narrative section cards (`.story-card`).
 * - Manages responsive navigation drawers and utility interactions (e.g., email clipboard).
 *
 * RELATIONSHIP TO OTHER SYSTEM FILES:
 * - HTML (`about.html`):
 *   - `#aboutCardsStream`: The vertical scroll container holding all `.story-card` articles.
 *   - `#aboutLeftRail`: Sticky navigation sidebar containing `.rail-item` buttons.
 *   - `#mobileToggle` & `#mobileNav`: Responsive drawer navigation elements.
 *   - `.footer-copy-btn`: Quick copy utility buttons located in the footer.
 * - CSS (`about.css` & `style.css`):
 *   - `position: sticky`: CSS handles the physical pin of `.story-card` cards at `top: 110px`.
 *   - `.rail-item.active`: Highlights the corresponding milestone in the timeline rail.
 *   - `.story-card.is-covered`: Applies subtle scale and dimming transforms to cards
 *     that have been overlapped by subsequent cards in the stack.
 *
 * KEY CONCEPTS & TERMINOLOGY FOR ONBOARDING DEVELOPERS:
 * - Stacking Context: A 3D conceptualization of HTML elements along an imaginary z-axis
 *   relative to the user.
 * - getBoundingClientRect(): Native Web API returning element position relative to the viewport.
 * - Sticky Threshold: Pixel distance from viewport top where an element pins and is considered active.
 * - Passive Event Listeners: `{ passive: true }` tells the browser that `preventDefault()`
 *   will never be called, allowing the scrolling thread to run smoothly at 60fps without lag.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const heroVideo = document.querySelector('.about-video-hero-media');
  const soundToggle = document.querySelector('.about-video-hero-sound');

  if (heroVideo instanceof HTMLVideoElement && soundToggle instanceof HTMLButtonElement) {
    const soundLabel = soundToggle.querySelector('.about-video-hero-sound-label');
    let soundEnabled = false;
    let videoIsVisible = false;

    const updateSoundToggle = () => {
      soundToggle.setAttribute('aria-pressed', String(soundEnabled));
      soundLabel.textContent = soundEnabled ? 'Disable automatic sound' : 'Enable sound when video is visible';
    };

    const syncVideoSound = () => {
      const videoCanPlaySound = soundEnabled
        && videoIsVisible
        && !document.hidden
        && getComputedStyle(heroVideo).visibility !== 'hidden';

      heroVideo.muted = !videoCanPlaySound;
    };

    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      updateSoundToggle();
      syncVideoSound();

      if (soundEnabled && videoIsVisible && heroVideo.paused) {
        const playback = heroVideo.play();
        playback.catch(() => {
          soundEnabled = false;
          heroVideo.muted = true;
          updateSoundToggle();
          soundToggle.title = 'Video playback could not start. Check the video file and browser playback settings.';
        });
      }
    });

    if ('IntersectionObserver' in window) {
      const videoVisibilityObserver = new IntersectionObserver(([entry]) => {
        videoIsVisible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
        syncVideoSound();
      }, { threshold: [0, 0.1] });

      videoVisibilityObserver.observe(heroVideo);
    } else {
      const updateVideoVisibility = () => {
        const bounds = heroVideo.getBoundingClientRect();
        videoIsVisible = bounds.bottom > 0
          && bounds.top < window.innerHeight
          && bounds.right > 0
          && bounds.left < window.innerWidth;
        syncVideoSound();
      };

      window.addEventListener('scroll', updateVideoVisibility, { passive: true });
      window.addEventListener('resize', updateVideoVisibility, { passive: true });
      updateVideoVisibility();
    }

    document.addEventListener('visibilitychange', syncVideoSound);
    updateSoundToggle();
  }

  // ----------------------------------------------------------------------------
  // 1. DOM ELEMENT SELECTION
  // ----------------------------------------------------------------------------
  // All narrative cards in the storytelling stream (.story-card)
  const cards = Array.from(document.querySelectorAll('.story-card'));
  
  // Corresponding timeline navigation items in the left rail (.rail-item)
  const railItems = Array.from(document.querySelectorAll('.rail-item'));
  
  // The outer stream container
  const cardsStream = document.querySelector('.about-cards-stream');

  const heroStoryButton = document.querySelector('.about-hero-pill');
  const originStory = document.getElementById('origin-story');
  if (heroStoryButton && originStory) {
    heroStoryButton.addEventListener('click', () => {
      originStory.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Guard: If the page layout doesn't contain cards or rail, exit gracefully.
  if (!cards.length || !railItems.length) return;

  // ----------------------------------------------------------------------------
  // 2. SCROLL STATE & STACKING CALCULATOR
  // ----------------------------------------------------------------------------
  /**
   * Evaluates the scroll position of each `.story-card` relative to the sticky threshold.
   * As cards scroll into their sticky `top` anchor position, the newest card to reach
   * or cross the threshold becomes the "active" card.
   *
   * Effects applied:
   * 1. Updates `.active` and `aria-current` on the matching `.rail-item` in the sidebar.
   * 2. Applies `.is-covered` class to previous cards in the stack (for depth dimming in CSS).
   */
  const updateStackState = () => {
    // Media query threshold adjustment:
    // On mobile screens (<= 820px), headers take more vertical space so threshold is 140px;
    // on desktop screens, threshold is 120px.
    const isMobile = window.innerWidth <= 820;
    const stickyThreshold = isMobile ? 140 : 120;
    let activeIndex = 0;

    // Iterate through all story cards to find the currently focused section
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      // When the card's top reaches or passes the sticky threshold, it becomes active
      if (rect.top <= stickyThreshold + 10) {
        activeIndex = index;
      }
    });

    // 2a. Update Left Rail Timeline Indicator
    railItems.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'true');
      } else {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      }
    });

    // 2b. Apply Visual Stacking Hierarchy (.is-covered)
    // Any card with an index lower than activeIndex is underneath the current card
    cards.forEach((card, index) => {
      if (index < activeIndex) {
        card.classList.add('is-covered');
      } else {
        card.classList.remove('is-covered');
      }
    });
  };

  // ----------------------------------------------------------------------------
  // 3. EVENT LISTENERS FOR SCROLL & RESIZE
  // ----------------------------------------------------------------------------
  // Using { passive: true } ensures the browser compositor thread handles scrolling
  // at 60 FPS without waiting for JavaScript execution.
  window.addEventListener('scroll', updateStackState, { passive: true });
  window.addEventListener('resize', updateStackState, { passive: true });
  
  // Initial evaluation on load
  updateStackState();

  // ----------------------------------------------------------------------------
  // 4. RAIL CLICK INTERACTION (Smooth Scroll Navigation)
  // ----------------------------------------------------------------------------
  /**
   * When a user clicks a rail timeline item:
   * 1. Prevents default anchor jump.
   * 2. Calculates exact target scroll coordinate so the card aligns with the sticky threshold.
   * 3. Triggers window.scrollTo with native smooth behavior.
   */
  railItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetCard = cards[index];
      if (!targetCard) return;

      const isMobile = window.innerWidth <= 820;
      const stickyThreshold = isMobile ? 140 : 120;

      // Calculate absolute document offset:
      // Current scroll offset + relative card distance from viewport top - sticky margin
      const cardRect = targetCard.getBoundingClientRect();
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const targetScrollY = currentScrollY + cardRect.top - stickyThreshold;

      window.scrollTo({
        top: Math.max(0, targetScrollY),
        behavior: 'smooth'
      });
    });
  });

  // ----------------------------------------------------------------------------
  // 5. MOBILE NAVIGATION DRAWER
  // ----------------------------------------------------------------------------
  /**
   * Controls the open/close state of the mobile slide-out menu drawer.
   * Toggles the `.open` CSS utility class and syncs `aria-expanded` for screen readers.
   */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isExpanded = mobileNav.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', String(isExpanded));
    });

    // Close the mobile drawer automatically when a user selects any link inside it
    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 6. FOOTER UTILITY: COPY EMAIL TO CLIPBOARD
  // ----------------------------------------------------------------------------
  /**
   * Provides quick one-click copy functionality for contact emails in the footer.
   * Uses navigator.clipboard with visual feedback (changes icon to 'check' for 1.5s),
   * with a fallback to `mailto:` link if clipboard permissions are restricted.
   */
  const footerCopyButtons = document.querySelectorAll('.footer-copy-btn');
  footerCopyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      // Extract target email from data-copy attribute, or fallback to default
      const email = btn.dataset.copy || 'info@towardsmybharat.in';
      try {
        await navigator.clipboard.writeText(email);
        const icon = btn.querySelector('.material-symbols-outlined');
        if (icon) {
          const original = icon.textContent;
          icon.textContent = 'check'; // Temporarily display checkmark icon
          btn.style.color = '#c5a059'; // Gold accent confirmation color
          setTimeout(() => {
            icon.textContent = original;
            btn.style.color = '';
          }, 1500);
        }
      } catch (err) {
        // Fallback for non-HTTPS or unsupported browsers
        window.location.href = `mailto:${email}`;
      }
    });
  });
});
