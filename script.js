/**
 * TOWARDS MY BHARAT PLATFORM — Interactive Core
 * Synchronized with Google Stitch Design Theme
 */

document.addEventListener('DOMContentLoaded', () => {
  const blogs = [
    {
      image: 'hero-courtyard.jpg',
      alt: 'Heritage courtyard and architecture',
      category: 'Heritage',
      readTime: '07 min read',
      title: 'Why a courtyard still teaches us how to gather',
      description: 'Design, memory, and community often begin in the same spatial rhythm: the place where people meet, pause, and think together.'
    },
    {
      image: 'youth-nation-building.jpg',
      alt: 'Youth building a future together',
      category: 'Leadership',
      readTime: '05 min read',
      title: 'Leadership is not performance',
      description: 'On building trust, humility, and steadiness in a culture that often rewards noise over judgment.'
    },
    {
      image: 'research-archive.jpg',
      alt: 'Archive materials and historical references',
      category: 'Research',
      readTime: '04 min read',
      title: 'Research begins with listening',
      description: 'What happens when we stop searching for answers and begin by tracing the questions that shaped a place over time.'
    },
    {
      image: 'varanasi-ghats.jpg',
      alt: 'Sacred ghats along the river',
      category: 'Field notes',
      readTime: '06 min read',
      title: 'Walking a riverfront with attention',
      description: 'Places live in memory, rituals, and repeated acts of care. To notice them is to notice history continuing to speak.'
    },
    {
      image: 'community-workshop.jpg',
      alt: 'People collaborating in a workshop',
      category: 'Practice',
      readTime: '03 min read',
      title: 'Making together builds belonging',
      description: 'Participation is not just a method; it is a way of cultivating trust, skill, and shared direction.'
    },
    {
      image: 'research-archive.jpg',
      alt: 'Historical learning table with documents',
      category: 'Education',
      readTime: '05 min read',
      title: 'Classrooms that connect memory and future',
      description: 'Education becomes broader and more valuable when students are invited to relate ideas to actual living traditions and communities.'
    }
  ];

  const renderBlogs = (container, posts) => {
    container.innerHTML = posts.map((post, index) => `
      <article class="blog-card${index === 0 ? ' featured-blog' : ''}">
        <img src="assets/images/${post.image}" alt="${post.alt}">
        <div class="blog-card-body">
          <div class="journal-meta"><span>${post.category}</span><span>${post.readTime}</span></div>
          <${index === 0 ? 'h2' : 'h3'}>${post.title}</${index === 0 ? 'h2' : 'h3'}>
          <p>${post.description}</p>
          <a class="journal-read-link" href="#">
            <span>Read story</span>
            <span class="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>
      </article>
    `).join('');
  };

  const latestBlogs = document.getElementById('latestBlogs');
  const allBlogs = document.getElementById('allBlogs');
  if (latestBlogs) renderBlogs(latestBlogs, blogs.slice(0, 4));
  if (allBlogs) renderBlogs(allBlogs, blogs);

  // Cycle through editorial blog images only when the page contains slideshow slides.
  const blogSlides = document.querySelectorAll('.blog-slide');
  let blogSlideIndex = 0;

  if (blogSlides.length > 0) {
    setInterval(() => {
      blogSlides[blogSlideIndex].classList.remove('active');
      blogSlideIndex = (blogSlideIndex + 1) % blogSlides.length;
      blogSlides[blogSlideIndex].classList.add('active');
    }, 2500);
  }

  // Rotate the hero's identity word while keeping the layout width stable in CSS.
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

  // Hover-driven reveal for the four pillar highlight cards.
  // Keep the continuum step and its matching pillar card active together.
  const continuumSteps = document.querySelectorAll('.continuum-step');
  const pillarCards = document.querySelectorAll('.pillar-card');
  const resetPillarState = () => {
    pillarCards.forEach((card) => card.classList.remove('is-active'));
    continuumSteps.forEach((step) => step.classList.remove('active'));
  };

  if (continuumSteps.length > 0 && pillarCards.length > 0) {
    continuumSteps.forEach((step, index) => {
      step.addEventListener('mouseenter', () => {
        resetPillarState();
        step.classList.add('active');
        pillarCards[index].classList.add('is-active');
      });

      step.addEventListener('focus', () => {
        resetPillarState();
        step.classList.add('active');
        pillarCards[index].classList.add('is-active');
      });

      step.addEventListener('mouseleave', () => {
        resetPillarState();
      });

      step.addEventListener('blur', () => {
        resetPillarState();
      });
    });
  }

  // Keep a work preview open until the user selects another card or dismisses it.
  // Work cards expand from their original position and close on outside click or Escape.
  const workCards = document.querySelectorAll('.work-glimpse-hit-area');
  const closeWorkPreview = () => {
    workCards.forEach((workCard) => {
      workCard.classList.remove('is-open');
    });
  };

  workCards.forEach((workCard) => {
    const card = workCard.querySelector('.work-glimpse-card');
    if (!card) return;

    card.addEventListener('click', (event) => {
      event.stopPropagation();
      const wasOpen = workCard.classList.contains('is-open');
      closeWorkPreview();
      if (!wasOpen) {
        workCard.classList.add('is-open');

        const sourceRect = card.getBoundingClientRect();
        const sourceX = sourceRect.left + sourceRect.width / 2;
        const sourceY = sourceRect.top + sourceRect.height / 2;

        requestAnimationFrame(() => {
          const expandedRect = card.getBoundingClientRect();
          card.style.setProperty('--popup-origin-x', `${sourceX - expandedRect.left}px`);
          card.style.setProperty('--popup-origin-y', `${sourceY - expandedRect.top}px`);
          card.classList.remove('is-opening');
        });
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
  // The CSS establishes the hero layers; JavaScript only advances the active background.
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
  // Mirror the drawer state in aria-expanded for keyboard and assistive-technology users.
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
  // Start counters once, when the impact section first enters the viewport.
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

  // Newsletter Submit Handler
  // Keep the static newsletter form on the page while preventing a full-page submission.
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
