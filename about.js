/**
 * ABOUT PAGE — Sticky Left Rail & Overlapping Card Stacking Controller
 * Towards My Bharat
 */

document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.story-card'));
  const railItems = Array.from(document.querySelectorAll('.rail-item'));
  const cardsStream = document.querySelector('.about-cards-stream');

  if (!cards.length || !railItems.length) return;

  /**
   * Determine which card is currently active as the user scrolls.
   * Sticky cards overlap as they reach their top offset (around 110px).
   * A card is considered "active" when its top has reached or passed the sticky threshold.
   */
  const updateStackState = () => {
    const isMobile = window.innerWidth <= 820;
    const stickyThreshold = isMobile ? 140 : 120;
    let activeIndex = 0;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      // If the top of the card has scrolled up into sticky position
      if (rect.top <= stickyThreshold + 10) {
        activeIndex = index;
      }
    });

    // Update Left Rail Active Item
    railItems.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'true');
      } else {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      }
    });

    // Apply smooth covered dimming effect to cards that are beneath the active card
    cards.forEach((card, index) => {
      if (index < activeIndex) {
        card.classList.add('is-covered');
      } else {
        card.classList.remove('is-covered');
      }
    });
  };

  // Listen to scroll & resize with passive event listeners for 60fps performance
  window.addEventListener('scroll', updateStackState, { passive: true });
  window.addEventListener('resize', updateStackState, { passive: true });
  updateStackState();

  /**
   * Handle Click on Left Rail Items
   * Smoothly scrolls to the position where that card becomes stuck/active.
   */
  railItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetCard = cards[index];
      if (!targetCard) return;

      const isMobile = window.innerWidth <= 820;
      const stickyThreshold = isMobile ? 140 : 120;

      // Calculate the document-relative top position of target card
      const cardRect = targetCard.getBoundingClientRect();
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const targetScrollY = currentScrollY + cardRect.top - stickyThreshold;

      window.scrollTo({
        top: Math.max(0, targetScrollY),
        behavior: 'smooth'
      });
    });
  });

  // Mobile Navigation Drawer Toggle (Mirroring main site behavior)
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isExpanded = mobileNav.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', String(isExpanded));
    });

    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Footer Email Copy to Clipboard Interaction
  const footerCopyButtons = document.querySelectorAll('.footer-copy-btn');
  footerCopyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = btn.dataset.copy || 'info@towardsmybharat.in';
      try {
        await navigator.clipboard.writeText(email);
        const icon = btn.querySelector('.material-symbols-outlined');
        if (icon) {
          const original = icon.textContent;
          icon.textContent = 'check';
          btn.style.color = '#c5a059';
          setTimeout(() => {
            icon.textContent = original;
            btn.style.color = '';
          }, 1500);
        }
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  });
});

