/**
 * ==============================================================================
 * TOWARDS MY BHARAT (TMB) PLATFORM — INTERACTIVE CLIENT CORE
 * Synchronized with Google Stitch Design System & Modern Web Standards
 * ==============================================================================
 *
 * ARCHITECTURAL OVERVIEW:
 * - This file serves as the primary JavaScript controller for the TMB web application
 *   (primarily `index.html`, `blog.html`, and `all-blogs.html`).
 * - Encapsulates all DOM manipulation, 3D math transformations, carousels, modals,
 *   touch/keyboard interactions, and scroll-triggered animations.
 *
 * RELATIONSHIP TO OTHER SYSTEM COMPONENTS:
 * - HTML Pages:
 *   - `index.html`: Consumes the 3D Work initiatives slider, testimonials carousel,
 *     hero identity text cycler, impact count-up stats, credential modal, and latest blogs.
 *   - `all-blogs.html` & `blog.html`: Consumes dynamic blog card rendering (`#allBlogs`, `#latestBlogs`).
 * - CSS (`style.css`):
 *   - Relies on CSS variables (tokens) such as `--font-serif`, `--font-sans`, `--color-accent`.
 *   - Applies state classes like `.is-active`, `.is-open`, `.open` to trigger CSS transitions.
 *   - Sets dynamic inline `transform`, `opacity`, and `filter` styles for 3D physics.
 * - Theme Engine (`theme.js`):
 *   - Runs independently in the document `<head>` to maintain light/dark mode persistence.
 *   - `script.js` respects current CSS variable scopes regardless of active theme.
 *
 * KEY CONCEPTS & TERMINOLOGY FOR ONBOARDING DEVELOPERS:
 * - 3D Perspective & Transforms: Utilizing `translateX`, `translateZ`, `rotateY` to achieve
 *   hardware-accelerated depth effects without external 3D libraries (Three.js).
 * - IntersectionObserver: Modern browser API to observe when elements enter or exit the viewport,
 *   used here to conserve CPU/battery by pausing animations when off-screen.
 * - Passive Event Listeners: `{ passive: true }` prevents scroll-blocking, guaranteeing 60fps responsiveness.
 * - ARIA Accessibility: Dynamic updating of `aria-expanded`, `aria-hidden`, and `aria-selected`
 *   to ensure full compliance for keyboard navigation and screen readers.
 * - RequestAnimationFrame (rAF): Synchronizes animations with the browser's refresh rate for silky smooth count-ups.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const coursesSection = document.querySelector('.courses-section');
  const leftCoursesMotif = coursesSection && coursesSection.querySelector('.flank-motif-left');

  if (coursesSection && leftCoursesMotif) {
    if ('IntersectionObserver' in window) {
      const coursesMotifObserver = new IntersectionObserver((entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          coursesSection.classList.add('courses-motif-entered');
          observer.disconnect();
        }
      });



      coursesMotifObserver.observe(coursesSection);
    } else {
      coursesSection.classList.add('courses-motif-entered');
    }
  }

  // ============================================================================
  // MODULE 1: EDITORIAL BLOG ARCHIVE & DYNAMIC RENDERER
  // ============================================================================
  /**
   * Static dataset representing curated essays, dispatches, and journal entries.
   * In a future CMS / API integration, this array can be populated via fetch().
   *
   * Field definitions:
   * - image: Relative filename inside `assets/images/`
   * - alt: Screen-reader accessible image description
   * - categoryId: One of the four editorial sections
   * - readTime: Estimated reader duration
   * - title: Article headline
   * - description: Condensed thematic abstract
   */
  const blogCategories = [
    {
      id: 'spiritual',
      title: 'Spiritual',
      lens: 'Inner life',
      description: 'Reflections on practice, meaning, and the wisdom that steadies a life.',
      image: 'varanasi-ghats.jpg',
      alt: 'The Varanasi ghats along the river at sunrise'
    },
    {
      id: 'cultural',
      title: 'Cultural',
      lens: 'Living traditions',
      description: 'The customs, arts, and shared rituals that keep a culture in motion.',
      image: 'gallery-celebrations.jpg',
      alt: 'A community celebrating together'
    },
    {
      id: 'historical',
      title: 'Historical',
      lens: 'Memory & heritage',
      description: 'Stories from our past, read with care and carried into the present.',
      image: 'research-archive.jpg',
      alt: 'Historical research materials and archival references'
    },
    {
      id: 'political',
      title: 'Political',
      lens: 'Ideas & public life',
      description: 'Thoughtful perspectives on leadership, citizenship, and the common good.',
      image: 'youth-nation-building.jpg',
      alt: 'Young people gathered to shape their shared future'
    }
  ];

  const blogs = [
    {
      id: 'modern-mind-ancient-vedas',
      slug: 'modern-mind-ancient-vedas',
      image: 'blog-vedas-scholar.jpg',
      alt: 'Young Vedic scholar reciting sacred Sanskrit mantras by the holy Ganga at sunrise in Kashi',
      categoryId: 'cultural',
      readTime: '04 min read',
      title: 'Modern Mind, Ancient Legacy: Rediscovering the Vedas',
      description: 'How 19-year-old Vedmurti Devvrat Rekhe recited 2,000 mantras of the Shukla Yajurveda over 50 days in Kashi—challenging an age of AI shortcuts and distraction.',
      url: 'blog-modern-mind-ancient-vedas.html'
    },
    {
      id: 'sardar-vallabhbhai-patel',
      slug: 'sardar-patel',
      image: 'blog-sardar-patel.jpg',
      alt: 'Sardar Vallabhbhai Patel, the Iron Man of India, statesman of national unity',
      categoryId: 'political',
      readTime: '05 min read',
      title: 'Iron Man of India: Pillar of National Unity',
      description: 'How Sardar Vallabhbhai Patel integrated over 560 princely states, proved that unity is not uniformity, and laid the foundations of a sovereign, diverse Bharat.',
      url: 'blog-sardar-patel.html'
    },
    {
      id: 'lal-bahadur-shastri',
      slug: 'lal-bahadur-shastri',
      image: 'blog-shastri-portrait.jpg',
      alt: 'Dignified editorial portrait of Lal Bahadur Shastri, second Prime Minister of India',
      categoryId: 'historical',
      readTime: '05 min read',
      title: 'Lal Bahadur Shastri: Soul of Self-Reliance and Dignity',
      description: 'The Prime Minister who owned nothing, led India through war and hunger with quiet courage, and left an enduring legacy of simplicity and mystery.',
      url: 'blog-lal-bahadur-shastri.html'
    },
    {
      id: 'sundarkand-lessons',
      slug: 'sundarkand-lessons',
      image: 'blog-sundarkand.jpg',
      alt: 'Sri Hanuman Ji standing at the cliff overlooking the vast ocean before leaping to Lanka in the Sundarkand',
      categoryId: 'spiritual',
      readTime: '05 min read',
      title: '“Every Success Needs Struggle”: Lessons from Sundarkand for Today’s Generation',
      description: 'How Hanuman Ji’s journey across the ocean, conquering inner self-doubt, and the mindset of Nishkama Karma teach us that true strength begins within.',
      url: 'blog-sundarkand-lessons.html'
    }
  ];

  const getCategory = (categoryId) => blogCategories.find((category) => category.id === categoryId);

  const renderBlogCategories = (container) => {
    container.innerHTML = blogCategories.map((category, index) => {
      const postCount = blogs.filter((post) => post.categoryId === category.id).length;
      return `
        <a class="blog-category-card blog-category-${category.id}"
          href="all-blogs.html?category=${category.id}" aria-label="Explore ${category.title} blogs, ${postCount} stories">
          <div class="blog-category-image">
            <img src="assets/images/${category.image}" alt="${category.alt}" loading="lazy" decoding="async">
            <span class="blog-category-number">${String(index + 1).padStart(2, '0')}</span>
            <span class="blog-category-lens">${category.lens}</span>
          </div>
          <div class="blog-category-copy">
            <div>
              <h3>${category.title}</h3>
              <p>${category.description}</p>
            </div>
            <span class="blog-category-link">
              <span>${postCount} ${postCount === 1 ? 'story' : 'stories'}</span>
              <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </span>
          </div>
        </a>
      `;
    }).join('');
  };

  const categoryGrid = document.getElementById('blogCategoryGrid');
  if (categoryGrid) renderBlogCategories(categoryGrid);

  /**
   * Renders a given collection of blog post objects into a specified DOM container.
   * Automatically styles the first item as a highlighted 'featured-blog'.
   *
   * @param {HTMLElement} container - The destination element (e.g. #latestBlogs or #allBlogs)
   * @param {Array<Object>} posts - Slice or complete array of blog objects
   */
  const renderBlogs = (container, posts) => {
    container.innerHTML = posts.map((post, index) => {
      const category = getCategory(post.categoryId);
      const categoryTitle = category ? category.title : (post.categoryId.charAt(0).toUpperCase() + post.categoryId.slice(1));
      const targetUrl = post.url || `all-blogs.html?category=${post.categoryId}`;
      return `
        <article class="blog-card${index === 0 ? ' featured-blog' : ''}" data-url="${targetUrl}" tabindex="0" role="link" aria-label="Read article: ${post.title}">
          <a class="blog-card-clickable-overlay" href="${targetUrl}" aria-hidden="true" tabindex="-1"></a>
          <img src="assets/images/${post.image}" alt="${post.alt}" loading="lazy" decoding="async">
          <div class="blog-card-body">
            <div class="journal-meta">
              <span>${categoryTitle}</span>
              <span>${post.readTime}</span>
            </div>
            <${index === 0 ? 'h2' : 'h3'} class="blog-card-title">
              <a href="${targetUrl}">${post.title}</a>
            </${index === 0 ? 'h2' : 'h3'}>
            <p>${post.description}</p>
            <a class="journal-read-link" href="${targetUrl}">
              <span>Explore ${categoryTitle}</span>
              <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </a>
          </div>
        </article>
      `;
    }).join('');

    // Attach card click handlers for seamless whole-card interaction
    container.querySelectorAll('.blog-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
          const targetUrl = card.dataset.url;
          if (targetUrl) {
            window.location.href = targetUrl;
          }
        }
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const targetUrl = card.dataset.url;
          if (targetUrl) {
            window.location.href = targetUrl;
          }
        }
      });
    });
  };

  // Mount blogs dynamically depending on which page is currently loaded:
  // - blog.html mounts the top 4 articles into #latestBlogGrid
  // - all-blogs.html mounts the full article array into #allBlogs
  const latestBlogs = document.getElementById('latestBlogGrid');
  const allBlogs = document.getElementById('allBlogs');
  if (latestBlogs) renderBlogs(latestBlogs, blogs.slice(0, 4));
  if (allBlogs) {
    const categoryNavigation = document.getElementById('blogCategoryNav');
    const requestedCategory = new URLSearchParams(window.location.search).get('category');
    const activeCategory = blogCategories.find((category) => category.id === requestedCategory);
    const visibleBlogs = activeCategory
      ? blogs.filter((post) => post.categoryId === activeCategory.id)
      : blogs;

    if (categoryNavigation) {
      categoryNavigation.innerHTML = `
        <a class="blog-category-filter${activeCategory ? '' : ' is-active'}" href="blog.html"
          ${activeCategory ? '' : 'aria-current="page"'}>All stories</a>
        ${blogCategories.map((category) => `
          <a class="blog-category-filter${activeCategory === category ? ' is-active' : ''}"
            href="all-blogs.html?category=${category.id}"
            ${activeCategory === category ? 'aria-current="page"' : ''}>${category.title}</a>
        `).join('')}
      `;
    }

    const archiveEyebrow = document.getElementById('blogArchiveEyebrow');
    const archiveTitle = document.getElementById('blogArchiveTitle');
    if (activeCategory && archiveEyebrow && archiveTitle) {
      archiveEyebrow.textContent = `${activeCategory.lens} / ${visibleBlogs.length} ${visibleBlogs.length === 1 ? 'story' : 'stories'}`;
      archiveTitle.textContent = `${activeCategory.title} stories.`;
    }

    renderBlogs(allBlogs, visibleBlogs);
  }

  // ============================================================================
  // MODULE 2: BLOG EDITORIAL SLIDESHOW (Cross-fade)
  // ============================================================================
  /**
   * Cycles through featured editorial imagery on pages containing `.blog-slide`.
   * Automatically swaps active class every 2.5 seconds.
   */
  const blogSlides = document.querySelectorAll('.blog-slide');
  let blogSlideIndex = 0;

  if (blogSlides.length > 0) {
    setInterval(() => {
      blogSlides[blogSlideIndex].classList.remove('active');
      blogSlideIndex = (blogSlideIndex + 1) % blogSlides.length;
      blogSlides[blogSlideIndex].classList.add('active');
    }, 2500);
  }

  // ============================================================================
  // MODULE 3: TESTIMONIALS SIDE-SCROLL CAROUSEL
  // ============================================================================
  /**
   * High-performance horizontal scrollable carousel for community and mentor reviews.
   * Coordinates:
   * - Previous / Next arrow navigation buttons (#testimonialPrev, #testimonialNext)
   * - Dot pagination indicators (.testimonial-indicator)
   * - Native horizontal swipe / track scrolling with debounced indicator snapping
   * - Accessible keyboard navigation (ArrowLeft and ArrowRight)
   */
  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialPrev = document.getElementById('testimonialPrev');
  const testimonialNext = document.getElementById('testimonialNext');
  const testimonialIndicators = Array.from(document.querySelectorAll('.testimonial-indicator'));

  if (testimonialTrack && testimonialPrev && testimonialNext && testimonialIndicators.length > 0) {
    const slides = Array.from(testimonialTrack.querySelectorAll('.testimonial-slide'));
    let activeIndex = 0;

    /**
     * Synchronizes pagination dot active states and slide `.is-active` classes.
     * @param {number} index - Index of slide to mark active
     */
    const setIndicator = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      testimonialIndicators.forEach((dot, dotIdx) => {
        const isCurrent = dotIdx === activeIndex;
        dot.classList.toggle('is-active', isCurrent);
        dot.setAttribute('aria-selected', String(isCurrent));
      });
      slides.forEach((slide, slideIdx) => {
        slide.classList.toggle('is-active', slideIdx === activeIndex);
      });
    };

    /**
     * Smoothly scrolls the carousel track to align with the target slide.
     * @param {number} index - Target slide index
     */
    const scrollToSlide = (index) => {
      const targetIndex = (index + slides.length) % slides.length;
      const targetSlide = slides[targetIndex];
      if (targetSlide) {
        testimonialTrack.scrollTo({
          left: targetSlide.offsetLeft,
          behavior: 'smooth'
        });
        setIndicator(targetIndex);
      }
    };

    // Navigation arrow click bindings
    testimonialPrev.addEventListener('click', () => {
      scrollToSlide(activeIndex - 1);
    });

    testimonialNext.addEventListener('click', () => {
      scrollToSlide(activeIndex + 1);
    });

    // Pagination indicator dot clicks
    testimonialIndicators.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetIndex = Number(dot.dataset.slideIndex);
        if (!isNaN(targetIndex)) {
          scrollToSlide(targetIndex);
        }
      });
    });

    // Native touch swipe & scroll synchronization:
    // Uses a 50ms debounce timer to detect the slide closest to current scroll offset
    let scrollTimer;
    testimonialTrack.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const currentScrollLeft = testimonialTrack.scrollLeft;
        let nearestIndex = 0;
        let minDiff = Infinity;
        slides.forEach((slide, idx) => {
          const diff = Math.abs(slide.offsetLeft - currentScrollLeft);
          if (diff < minDiff) {
            minDiff = diff;
            nearestIndex = idx;
          }
        });
        if (nearestIndex !== activeIndex) {
          setIndicator(nearestIndex);
        }
      }, 50);
    }, { passive: true });

    // Keyboard accessibility: Left / Right arrow navigation when track has focus
    testimonialTrack.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollToSlide(activeIndex - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollToSlide(activeIndex + 1);
      }
    });
  }

  // ============================================================================
  // MODULE 4: ROTATING HERO IDENTITY WORD (Multilingual Cycler) [COMMENTED OUT FOR NOW]
  // ============================================================================
  /*
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
  */

  // ============================================================================
  // MODULE 4B: PRECISE HERO GRADIENT ANCHORING
  // ============================================================================
  /**
   * Dynamically tracks letter 'd' and letter 'a' of "India" in the hero headline,
   * keeping the solid black background anchored precisely to 'd' and shading
   * smoothly across 'i' to finish at 'a'.
   */
  const letterD = document.querySelector('.hero-letter-d');
  const letterA = document.querySelector('.hero-letter-a');
  const updateHeroGradientAnchors = () => {
    if (!letterD || !letterA) return;
    const dRect = letterD.getBoundingClientRect();
    const aRect = letterA.getBoundingClientRect();
    if (dRect.right > 0 && aRect.right > dRect.right) {
      document.documentElement.style.setProperty('--hero-d-end', `${Math.round(dRect.right)}px`);
      document.documentElement.style.setProperty('--hero-a-end', `${Math.round(aRect.right)}px`);
    }
  };

  updateHeroGradientAnchors();
  window.addEventListener('resize', updateHeroGradientAnchors, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateHeroGradientAnchors);
  }

  // ============================================================================
  // MODULE 5: UDYAM CREDENTIAL CERTIFICATE MODAL
  // ============================================================================
  /**
   * Accessible modal dialog showing TMB's official MSME / Udyam registration certificate.
   *
   * Features:
   * - Triggered by clicking the credential pill (`.hero-credential`) or pressing Enter/Space.
   * - Traps and prevents background page scrolling (`document.body.style.overflow = 'hidden'`).
   * - Closes via explicit close buttons (`[data-close-certificate]`), clicking backdrop,
   *   or pressing the Escape key.
   * - Manages `aria-hidden` attribute for assistive technology.
   */
  const udyamCredentialButtons = document.querySelectorAll('button.hero-credential, .contact-udyam-tag, #contactUdyamBtn');
  const udyamCertModal = document.getElementById('udyamCertModal');
  const closeCertificateButtons = document.querySelectorAll('[data-close-certificate]');

  /**
   * Toggles the modal's open state and toggles body scroll locking.
   * @param {boolean} shouldOpen - Whether to show or hide the dialog
   */
  const toggleUdyamCert = (shouldOpen) => {
    if (!udyamCertModal) return;
    udyamCertModal.classList.toggle('is-open', shouldOpen);
    udyamCertModal.setAttribute('aria-hidden', String(!shouldOpen));
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  if (udyamCredentialButtons.length && udyamCertModal) {
    udyamCredentialButtons.forEach((btn) => {
      btn.addEventListener('click', () => toggleUdyamCert(true));
      // Keyboard activation (Enter or Space)
      btn.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleUdyamCert(true);
        }
      });
    });
  }

  // Bind all elements with [data-close-certificate] attribute (e.g. close icons, backdrop)
  closeCertificateButtons.forEach((button) => {
    button.addEventListener('click', () => toggleUdyamCert(false));
  });

  // Global ESC key listener to dismiss modal
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && udyamCertModal && udyamCertModal.classList.contains('is-open')) {
      toggleUdyamCert(false);
    }
  });

  // ============================================================================
  // MODULE 6: FOUR PILLARS CONTINUUM HOVER SYNCHRONIZATION
  // ============================================================================
  /**
   * Synchronizes the interactive timeline continuum steps with their matching
   * pillar cards on the homepage (Section: Core Foundation / Pillars).
   *
   * Interaction:
   * - Hovering or focusing a `.continuum-step` activates both that step and the
   *   corresponding `.pillar-card` at matching index.
   * - Supports keyboard focus/blur for full accessibility compliance.
   */
  const continuumSteps = document.querySelectorAll('.continuum-step');
  const pillarCards = document.querySelectorAll('.pillar-card');
  const resetPillarState = () => {
    pillarCards.forEach((card) => card.classList.remove('is-active'));
    continuumSteps.forEach((step) => step.classList.remove('active'));
  };

  if (continuumSteps.length > 0 && pillarCards.length > 0) {
    continuumSteps.forEach((step, index) => {
      // Mouse interaction
      step.addEventListener('mouseenter', () => {
        resetPillarState();
        step.classList.add('active');
        pillarCards[index].classList.add('is-active');
      });

      // Keyboard tab navigation support
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

  // =========================================================================
  // MODULE 7: 3D SLIDER & POPUP MODAL CONTROLLER ("WHAT WORK WE DO")
  // =========================================================================
  /**
   * ARCHITECTURE OF THE 3D INITIATIVES SHOWCASE:
   * -------------------------------------------------------------------------
   * Powers the signature interactive 3D carousel on the homepage (#initiatives).
   * Renders cards in pseudo-3D space using hardware-accelerated CSS transforms
   * (translateX, translateZ, rotateY, and scale).
   *
   * KEY DOM REFERENCES:
   * - `#work3dSlider`: Outer 3D perspective viewport container.
   * - `#workDetailModal`: Accessible pop-up dialog showing full initiative details.
   * - `#workModalClose`: Modal close button.
   * - `#workModalContent`: Dynamic inner container injected with initiative data.
   */
  const workSlider = document.getElementById('work3dSlider');
  const workDetailModal = document.getElementById('workDetailModal');
  const workModalClose = document.getElementById('workModalClose');
  const workModalContent = document.getElementById('workModalContent');
  const workReelModal = document.getElementById('workReelModal');
  const workReelClose = document.getElementById('workReelClose');
  const workReelFrame = document.getElementById('workReelFrame');

  // Comprehensive Detailed Data Schema for Each Initiative (Injected into Modal)
  const initiativesData = [
    {
      index: '01',
      tag: 'Digital Media & Storytelling',
      title: 'Social Media Videos',
      tagline: 'Breaking The Shackles Of Mental Colonialism Through Digital Storytelling.',
      storyParagraphs: [
        'We create engaging short-form videos exploring Bharat’s untold history, cultural traditions, ancient wisdom, spirituality, and current affairs. Through stories, facts, and thought-provoking questions, we help today’s generation rediscover its roots, question what they know, and understand the why behind it.',
        'Our mission is simple: bridge the gap between modern India and its ancient knowledge, one story at a time, nurturing an Army of Proud Bharatiyas.'
      ],
      featuredVideos: [
        {
          title: 'Cultural and Spiritual',
          cover: 'assets/images/featured-reel-untold-history.jpg',
          url: 'https://www.instagram.com/towards.mybharat/reel/DRzn14iDBgS/'
        },
        {
          title: 'Untold History',
          cover: 'assets/images/featured-reel-shastri.jpg',
          url: 'https://www.instagram.com/reel/DPTRoGGDKox/?utm_source=ig_web_copy_link&vrfl=NTc4MTIwNjQ2YQ=='
        },
        {
          title: 'Politics and Current Affair',
          cover: 'assets/images/featured-reel-current-affairs.jpg',
          url: 'https://www.instagram.com/reel/DRAF9lAjHM0/?utm_source=ig_web_copy_link&dlrf=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA=='
        }
      ],
      meta: [
        { label: 'Primary Formats', value: 'Reels, YouTube Shorts, Micro-Docs & Podcasts' },
        { label: 'Target Audience', value: 'Youth (16-30), Students & Digital Creators' },
        { label: 'Monthly Impact', value: '5M+ Digital Reach & Youth Engagement' }
      ]
    },
    {
      index: '02',
      tag: 'Description',
      title: 'Online Courses',
      tagline: 'Learning beyond textbooks. Growing beyond classrooms.',
      descriptionSections: [
        {
          title: 'Why are we so confident?',
          body: 'Because we have a purpose: To connect DIGITAL MODERN INDIA with its ANCIENT BHARAT ROOTS.'
        },
        {
          title: 'How do we do it?',
          body: 'We bring together ancient knowledge and modern skills — from understanding the Hanuman Chalisa and its meaning to writing speeches about it, from exploring stories of the Ramayana to developing storytelling, communication, and public speaking skills.'
        },
      ],
      galleryTitle: 'Images from our courses',
      galleryImages: [
        {
          src: 'assets/images/course-adults-dharma.jpg',
          alt: 'Learners studying together in a traditional courtyard',
          caption: 'Learning through shared study'
        },
        {
          src: 'assets/images/course-kids-learning.jpg',
          alt: 'Children learning from a teacher in a heritage courtyard',
          caption: 'Wisdom shared across generations'
        },
        {
          src: 'assets/images/course-vedic-sciences.jpg',
          alt: 'Historic Indian temple and an astronomical instrument',
          caption: 'Exploring India’s knowledge traditions'
        },
      ],
      closingSection: {
        title: 'What do we nurture?',
        body: "Through personality development, soft skills training, spirituality, and mindfulness, we help young minds build confidence, discipline, and a deeper understanding of life. Our online courses connect India's younger generation with ancient Indian wisdom and spiritual practices while preparing them for the modern world."
      },
      card3Content: {
        title: 'What We Teach',
        tagline: 'Ancient Knowledge Empowered with Modern Skills.',
        pillars: [
          {
            icon: 'record_voice_over',
            title: 'Communication & Public Speaking Skills',
            desc: 'Speech writing, storytelling, public speaking, and confident expression.'
          },
          {
            icon: 'groups',
            title: 'Personality Development & Soft Skills',
            desc: 'Confidence, leadership, creativity, critical thinking and interpersonal skills.'
          },
          {
            icon: 'self_improvement',
            title: 'Spirituality & Mindfulness',
            desc: 'Ancient Indian wisdom, scriptures, meditation, mantra chanting, and mindful living.'
          },
          {
            icon: 'schedule',
            title: 'Discipline & Daily Routine',
            desc: 'Healthy habits, morning routines, self-discipline, grounding, and self-awareness.'
          }
        ]
      },
      card4Content: {
        title: 'TMB Spiritual Summer Camp 2026',
        tagline: 'A summer of learning, discovery, and reconnecting with our roots.',
        meta: [
          { label: 'Online', value: 'Learning Format' },
          { label: 'Summer Vacation', value: 'Programme' }
        ],
        closingMessage: 'The Roots of Yesterday. The Confidence of Tomorrow.'
      },
      card5Content: {
        title: 'Upcoming Programmes & Parents Feedback',
        sectionLinks: [
          {
            index: '05',
            title: 'Upcoming Programmes',
            description: 'Explore our programmes and learning opportunities.',
            href: '#voices'
          },
          {
            index: '06',
            title: 'Parents Feedback',
            description: 'Read what parents and families have shared.',
            href: '#testimonials'
          }
        ]
      }
    },
    {
      index: '03',
      tag: 'Workshops',
      title: 'Workshops'
    },
    {
      index: '04',
      tag: 'NGO Partnerships',
      title: 'NGO Partnerships'
    },
    {
      index: '05',
      tag: 'Global Voice',
      title: 'Global Voice'
    }
  ];

  if (workSlider) {
    // -------------------------------------------------------------------------
    // 1. CAROUSEL DOM CACHE & STATE REPOSITORY
    // -------------------------------------------------------------------------
    const cards = Array.from(workSlider.querySelectorAll('.work-3d-card'));
    const tabs = Array.from(document.querySelectorAll('#workSliderTabs .work-slider-tab'));
    const prevBtn = document.getElementById('workSliderPrev');
    const nextBtn = document.getElementById('workSliderNext');
    const counterCurrent = document.getElementById('workCounterCurrent');
    let currentIndex = 0;
    const totalCards = cards.length;
    let autoplayTimer = null;
    let slideDirection = 1; // 1 = forward (right), -1 = backward (left)
    let isMouseInsideSection = false;
    let reelReturnFocus = null;

    const closeReelModal = () => {
      if (!workReelModal || !workReelFrame) return;
      workReelModal.classList.remove('is-open');
      workReelModal.setAttribute('aria-hidden', 'true');
      workReelFrame.replaceChildren();
      if (reelReturnFocus && document.contains(reelReturnFocus)) {
        reelReturnFocus.focus();
      }
      reelReturnFocus = null;
    };

    const openReelModal = (video, trigger) => {
      if (!workReelModal || !workReelFrame) return;
      const instagramPostMatch = new URL(video.url).pathname.match(/\/(reel|p)\/([^/]+)/);
      if (!instagramPostMatch) return;
      const [, postType, postId] = instagramPostMatch;
      const blockquote = document.createElement('blockquote');
      blockquote.className = 'instagram-media';
      blockquote.setAttribute('data-instgrm-permalink',
        `https://www.instagram.com/${postType}/${postId}/?utm_source=ig_embed`);
      blockquote.setAttribute('data-instgrm-version', '14');

      const fallbackLink = document.createElement('a');
      fallbackLink.className = 'work-reel-fallback';
      fallbackLink.href = video.url;
      fallbackLink.target = '_blank';
      fallbackLink.rel = 'noopener noreferrer';
      fallbackLink.textContent = 'If the Instagram post does not load, watch it on Instagram.';
      workReelFrame.replaceChildren(blockquote, fallbackLink);
      document.getElementById('workReelTitle').textContent = video.title;
      reelReturnFocus = trigger;
      workReelModal.classList.add('is-open');
      workReelModal.setAttribute('aria-hidden', 'false');
      if (workReelClose) workReelClose.focus();

      const processInstagramEmbeds = () => {
        if (window.instgrm && window.instgrm.Embeds) {
          window.instgrm.Embeds.process();
        }
      };
      const embedScript = document.querySelector('script[data-instagram-embed]');
      if (window.instgrm && window.instgrm.Embeds) {
        processInstagramEmbeds();
      } else if (embedScript) {
        embedScript.addEventListener('load', processInstagramEmbeds, { once: true });
      } else {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.dataset.instagramEmbed = 'true';
        script.addEventListener('load', processInstagramEmbeds, { once: true });
        script.addEventListener('error', () => {
          fallbackLink.textContent = 'Instagram could not load the post. Open it on Instagram.';
        }, { once: true });
        document.body.appendChild(script);
      }
    };

    /**
     * Injects detailed initiative data into #workDetailModal and reveals it.
     * Prevents page scroll behind modal and temporarily halts autoplay timer.
     *
     * @param {number} index - 0-indexed position corresponding to initiativesData
     */
    const openDetailModal = (index) => {
      const data = initiativesData[index];
      if (!data || !workDetailModal || !workModalContent) return;

      const metaStripMarkup = data.meta && data.meta.length ? `
        <div class="modal-meta-strip${data.meta.length === 2 ? ' modal-meta-strip-two' : ''}">
          ${data.meta.map(m => `
            <div class="modal-meta-col">
              <span class="modal-meta-label">${m.label}</span>
              <span class="modal-meta-value">${m.value}</span>
            </div>
          `).join('')}
        </div>
      ` : '';

      // Stop automated transitions while user reads initiative details
      stopAutoplay();
      workDetailModal.classList.toggle('has-featured-story', Boolean(data.featuredVideos));

      // Dynamically compile markup using data from initiativesData
      workModalContent.innerHTML = `
        <div class="modal-header-meta">
          <span class="modal-num-badge">${data.index}</span>
          <span class="modal-tag">${data.tag}</span>
        </div>
        <h2 class="modal-title" id="workModalTitle">${data.title}</h2>
        ${data.tagline ? `<p class="modal-tagline">${data.tagline}</p>` : ''}
        ${data.featuredVideos ? `
          <div class="modal-story-copy">
            ${data.storyParagraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}
          </div>
          <section class="modal-featured" aria-labelledby="modalFeaturedTitle">
            <span class="modal-section-label">02 · FEATURED VIDEOS</span>
            <h3 class="modal-featured-title" id="modalFeaturedTitle">Stories worth discovering</h3>
            <div class="modal-featured-grid">
              ${data.featuredVideos.map((video, videoIndex) => `
                <figure class="modal-featured-item">
                  <button type="button" class="modal-featured-play" data-reel-index="${videoIndex}"
                    data-reel-title="${video.title}" data-reel-url="${video.url}" aria-label="Play ${video.title}">
                    <img src="${video.cover}" alt="" loading="lazy">
                    <span class="modal-featured-play-icon material-symbols-outlined" aria-hidden="true">play_arrow</span>
                  </button>
                  <figcaption>${video.title}</figcaption>
                </figure>
              `).join('')}
            </div>
          </section>
          <section class="modal-more-discover" aria-label="Explore more">
            <p class="modal-discover-line">On Towards my Bharat <a href="https://linktr.ee/TowardsMyBharat_TMB" target="_blank" rel="noopener noreferrer" class="modal-discover-link">visit our social media platform</a>.</p>
          </section>
        ` : `
          ${data.overview ? `<p class="modal-overview">${data.overview}</p>` : ''}
          ${data.descriptionSections && data.descriptionSections.length ? `
            <div class="modal-course-copy">
              ${data.descriptionSections.map(section => `
                <section>
                  <h3>${section.title}</h3>
                  <p>${section.body}</p>
                </section>
              `).join('')}
            </div>
          ` : ''}
          ${data.metaBeforeGallery ? metaStripMarkup : ''}
          ${data.galleryImages && data.galleryImages.length ? `
            <section class="modal-image-gallery" aria-labelledby="modalGalleryTitle">
              <h3 class="modal-pillars-heading" id="modalGalleryTitle">${data.galleryTitle || 'Images'}</h3>
              <div class="modal-image-gallery-grid">
                ${data.galleryImages.map(image => `
                  <figure class="modal-gallery-image">
                    <img src="${image.src}" alt="${image.alt}" loading="lazy">
                    <figcaption>${image.caption}</figcaption>
                  </figure>
                `).join('')}
              </div>
            </section>
          ` : ''}
          ${data.closingMessage ? `<p class="modal-ending-note">${data.closingMessage}</p>` : ''}
          ${data.closingSection ? `
            <div class="modal-course-copy modal-course-closing">
              <section>
                <h3>${data.closingSection.title}</h3>
                <p>${data.closingSection.body}</p>
              </section>
            </div>
          ` : ''}
          ${data.sectionLinks && data.sectionLinks.length ? `
            <nav class="modal-section-links" aria-label="Explore programmes and feedback">
              ${data.sectionLinks.map(link => `
                <a class="modal-section-link" href="${link.href}">
                  <span class="modal-section-link-index">${link.index}</span>
                  <span class="modal-section-link-copy">
                    <strong>${link.title}</strong>
                    <span>${link.description}</span>
                  </span>
                  <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                </a>
              `).join('')}
            </nav>
          ` : ''}
          ${data.pillars && data.pillars.length ? `
            ${data.hidePillarsHeading ? '' : '<h3 class="modal-pillars-heading">Key Focus Areas &amp; Methodologies</h3>'}
            <div class="modal-pillars-grid">
              ${data.pillars.map(pillar => `
                <div class="modal-pillar-item">
                  <h4><span class="material-symbols-outlined">${pillar.icon}</span> ${pillar.title}</h4>
                  <p>${pillar.desc}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${data.metaBeforeGallery ? '' : metaStripMarkup}
          ${data.card3Content ? `
            <section class="modal-sub-section">
              <h3 class="modal-sub-title">${data.card3Content.title}</h3>
              ${data.card3Content.tagline ? `<p class="modal-sub-tagline">${data.card3Content.tagline}</p>` : ''}
              ${data.card3Content.pillars && data.card3Content.pillars.length ? `
                <div class="modal-pillars-grid">
                  ${data.card3Content.pillars.map(pillar => `
                    <div class="modal-pillar-item">
                      <h4><span class="material-symbols-outlined">${pillar.icon}</span> ${pillar.title}</h4>
                      <p>${pillar.desc}</p>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </section>
          ` : ''}
          ${data.card4Content ? `
            <section class="modal-sub-section">
              <h3 class="modal-sub-title">${data.card4Content.title}</h3>
              ${data.card4Content.tagline ? `<p class="modal-sub-tagline">${data.card4Content.tagline}</p>` : ''}
              ${data.card4Content.meta && data.card4Content.meta.length ? `
                <div class="modal-meta-strip${data.card4Content.meta.length === 2 ? ' modal-meta-strip-two' : ''}">
                  ${data.card4Content.meta.map(m => `
                    <div class="modal-meta-col">
                      <span class="modal-meta-label">${m.label}</span>
                      <span class="modal-meta-value">${m.value}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              ${data.card4Content.closingMessage ? `<p class="modal-ending-note" style="margin-bottom: 0;">${data.card4Content.closingMessage}</p>` : ''}
            </section>
          ` : ''}
          ${data.card5Content ? `
            <section class="modal-sub-section">
              <h3 class="modal-sub-title" style="margin-bottom: 1.25rem;">${data.card5Content.title}</h3>
              ${data.card5Content.sectionLinks && data.card5Content.sectionLinks.length ? `
                <nav class="modal-section-links" aria-label="Explore programmes and feedback">
                  ${data.card5Content.sectionLinks.map(link => `
                    <a class="modal-section-link" href="${link.href}">
                      <span class="modal-section-link-index">${link.index}</span>
                      <span class="modal-section-link-copy">
                        <strong>${link.title}</strong>
                        <span>${link.description}</span>
                      </span>
                      <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                    </a>
                  `).join('')}
                </nav>
              ` : ''}
            </section>
          ` : ''}
          <div class="modal-actions">
            ${(data.overview || data.descriptionSections || data.card5Content || (data.sectionLinks && data.sectionLinks.length)) ? `
              <a href="#voices" class="btn btn-primary work-modal-cta-btn">
                <span>Participate &amp; Join</span>
                <span class="material-symbols-outlined">arrow_forward</span>
              </a>
            ` : ''}
            <button type="button" class="modal-btn-close" id="workModalInnerClose">Close Details</button>
          </div>
        `}
      `;

      // Display modal and lock body scrolling
      workDetailModal.classList.add('is-open');
      workDetailModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Inner close button within injected markup
      const innerClose = document.getElementById('workModalInnerClose');
      if (innerClose) {
        innerClose.addEventListener('click', closeDetailModal);
      }

      workModalContent.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', closeDetailModal);
      });

    };

    workModalContent.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-reel-index]');
      if (!trigger) return;
      openReelModal({
        title: trigger.dataset.reelTitle,
        url: trigger.dataset.reelUrl
      }, trigger);
    });

    /**
     * Hides the detail modal dialog, restores page scrolling, and resumes autoplay.
     */
    const closeDetailModal = () => {
      if (!workDetailModal) return;
      workDetailModal.classList.remove('is-open');
      workDetailModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (!isMouseInsideSection) {
        startAutoplay();
      }
    };

    // Modal close button in header
    if (workModalClose) {
      workModalClose.addEventListener('click', closeDetailModal);
    }

    // Backdrop click dismisses modal
    if (workDetailModal) {
      workDetailModal.addEventListener('click', (e) => {
        if (e.target === workDetailModal) {
          closeDetailModal();
        }
      });
    }

    if (workReelClose) {
      workReelClose.addEventListener('click', closeReelModal);
    }

    if (workReelModal) {
      workReelModal.addEventListener('click', (e) => {
        if (e.target === workReelModal) closeReelModal();
      });
    }

    // Keyboard ESC dismisses modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (workReelModal && workReelModal.classList.contains('is-open')) {
          closeReelModal();
        } else if (workDetailModal && workDetailModal.classList.contains('is-open')) {
          closeDetailModal();
        }
      }
    });

    /**
     * 2. 3D PROJECTION & PERSPECTIVE MATH TRANSFORM ENGINE
     * -----------------------------------------------------------------------
     * Calculates perspective 3D matrix offsets for each card relative to currentIndex.
     * Uses modulo arithmetic `((index % totalCards) + totalCards) % totalCards`
     * to ensure cards loop continuously without any hard stops or dead ends.
     *
     * Breakpoints accounted for:
     * - Mobile (<640px)
     * - Tablet (640px - 1023px)
     * - Desktop (>=1024px)
     *
     * @param {number} index - Desired active card index
     */
    const updateSlider = (index) => {
      // Wrap index so cards loop continuously (0 -> 1 -> 2 -> 3 -> 4 -> 0 ...)
      currentIndex = ((index % totalCards) + totalCards) % totalCards;
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
      const activeTab = tabs[currentIndex];
      const activeTabRect = activeTab ? activeTab.getBoundingClientRect() : null;
      const sliderRect = workSlider.getBoundingClientRect();
      const maxOffset = Math.max(0, (sliderRect.width - cards[currentIndex].offsetWidth) / 2 - 12);
      const desiredOffset = activeTabRect
        ? activeTabRect.left + activeTabRect.width / 2 - (sliderRect.left + sliderRect.width / 2)
        : 0;
      const activeOffset = Math.min(maxOffset, Math.max(-maxOffset, desiredOffset));

      cards.forEach((card, cardIndex) => {
        let diff = cardIndex - currentIndex;
        const keepEdgeCardInPlace =
          (currentIndex === 0 && diff === 3) ||
          (currentIndex === totalCards - 1 && diff === -3);
        while (diff > 2 && !keepEdgeCardInPlace) diff -= totalCards;
        while (diff < -2 && !keepEdgeCardInPlace) diff += totalCards;

        card.classList.remove('is-active');

        if (diff === 0) {
          // Active Center Card
          card.classList.add('is-active');
          card.style.transform = `translateX(${activeOffset}px) translateZ(0) scale(1) rotateY(0deg)`;
          card.style.opacity = '1';
          card.style.filter = 'none';
          card.style.zIndex = '10';
          card.style.pointerEvents = 'auto';
          card.setAttribute('aria-hidden', 'false');
        } else if (diff === 1) {
          // Immediate Right Card
          const tx = isMobile ? '62%' : isTablet ? 'min(70%, 310px)' : 'clamp(380px, 31vw, 440px)';
          const rotY = isMobile ? -8 : -11;
          const tz = isMobile ? '-35px' : '-50px';
          const scale = isMobile ? 0.88 : 0.90;
          card.style.transform = `translateX(${activeOffset}px) translateX(${tx}) translateZ(${tz}) scale(${scale}) rotateY(${rotY}deg)`;
          card.style.opacity = isMobile ? '0.75' : '0.88';
          card.style.filter = 'none';
          card.style.zIndex = '7';
          card.style.pointerEvents = 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else if (diff === -1) {
          // Immediate Left Card
          const tx = isMobile ? '-62%' : isTablet ? 'max(-70%, -310px)' : 'clamp(-440px, -31vw, -380px)';
          const rotY = isMobile ? 8 : 11;
          const tz = isMobile ? '-35px' : '-50px';
          const scale = isMobile ? 0.88 : 0.90;
          card.style.transform = `translateX(${activeOffset}px) translateX(${tx}) translateZ(${tz}) scale(${scale}) rotateY(${rotY}deg)`;
          card.style.opacity = isMobile ? '0.75' : '0.88';
          card.style.filter = 'none';
          card.style.zIndex = '7';
          card.style.pointerEvents = 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else if (diff === 2) {
          // Far Right
          const tx = isMobile ? '108%' : isTablet ? 'min(115%, 500px)' : 'clamp(660px, 55vw, 760px)';
          const rotY = isMobile ? -14 : -18;
          const tz = isMobile ? '-70px' : '-95px';
          const scale = isMobile ? 0.74 : 0.78;
          card.style.transform = `translateX(${activeOffset}px) translateX(${tx}) translateZ(${tz}) scale(${scale}) rotateY(${rotY}deg)`;
          card.style.opacity = isMobile ? '0' : '0.62';
          card.style.filter = isMobile ? 'none' : 'blur(0.3px)';
          card.style.zIndex = '4';
          card.style.pointerEvents = isMobile ? 'none' : 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else if (diff === -2) {
          // Far Left
          const tx = isMobile ? '-108%' : isTablet ? 'max(-115%, -500px)' : 'clamp(-760px, -55vw, -660px)';
          const rotY = isMobile ? 14 : 18;
          const tz = isMobile ? '-70px' : '-95px';
          const scale = isMobile ? 0.74 : 0.78;
          card.style.transform = `translateX(${activeOffset}px) translateX(${tx}) translateZ(${tz}) scale(${scale}) rotateY(${rotY}deg)`;
          card.style.opacity = isMobile ? '0' : '0.62';
          card.style.filter = isMobile ? 'none' : 'blur(0.3px)';
          card.style.zIndex = '4';
          card.style.pointerEvents = isMobile ? 'none' : 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else if (diff === -3) {
          const tx = isTablet ? 'max(-200%, -700px)' : 'clamp(-1300px, -68vw, -900px)';
          card.style.transform = `translateX(${activeOffset}px) translateX(${tx}) translateZ(-125px) scale(0.68) rotateY(22deg)`;
          card.style.opacity = isMobile ? '0' : '0.38';
          card.style.filter = isMobile ? 'none' : 'blur(0.4px)';
          card.style.zIndex = '2';
          card.style.pointerEvents = isMobile ? 'none' : 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else if (diff === 3) {
          const tx = isMobile ? '180%' : isTablet ? 'min(170%, 600px)' : 'clamp(900px, 68vw, 1300px)';
          card.style.transform = `translateX(${activeOffset}px) translateX(${tx}) translateZ(-125px) scale(0.68) rotateY(-22deg)`;
          card.style.opacity = isMobile ? '0' : '0.38';
          card.style.filter = isMobile ? 'none' : 'blur(0.4px)';
          card.style.zIndex = '2';
          card.style.pointerEvents = isMobile ? 'none' : 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else {
          // Any outer slides beyond +/- 2
          card.style.transform = 'translateX(0) translateZ(-250px) scale(0.5)';
          card.style.opacity = '0';
          card.style.zIndex = '0';
          card.style.pointerEvents = 'none';
          card.setAttribute('aria-hidden', 'true');
        }
      });

      // Update Navigation Buttons (Always enabled in looping carousel)
      if (prevBtn) {
        prevBtn.disabled = false;
      }
      if (nextBtn) {
        nextBtn.disabled = false;
      }

      // Update Counter Badge
      if (counterCurrent) {
        counterCurrent.textContent = String(currentIndex + 1).padStart(2, '0');
      }

      // Update Tabs
      tabs.forEach((tab, tabIdx) => {
        if (tabIdx === currentIndex) {
          tab.classList.add('is-active');
          tab.setAttribute('aria-selected', 'true');
        } else {
          tab.classList.remove('is-active');
          tab.setAttribute('aria-selected', 'false');
        }
      });

      // Update the CTA hint label on each card:
      //   Active center card  -> 'Click for Full Details'
      //   Side cards          -> 'Click to Bring Forward'
      cards.forEach((card, cardIdx) => {
        const hintSpan = card.querySelector('.card-explore-hint > span:first-child');
        if (!hintSpan) return;
        hintSpan.textContent = (cardIdx === currentIndex)
          ? 'Click for Full Details'
          : 'Click to Bring Forward';
      });
    };

    // Helper function to smoothly bring any slide/box to the center front
    const bringCardToFront = (targetIdx) => {
      stopAutoplay();
      const normalizedTarget = ((targetIdx % totalCards) + totalCards) % totalCards;
      if (normalizedTarget === currentIndex) return;

      let diff = normalizedTarget - currentIndex;
      while (diff > totalCards / 2) diff -= totalCards;
      while (diff < -totalCards / 2) diff += totalCards;
      slideDirection = diff >= 0 ? 1 : -1;
      updateSlider(normalizedTarget);
    };

    // -------------------------------------------------------------------------
    // Hover-to-front interactions for every card
    // Uses a cooldown window to prevent chain-reaction slides when a card
    // drifts under a stationary cursor after being repositioned by JS.
    // -------------------------------------------------------------------------
    let lastPointerX = -1;
    let lastPointerY = -1;
    let hoverGlideTimer = null;
    // Timestamp until which hover-triggered slides are suppressed (ms)
    let hoverCooldownUntil = 0;
    // Duration matches the CSS card transition (0.6 s) plus a small buffer
    const HOVER_COOLDOWN_MS = 680;

    cards.forEach((card, idx) => {
      // -----------------------------------------------------------------------
      // CLICK:
      //   Side card  → slide it smoothly to the center front (like tab click)
      //   Center card → open the full details modal
      // This mirrors the tab-name behaviour: click moves the card forward first;
      // a second click (now it is active) opens the details popup.
      // -----------------------------------------------------------------------
      card.addEventListener('click', (e) => {
        e.preventDefault();
        stopAutoplay();
        if (idx !== currentIndex) {
          // Side card clicked — bring it to center, no modal yet
          hoverCooldownUntil = Date.now() + HOVER_COOLDOWN_MS;
          bringCardToFront(idx);
        } else {
          // Already the active center card — open the details modal
          openDetailModal(idx);
        }
      });

      // -----------------------------------------------------------------------
      // KEYBOARD: Enter / Space mirrors click behaviour
      // -----------------------------------------------------------------------
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          stopAutoplay();
          if (idx !== currentIndex) {
            hoverCooldownUntil = Date.now() + HOVER_COOLDOWN_MS;
            bringCardToFront(idx);
          } else {
            openDetailModal(idx);
          }
        }
      });

      // -----------------------------------------------------------------------
      // MOUSEENTER: bring hovered card to center front
      // Guards:
      //  1. Skip touch-generated synthetic mouse events
      //  2. Require real pointer movement (>= 5 px in either axis) so that a
      //     card sliding under a stationary cursor does NOT trigger another slide
      //  3. Respect the cooldown window set after every programmatic slide
      // -----------------------------------------------------------------------
      card.addEventListener('mouseenter', (e) => {
        // Do nothing for touch-driven synthetic events
        if (e.pointerType === 'touch') return;

        stopAutoplay();
        if (idx === currentIndex) return; // Already the active card

        const now = Date.now();
        const deltaX = Math.abs(e.clientX - lastPointerX);
        const deltaY = Math.abs(e.clientY - lastPointerY);
        const realMove = (lastPointerX === -1) || (deltaX >= 5 || deltaY >= 5);

        // Always record current pointer position
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;

        clearTimeout(hoverGlideTimer);

        if (realMove && now >= hoverCooldownUntil) {
          // Genuine user hover — slide this card to center immediately
          hoverCooldownUntil = now + HOVER_COOLDOWN_MS;
          bringCardToFront(idx);
        }
        // If inside cooldown window (card slid under cursor): do nothing
      });

      // -----------------------------------------------------------------------
      // POINTERMOVE: also responds when cursor moves *inside* a side card
      // (e.g. user moves mouse slowly onto card without triggering mouseenter)
      // Same cooldown guard applies.
      // -----------------------------------------------------------------------
      card.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        if (idx === currentIndex) return;

        const now = Date.now();
        const deltaX = Math.abs(e.clientX - lastPointerX);
        const deltaY = Math.abs(e.clientY - lastPointerY);

        if ((deltaX >= 5 || deltaY >= 5) && now >= hoverCooldownUntil) {
          lastPointerX = e.clientX;
          lastPointerY = e.clientY;
          hoverCooldownUntil = now + HOVER_COOLDOWN_MS;
          stopAutoplay();
          bringCardToFront(idx);
        }
      });

      // -----------------------------------------------------------------------
      // MOUSELEAVE: clear any pending timer
      // -----------------------------------------------------------------------
      card.addEventListener('mouseleave', () => {
        clearTimeout(hoverGlideTimer);
      });
    });

    // Slide Tab bar click & hover interactions (synchronous with boxes)
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        stopAutoplay();
        const targetIdx = parseInt(tab.getAttribute('data-index'), 10);
        if (!isNaN(targetIdx)) {
          bringCardToFront(targetIdx);
        }
      });

      tab.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'touch') return;
        stopAutoplay();
        const targetIdx = parseInt(tab.getAttribute('data-index'), 10);
        if (!isNaN(targetIdx) && targetIdx !== currentIndex) {
          bringCardToFront(targetIdx);
        }
      });
    });

    // Arrow button controls (Continuous Loop)
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopAutoplay();
        slideDirection = -1;
        updateSlider(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopAutoplay();
        slideDirection = 1;
        updateSlider(currentIndex + 1);
      });
    }

    // Keyboard navigation when focused on slider container
    workSlider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stopAutoplay();
        slideDirection = -1;
        updateSlider(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        stopAutoplay();
        slideDirection = 1;
        updateSlider(currentIndex + 1);
      }
    });

    // Touch and Drag swipe support
    let startX = 0;
    let isDragging = false;

    workSlider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });

    workSlider.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = endX - startX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          slideDirection = -1;
          updateSlider(currentIndex - 1);
        } else if (diffX < 0) {
          slideDirection = 1;
          updateSlider(currentIndex + 1);
        }
      }
      if (!isMouseInsideSection) {
        startAutoplay();
      }
    });

    workSlider.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      startX = e.clientX;
      isDragging = true;
      stopAutoplay();
    });

    window.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.clientX;
      const diffX = endX - startX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          slideDirection = -1;
          updateSlider(currentIndex - 1);
        } else if (diffX < 0) {
          slideDirection = 1;
          updateSlider(currentIndex + 1);
        }
      }
      if (!isMouseInsideSection) {
        startAutoplay();
      }
    });

    // Autoplay: Automatically advances to next card every 3.5 seconds
    const AUTOPLAY_INTERVAL = 3500;

    const startAutoplay = () => {
      if (autoplayTimer) clearInterval(autoplayTimer);
      if (isMouseInsideSection) return;
      autoplayTimer = setInterval(() => {
        slideDirection = 1;
        updateSlider(currentIndex + 1);
      }, AUTOPLAY_INTERVAL);
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    // Track mouse inside the entire initiatives section
    const initiativesSection = document.getElementById('initiatives');
    if (initiativesSection) {
      initiativesSection.addEventListener('mouseenter', () => {
        isMouseInsideSection = true;
        stopAutoplay();
      });
      initiativesSection.addEventListener('mouseleave', () => {
        isMouseInsideSection = false;
        if (!workDetailModal || !workDetailModal.classList.contains('is-open')) {
          startAutoplay();
        }
      });
    }

    // Responsive update on window resize
    window.addEventListener('resize', () => {
      updateSlider(currentIndex);
    });

    // Initial render
    updateSlider(0);

    // Smart viewport observer: only run autoplay when initiatives section is in view
    if (initiativesSection && 'IntersectionObserver' in window) {
      let wasInitiativesInView = false;
      const sliderObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!wasInitiativesInView) {
              updateSlider(0);
              wasInitiativesInView = true;
            }
            if (!isMouseInsideSection) startAutoplay();
          } else {
            wasInitiativesInView = false;
            stopAutoplay();
          }
        });
      }, { threshold: 0.2 });
      sliderObserver.observe(initiativesSection);
    } else {
      startAutoplay();
    }
  }

  // ============================================================================
  // MODULE 8: AUTOMATIC HERO BACKGROUND SLIDESHOW (Cross-Fade Transitions)
  // ============================================================================
  /**
   * Manages cinematic background photograph transitions in the hero section.
   *
   * Working Mechanism:
   * - Each `.hero-slide` is stacked absolutely covering the hero viewport.
   * - Transitions between slides every 2.5 seconds by alternating opacity (0 <-> 1),
   *   z-index, and subtle scale zoom (1.0 <-> 1.05) to give a subtle Ken Burns effect.
   */
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;

  if (slides.length > 0) {
    const applySlidePosition = (slide) => {
      const isMobile = window.innerWidth <= 767;
      if (isMobile && slide.dataset.mobilePosition) {
        slide.style.backgroundPosition = slide.dataset.mobilePosition;
      } else {
        slide.style.backgroundPosition = slide.dataset.position || 'center';
      }
    };

    // Initialize base styles on all slides
    slides.forEach((slide, idx) => {
      slide.style.position = 'absolute';
      slide.style.inset = '0';
      slide.style.backgroundSize = 'cover';
      applySlidePosition(slide);
      slide.style.transition = 'opacity 1.2s ease-in-out';
      slide.style.opacity = idx === 0 ? '1' : '0';
      slide.style.zIndex = idx === 0 ? '2' : '1';
    });

    window.addEventListener('resize', () => {
      slides.forEach(applySlidePosition);
    });

    setInterval(() => {
      const prevSlide = slides[currentSlide];
      currentSlide = (currentSlide + 1) % slides.length;
      const nextSlide = slides[currentSlide];

      // Fade out previous slide (no zoom scale)
      prevSlide.style.opacity = '0';
      prevSlide.style.zIndex = '1';

      // Fade in next slide (no zoom scale)
      nextSlide.style.opacity = '1';
      nextSlide.style.zIndex = '2';
    }, 3800);
  }

  // ============================================================================
  // MODULE 9: RESPONSIVE MOBILE NAVIGATION DRAWER
  // ============================================================================
  /**
   * Controls the mobile slide-out navigation overlay menu.
   *
   * Responsibilities:
   * - Toggles the `.open` class on `#mobileNav`.
   * - Maintains accessible ARIA state (`aria-expanded`) on `#mobileToggle`.
   * - Automatically collapses drawer when any internal navigation link is tapped.
   */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isExpanded = mobileNav.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Auto-close menu when link is clicked so user lands cleanly on target section
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }

  // ============================================================================
  // ============================================================================
  // MODULE 10: SYNCHRONIZED IMPACT STATS & LIVING MOVEMENT ARCH
  // ============================================================================
  // ============================================================================
  // MODULE 10: LIVING SACRED TREE & SYNCHRONIZED IMPACT COUNTERS
  // ============================================================================
  /**
   * Synchronized Movement & Growing Tree Controller:
   * - Leaves on the sacred tree sprout and multiply in exact 1:1 synchronization
   *   with the numbers increasing (same speed, shared RAF elapsed-time timeline).
   * - Bare wood trunk and deep anchoring roots swell with vital sap.
   * - Golden morning sun aura intensifies as the crown reaches full bloom.
   * - Smooth cycle loop with comfortable reading hold at 100% peak (20k+, 18, 35+, 250+).
   * - Respects `prefers-reduced-motion` and automatically pauses off-screen.
   */
  const impactMetrics = document.querySelector('.impact-metrics-section');
  const impactCounters = Array.from(document.querySelectorAll('.impact-metrics-section [data-count-up]'));
  const impactTreeFrame = document.getElementById('impactTreeFrame');
  const treeSunAura = document.getElementById('treeSunAura');
  const treeWoodwork = document.getElementById('treeWoodwork');
  const treeLeavesLayer = document.getElementById('treeLeavesLayer');
  const impactMainCounterWrap = document.getElementById('impactMainCounterWrap');

  // Parse counters configuration
  const counterItems = impactCounters.map((el) => {
    const target = Number(el.dataset.countUp) || 0;
    const suffix = el.dataset.countSuffix || '';
    const compact = el.dataset.countFormat === 'compact';
    return { el, target, suffix, compact };
  });

  // Value formatting function
  const formatCounterValue = (value, compact, suffix) => {
    let formatted = '';
    if (compact) {
      const thousands = Math.round(value / 1000);
      formatted = thousands >= 1 ? `${thousands}k` : '0';
    } else {
      formatted = Math.round(value).toLocaleString();
    }
    return `${formatted}${suffix}`;
  };

  // Build 120 leaves procedurally across 9 branch canopy clusters
  const FOLIAGE_PALETTE = [
    { fill: '#1E4829', stroke: '#14331C' }, // Deep Forest Green
    { fill: '#2A683B', stroke: '#1E4829' }, // Emerald
    { fill: '#3E8A54', stroke: '#2A683B' }, // Rich Neem Green
    { fill: '#5AA872', stroke: '#3E8A54' }, // Fresh Leaf Green
    { fill: '#7BC493', stroke: '#5AA872' }, // Tender Sage
    { fill: '#D97724', stroke: '#B25B15' }, // Sacred Saffron Shoot
    { fill: '#EAA036', stroke: '#D97724' }, // Golden Sunlight Leaf
  ];

  const CANOPY_CLUSTERS = [
    { cx: 85, cy: 92, rx: 28, ry: 22, count: 14, minT: 0.16 },
    { cx: 125, cy: 70, rx: 28, ry: 22, count: 16, minT: 0.08 },
    { cx: 165, cy: 50, rx: 26, ry: 20, count: 16, minT: 0.04 },
    { cx: 205, cy: 40, rx: 25, ry: 18, count: 16, minT: 0.01 },
    { cx: 230, cy: 38, rx: 24, ry: 16, count: 18, minT: 0.01 },
    { cx: 255, cy: 40, rx: 25, ry: 18, count: 16, minT: 0.01 },
    { cx: 295, cy: 50, rx: 26, ry: 20, count: 16, minT: 0.04 },
    { cx: 335, cy: 70, rx: 28, ry: 22, count: 16, minT: 0.08 },
    { cx: 375, cy: 92, rx: 28, ry: 22, count: 14, minT: 0.16 },
  ];

  const pseudoRnd = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  let rndSeed = 1947;
  const LEAVES_CONFIG = [];

  CANOPY_CLUSTERS.forEach((c) => {
    for (let i = 0; i < c.count; i++) {
      const angle = pseudoRnd(rndSeed++) * Math.PI * 2;
      const dist = Math.sqrt(pseudoRnd(rndSeed++));
      const x = Math.round(c.cx + Math.cos(angle) * c.rx * dist);
      const y = Math.round(c.cy + Math.sin(angle) * c.ry * dist);

      // Staggered threshold from 0.01 to 0.98
      const thresh = Math.min(0.98, Math.max(0.01, c.minT + (pseudoRnd(rndSeed++) * 0.78)));
      const rot = Math.round((pseudoRnd(rndSeed++) - 0.5) * 150); // -75 to +75 deg
      const scale = 0.95 + pseudoRnd(rndSeed++) * 0.45;
      const col = FOLIAGE_PALETTE[Math.floor(pseudoRnd(rndSeed++) * FOLIAGE_PALETTE.length)];
      const template = (pseudoRnd(rndSeed++) > 0.45) ? 'treeLeafA' : ((pseudoRnd(rndSeed++) > 0.3) ? 'treeLeafB' : 'treeLeafC');
      const swayPhase = pseudoRnd(rndSeed++) * Math.PI * 2;

      LEAVES_CONFIG.push({ x, y, thresh, rot, scale, col, template, swayPhase });
    }
  });

  // Sort leaves by threshold and evenly distribute bloom timing across progress range (0.02 to 0.96)
  // so leaf sprouting progresses in direct 1:1 unison with the count-up
  LEAVES_CONFIG.sort((a, b) => a.thresh - b.thresh);
  const totalLeaves = LEAVES_CONFIG.length;
  LEAVES_CONFIG.forEach((leaf, idx) => {
    leaf.thresh = 0.02 + (idx / (totalLeaves - 1)) * 0.94;
  });

  const leafNodes = [];
  if (treeLeavesLayer) {
    LEAVES_CONFIG.forEach((leaf) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'tree-dynamic-leaf');
      g.style.fill = leaf.col.fill;
      g.style.color = leaf.col.stroke;
      g.style.opacity = '0';

      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', `#${leaf.template}`);
      g.appendChild(use);
      treeLeavesLayer.appendChild(g);

      leafNodes.push({ el: g, data: leaf });
    });
  }

  // Animation Timeline Constants
  const COUNT_DURATION = 2800; // 2.8s brisk, smooth count up & foliage bloom until original numbers appear

  let sharedRafId = null;
  let cycleStartTime = null;
  let isLoopActive = false;
  let hasCompletedOnce = false;

  // Single shared requestAnimationFrame loop for BOTH numbers and tree leaves
  const renderImpactFrame = (now) => {
    if (!isLoopActive) return;

    if (!cycleStartTime) cycleStartTime = now;
    const elapsed = now - cycleStartTime;

    let progress = 0;
    let isPeak = false;

    if (elapsed < COUNT_DURATION) {
      // Natural smooth deceleration as leaves sprout and numbers rise
      const t = elapsed / COUNT_DURATION;
      progress = 1 - Math.pow(1 - t, 1.85);
    } else {
      // Reached original numbers - keep full bloom and don't reset
      progress = 1.0;
      isPeak = true;
      hasCompletedOnce = true;
    }

    // 1. Update Numbers (synchronized with leaf growth)
    counterItems.forEach(({ el, target, suffix, compact }) => {
      if (isPeak) {
        el.textContent = formatCounterValue(target, compact, suffix);
        el.classList.add('is-peak');
      } else {
        const currentVal = Math.min(target, Math.round(target * progress));
        el.textContent = formatCounterValue(currentVal, compact, suffix);
        el.classList.remove('is-peak');
      }
    });

    // 2. Update Tree Leaves (Increases until original numbers appear)
    leafNodes.forEach(({ el, data }) => {
      const { x, y, thresh, rot, scale, swayPhase } = data;
      const sway = Math.sin((now * 0.003) + swayPhase) * 3.5;
      const curRot = rot + sway;

      if (progress >= thresh) {
        let finalScale = scale;
        let opacity = 1;

        if (progress < 1.0) {
          // Sprouting & spring unfurl until original numbers appear
          const growth = Math.min(1, (progress - thresh) / 0.04);
          const pop = growth < 0.7
            ? (growth / 0.7) * 1.15
            : 1.15 - ((growth - 0.7) / 0.3) * 0.15;
          finalScale = scale * pop;
          opacity = Math.min(1, growth * 1.8);
        }

        el.style.opacity = opacity.toFixed(3);
        el.setAttribute('transform', `translate(${x}, ${y}) rotate(${curRot}) scale(${finalScale})`);
      } else {
        el.style.opacity = '0';
        el.setAttribute('transform', `translate(${x}, ${y}) rotate(${curRot}) scale(0)`);
      }
    });

    // 3. Tree Trunk Vital Growth & Sun Aura
    if (treeWoodwork) {
      const trunkScale = 0.94 + progress * 0.06;
      treeWoodwork.setAttribute('transform', `translate(230, 270) scale(${trunkScale}) translate(-230, -270)`);
    }

    if (treeSunAura) {
      treeSunAura.style.opacity = (0.2 + progress * 0.8).toFixed(2);
      treeSunAura.style.transform = `translate(-50%, 0) scale(${0.85 + progress * 0.25})`;
    }

    sharedRafId = requestAnimationFrame(renderImpactFrame);
  };

  const startShowcase = (forceReplay = false) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      counterItems.forEach(({ el, target, suffix, compact }) => {
        el.textContent = formatCounterValue(target, compact, suffix);
        el.classList.add('is-peak');
      });
      leafNodes.forEach(({ el, data }) => {
        el.style.opacity = '1';
        el.setAttribute('transform', `translate(${data.x}, ${data.y}) rotate(${data.rot}) scale(${data.scale})`);
      });
      if (treeSunAura) {
        treeSunAura.style.opacity = '1';
      }
      return;
    }

    if (hasCompletedOnce && !forceReplay) {
      isLoopActive = true;
      if (!sharedRafId) sharedRafId = requestAnimationFrame(renderImpactFrame);
      return;
    }

    if (sharedRafId) {
      cancelAnimationFrame(sharedRafId);
      sharedRafId = null;
    }

    cycleStartTime = performance.now();
    isLoopActive = true;
    sharedRafId = requestAnimationFrame(renderImpactFrame);
  };

  const stopShowcase = () => {
    isLoopActive = false;
    if (sharedRafId) {
      cancelAnimationFrame(sharedRafId);
      sharedRafId = null;
    }
  };

  // Cleanup handler on page navigation or unmount
  let impactObserver = null;
  const cleanupImpact = () => {
    stopShowcase();
    if (impactObserver) {
      impactObserver.disconnect();
      impactObserver = null;
    }
  };

  window.addEventListener('beforeunload', cleanupImpact);
  window.addEventListener('pagehide', cleanupImpact);

  // Initialize
  if (impactMetrics && counterItems.length > 0) {
    // Set initial 0 values
    counterItems.forEach(({ el, suffix, compact }) => {
      el.textContent = formatCounterValue(0, compact, suffix);
    });

    // User replay interactions
    if (impactMainCounterWrap) {
      impactMainCounterWrap.addEventListener('click', () => {
        hasCompletedOnce = false;
        startShowcase(true);
      });
    }
    if (impactTreeFrame) {
      impactTreeFrame.addEventListener('click', () => {
        hasCompletedOnce = false;
        startShowcase(true);
      });
    }

    // Scroll trigger with IntersectionObserver
    if ('IntersectionObserver' in window) {
      impactObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startShowcase();
          } else {
            stopShowcase();
          }
        });
      }, { threshold: 0.15 });

      impactObserver.observe(impactMetrics);
    } else {
      startShowcase();
    }
  }

  // ============================================================================
  // MODULE 11: FOOTER EMAIL CLIPBOARD UTILITY
  // ============================================================================
  /**
   * One-click copy interaction on footer contact email buttons (.footer-copy-btn).
   *
   * Flow:
   * 1. Copies target email (from `data-copy` or default) to navigator.clipboard.
   * 2. Temporarily replaces icon with a checkmark and tints button with theme accent color.
   * 3. Reverts back after 1500ms.
   * 4. Gracefully degrades to native mailto: link on insecure contexts or older browsers.
   */
  const footerCopyButtons = document.querySelectorAll('.footer-copy-btn');
  footerCopyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = btn.dataset.copy || 'info@towardsmybharat.com';
      try {
        await navigator.clipboard.writeText(email);
        const icon = btn.querySelector('.material-symbols-outlined');
        if (icon) {
          const original = icon.textContent;
          icon.textContent = 'check';
          btn.style.color = 'var(--color-accent, #a7c957)';
          setTimeout(() => {
            icon.textContent = original;
            btn.style.color = '';
          }, 1500);
        }
      } catch (err) {
        // Fallback for older browsers or non-HTTPS development
        window.location.href = `mailto:${email}`;
      }
    });
  });

  // ============================================================================
  // MODULE 12: INSTITUTIONAL INQUIRY BANNER & CONTACT CARDS GMAIL REDIRECT
  // ============================================================================
  const inquireBanner = document.getElementById('coursesInquireBanner');
  if (inquireBanner) {
    inquireBanner.addEventListener('click', (e) => {
      // Let native <a> click handle itself if clicked directly
      if (e.target.closest('a')) return;
      const url = inquireBanner.getAttribute('data-href');
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
    inquireBanner.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('a')) return;
        e.preventDefault();
        const url = inquireBanner.getAttribute('data-href');
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }
    });
  }

  // Contact Cards (Pitch a collaboration / Reach the team / See open roles)
  const contactCards = document.querySelectorAll('.contact-card[data-href]');
  contactCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const url = card.getAttribute('data-href');
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('a')) return;
        e.preventDefault();
        const url = card.getAttribute('data-href');
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }
    });
  });

  // ============================================================================
  // MODULE 13: ENDLESS SEAMLESS FIELD GALLERY MARQUEE
  // ============================================================================
  const fieldGalleryTrack = document.querySelector('.field-gallery-track');
  if (fieldGalleryTrack && !fieldGalleryTrack.dataset.loopReady) {
    const originalSlides = Array.from(fieldGalleryTrack.children);
    if (originalSlides.length > 0) {
      fieldGalleryTrack.dataset.loopReady = 'true';
      const viewport = fieldGalleryTrack.closest('.field-gallery-viewport');
      const minHalfWidth = Math.max(window.innerWidth || 1440, viewport ? viewport.clientWidth : 0);

      // Ensure the first half exceeds the viewport width so blank space never appears
      const firstHalfSlides = [...originalSlides];
      let safetyCount = 0;
      while (fieldGalleryTrack.scrollWidth < minHalfWidth + 400 && safetyCount < 6) {
        originalSlides.forEach((slide) => {
          const filler = slide.cloneNode(true);
          filler.setAttribute('aria-hidden', 'true');
          fieldGalleryTrack.appendChild(filler);
          firstHalfSlides.push(filler);
        });
        safetyCount += 1;
      }

      // Append an exact mirror half so translateX(-50%) loops seamlessly forever
      const fragment = document.createDocumentFragment();
      firstHalfSlides.forEach((slide) => {
        const clone = slide.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        fragment.appendChild(clone);
      });
      fieldGalleryTrack.appendChild(fragment);

      // Keep scroll speed consistent (~55px/sec) regardless of how many event cards are added
      const halfWidth = fieldGalleryTrack.scrollWidth / 2;
      if (halfWidth > 0) {
        const durationSeconds = Math.max(20, Math.round(halfWidth / 55));
        fieldGalleryTrack.style.setProperty('--gallery-duration', `${durationSeconds}s`);
      }
    }
  }
});
