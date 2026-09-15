/**
 * TOWARDS MY BHARAT PLATFORM — Interactive Core
 * Synchronized with Google Stitch Design Theme
 */

document.addEventListener('DOMContentLoaded', () => {
  const rotatingBharatWord = document.getElementById('rotatingBharatWord');
  const bharatNames = ['Bharat', 'India', 'भारत'];
  let currentBharatName = 0;

  if (rotatingBharatWord) {
    setInterval(() => {
      rotatingBharatWord.style.opacity = '0';

      setTimeout(() => {
        currentBharatName = (currentBharatName + 1) % bharatNames.length;
        rotatingBharatWord.textContent = bharatNames[currentBharatName];
        rotatingBharatWord.style.opacity = '1';
      }, 250);
    }, 2200);
  }

  // Keep a work preview open until the user selects another card or dismisses it.
  const workCards = document.querySelectorAll('.work-glimpse-hit-area');
  const closeWorkPreview = () => {
    workCards.forEach((workCard) => {
      workCard.classList.remove('is-open');
    });
  };

  workCards.forEach((workCard) => {
    const card = workCard.querySelector('.work-glimpse-card');

    card.addEventListener('click', (event) => {
      event.stopPropagation();
      const wasOpen = workCard.classList.contains('is-open');
      closeWorkPreview();
      if (!wasOpen) {
        workCard.classList.add('is-open');
      }
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }
    });
  });

  document.addEventListener('click', closeWorkPreview);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeWorkPreview();
    }
  });

  // Automatic Hero Background Slideshow (Transitions every 2.5s)
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;

  if (slides.length > 0) {
    slides.forEach((slide, idx) => {
      slide.style.position = 'absolute';
      slide.style.inset = '0';
      slide.style.backgroundSize = 'cover';
      slide.style.backgroundPosition = 'center';
      slide.style.transition = 'opacity 1s ease-in-out, transform 3.5s ease-out';
      slide.style.opacity = idx === 0 ? '1' : '0';
      slide.style.zIndex = idx === 0 ? '2' : '1';
      slide.style.transform = idx === 0 ? 'scale(1.05)' : 'scale(1)';
    });

    setInterval(() => {
      const prevSlide = slides[currentSlide];
      currentSlide = (currentSlide + 1) % slides.length;
      const nextSlide = slides[currentSlide];

      // Fade out previous slide
      prevSlide.style.opacity = '0';
      prevSlide.style.zIndex = '1';
      prevSlide.style.transform = 'scale(1)';

      // Fade in next slide
      nextSlide.style.opacity = '1';
      nextSlide.style.zIndex = '2';
      nextSlide.style.transform = 'scale(1.05)';
    }, 2500);
  }

  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');
  
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isExpanded = mobileNav.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }

  // Animated Statistics Counter
  const statsElements = document.querySelectorAll('.counter-val');
  let statsCounted = false;

  const animateCounters = () => {
    statsElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target.toLocaleString() + suffix;
          clearInterval(interval);
        } else {
          el.textContent = current.toLocaleString() + suffix;
        }
      }, 30);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.getElementById('impact-stats');
  if (statsSection) {
    observer.observe(statsSection);
  }

  // Modal Handlers
  const modalOverlay = document.getElementById('applyModal');
  const openModalBtns = document.querySelectorAll('.open-modal-trigger');
  const closeModalBtns = document.querySelectorAll('.modal-close');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const track = btn.getAttribute('data-track') || 'General Fellowship';
      const trackSelect = document.getElementById('modalTrackSelect');
      if (trackSelect) {
        trackSelect.value = track;
      }
      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Application Form Submit Handler
  const mainJoinForm = document.getElementById('mainJoinForm');
  if (mainJoinForm) {
    mainJoinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = mainJoinForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'TRANSMITTING APPLICATION...';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert('Thank you for pledging your dedication to Towards My Bharat. Your fellowship enrollment has been received. Our leadership secretariat will contact you shortly.');
        mainJoinForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1200);
    });
  }

  // Newsletter Submit Handler
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        alert(`Subscribed ${emailInput.value} to the Towards My Bharat Editorial Dispatches.`);
        newsletterForm.reset();
      }
    });
  }
});
