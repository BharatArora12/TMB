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
   * - category: Editorial topic label (e.g., Heritage, Leadership, Research)
   * - readTime: Estimated reader duration
   * - title: Article headline
   * - description: Condensed thematic abstract
   */
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

  /**
   * Renders a given collection of blog post objects into a specified DOM container.
   * Automatically styles the first item as a highlighted 'featured-blog'.
   *
   * @param {HTMLElement} container - The destination element (e.g. #latestBlogs or #allBlogs)
   * @param {Array<Object>} posts - Slice or complete array of blog objects
   */
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

  // Mount blogs dynamically depending on which page is currently loaded:
  // - index.html mounts the top 4 articles into #latestBlogs
  // - all-blogs.html mounts the full article array into #allBlogs
  const latestBlogs = document.getElementById('latestBlogs');
  const allBlogs = document.getElementById('allBlogs');
  if (latestBlogs) renderBlogs(latestBlogs, blogs.slice(0, 4));
  if (allBlogs) renderBlogs(allBlogs, blogs);

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
  // MODULE 4: ROTATING HERO IDENTITY WORD (Multilingual Cycler)
  // ============================================================================
  /**
   * Periodically alternates the hero headline identity between:
   * 'Bharat', 'India', and 'भारत'.
   *
   * Mechanism:
   * 1. Fades opacity to 0.
   * 2. Swaps textContent after 250ms (during invisible midpoint).
   * 3. Fades opacity back to 1.
   * Runs every 2.2 seconds.
   */
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
  const udyamCredentialButton = document.querySelector('.hero-credential');
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

  if (udyamCredentialButton && udyamCertModal) {
    udyamCredentialButton.addEventListener('click', () => toggleUdyamCert(true));
    // Keyboard activation (Enter or Space)
    udyamCredentialButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleUdyamCert(true);
      }
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

  // Comprehensive Detailed Data Schema for Each Initiative (Injected into Modal)
  const initiativesData = [
    {
      index: '01',
      tag: 'Digital Media & Storytelling',
      title: 'Short Form Videos',
      tagline: 'Sovereign Media, Culture & Civilizational Narratives in the Digital Age',
      overview: 'Our short-form video division produces bite-sized, high-production cultural explainers, podcasts, and digital essays tailored for India’s digitally native youth. By bridging classical civilizational wisdom with modern storytelling, we demystify history, statecraft, art, and philosophy for millions across social platforms.',
      pillars: [
        {
          icon: 'history_edu',
          title: 'Civilizational History',
          desc: 'Highlighting unsung Indian thinkers, mathematicians, scientists, architects, and historical turning points.'
        },
        {
          icon: 'psychology',
          title: 'Indian Knowledge Systems (IKS)',
          desc: 'Distilling timeless ideas from Vedanta, Arthashastra, and Nyaya into practical modern frameworks.'
        },
        {
          icon: 'videocam',
          title: 'On-Ground Visual Dispatches',
          desc: 'Documentary vignettes capturing living traditions, temple architecture, sacred geography, and artisan hubs.'
        },
        {
          icon: 'podcasts',
          title: 'Youth Cultural Dialogues',
          desc: 'Interactive digital interviews and debates addressing contemporary challenges with cultural depth.'
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
      tag: 'Curated Pedagogy',
      title: 'Online Courses',
      tagline: 'Structured Learning Pathways in Indic Thought, Ethics & Sovereign Strategy',
      overview: 'We offer cohort-based and self-paced digital educational modules designed in collaboration with leading scholars, historians, and practitioners. Courses provide structured foundational learning in Indian epistemology, classical literature, ethical statecraft, and civilizational literacy.',
      pillars: [
        {
          icon: 'menu_book',
          title: 'Foundations of Indic Philosophy',
          desc: 'Systematic study of the Shad-Darshanas, cognitive frameworks, ethics, and metaphysics.'
        },
        {
          icon: 'account_tree',
          title: 'Statecraft & Strategic Thought',
          desc: 'Analysing Kautilya’s Arthashastra, Rajadharma, and strategic traditions for modern leaders.'
        },
        {
          icon: 'school',
          title: 'Civilizational Literacy for Educators',
          desc: 'Equipping teachers and educators with indigenous pedagogical tools and historical frameworks.'
        },
        {
          icon: 'workspace_premium',
          title: 'Guided Cohorts & Certification',
          desc: 'Interactive webinars, curated reading archives, peer review groups, and verified certifications.'
        }
      ],
      meta: [
        { label: 'Delivery Mode', value: 'Live Cohorts & Self-Paced Modules' },
        { label: 'Target Audience', value: 'University Students, Scholars & Professionals' },
        { label: 'Curriculum Focus', value: 'IKS, Classical Governance & Ethics' }
      ]
    },
    {
      index: '03',
      tag: 'Immersive Learning',
      title: 'Offline Workshops',
      tagline: 'Experiential Character Development, Rhetoric & Heritage Expeditions',
      overview: 'Our on-ground workshops and residential academies offer young leaders immersive environments for intellectual rigor, moral clarity, and peer bonding. Through dialectics, mindfulness, and direct cultural exploration, participants develop grounded perspectives and executive leadership capabilities.',
      pillars: [
        {
          icon: 'forum',
          title: 'Classical Debate & Vada Circles',
          desc: 'Training youth in the ancient Indic Vada tradition—debating for truth and synthesis rather than victory.'
        },
        {
          icon: 'explore',
          title: 'Heritage & Field Expeditions',
          desc: 'Guided field expeditions across architectural marvels, sacred rivers, and heritage clusters across Bharat.'
        },
        {
          icon: 'self_improvement',
          title: 'Inner Leadership Retreats',
          desc: 'Residential camps cultivating emotional resilience, ethical clarity, and holistic discipline.'
        },
        {
          icon: 'record_voice_over',
          title: 'Public Rhetoric & Expression',
          desc: 'Intensive coaching in articulation, persuasive speechwriting, and nuanced policy presentation.'
        }
      ],
      meta: [
        { label: 'Format', value: 'Residential Bootcamps & City Intensives' },
        { label: 'Duration', value: 'Weekend Retreats to 7-Day Immersions' },
        { label: 'Key Outcome', value: 'Leadership Clarity, Public Speaking & Camaraderie' }
      ]
    },
    {
      index: '04',
      tag: 'Grassroots Synergy',
      title: 'Collaborations with NGOs',
      tagline: 'Bridging Youth Passion with Measurable Grassroots Social Impact',
      overview: 'Towards My Bharat collaborates with mission-aligned non-profit organizations, social enterprises, and community trusts. We mobilize youth volunteers, researchers, and creators to support rural education, artisan livelihoods, ecological conservation, and cultural revival.',
      pillars: [
        {
          icon: 'local_library',
          title: 'Rural Education & Knowledge Centers',
          desc: 'Establishing grassroots libraries and supplemental learning cohorts in rural communities.'
        },
        {
          icon: 'palette',
          title: 'Artisan & Craft Guild Support',
          desc: 'Assisting traditional handloom and artisan clusters with digital storytelling, branding, and market access.'
        },
        {
          icon: 'forest',
          title: 'Ecological & Sacred Grove Stewardship',
          desc: 'Youth-led conservation of sacred geography, afforestation drives, and traditional water bodies.'
        },
        {
          icon: 'volunteer_activism',
          title: 'Social Fellowship Placement',
          desc: 'Structured fellowships placing skilled graduates inside high-impact grassroots organizations.'
        }
      ],
      meta: [
        { label: 'Partner Network', value: '40+ NGOs Across 12 Indian States' },
        { label: 'Volunteer Capacity', value: '1,500+ Active Youth Volunteer Hours / Month' },
        { label: 'Impact Areas', value: 'Education, Heritage Crafts & Environment' }
      ]
    },
    {
      index: '05',
      tag: 'Global Leadership',
      title: 'Representing India Globally',
      tagline: 'Articulating Bharat’s Civilizational Perspective on the World Stage',
      overview: 'We prepare, mentor, and delegate young Indian scholars and professionals to represent India’s civilizational worldview at international youth summits, academic symposiums, and global diplomatic conferences. We bring nuanced Indic perspectives to global discussions on ethics, sustainability, technology, and pluralism.',
      pillars: [
        {
          icon: 'public',
          title: 'International Youth Delegations',
          desc: 'Sending articulate youth leaders to global youth forums, G20/Y20 dialogues, and international summits.'
        },
        {
          icon: 'handshake',
          title: 'Civilizational Diplomacy',
          desc: 'Fostering cross-cultural dialogues grounded in mutual respect and ancient Indic universalism.'
        },
        {
          icon: 'description',
          title: 'Policy Research & White Papers',
          desc: 'Publishing youth-led policy position papers on global sustainability, digital ethics, and cultural preservation.'
        },
        {
          icon: 'language',
          title: 'Diaspora Youth Engagement',
          desc: 'Connecting global Indian diaspora students with their ancestral heritage and nation-building initiatives.'
        }
      ],
      meta: [
        { label: 'Global Footprint', value: 'Delegations & Forums Across 15+ Countries' },
        { label: 'Key Platforms', value: 'Y20, Global Policy Symposia & Bilateral Forums' },
        { label: 'Primary Goal', value: 'Sovereign Narrative & Global Thought Leadership' }
      ]
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

    /**
     * Injects detailed initiative data into #workDetailModal and reveals it.
     * Prevents page scroll behind modal and temporarily halts autoplay timer.
     *
     * @param {number} index - 0-indexed position corresponding to initiativesData
     */
    const openDetailModal = (index) => {
      const data = initiativesData[index];
      if (!data || !workDetailModal || !workModalContent) return;

      // Stop automated transitions while user reads initiative details
      stopAutoplay();

      // Dynamically compile markup using data from initiativesData
      workModalContent.innerHTML = `
        <div class="modal-header-meta">
          <span class="modal-num-badge">${data.index}</span>
          <span class="modal-tag">${data.tag}</span>
        </div>
        <h2 class="modal-title" id="workModalTitle">${data.title}</h2>
        <p class="modal-tagline">${data.tagline}</p>
        <p class="modal-overview">${data.overview}</p>

        <h3 class="modal-pillars-heading">Key Focus Areas &amp; Methodologies</h3>
        <div class="modal-pillars-grid">
          ${data.pillars.map(pillar => `
            <div class="modal-pillar-item">
              <h4><span class="material-symbols-outlined">${pillar.icon}</span> ${pillar.title}</h4>
              <p>${pillar.desc}</p>
            </div>
          `).join('')}
        </div>

        <div class="modal-meta-strip">
          ${data.meta.map(m => `
            <div class="modal-meta-col">
              <span class="modal-meta-label">${m.label}</span>
              <span class="modal-meta-value">${m.value}</span>
            </div>
          `).join('')}
        </div>

        <div class="modal-actions">
          <a href="#voices" class="btn btn-primary work-modal-cta-btn">
            <span>Participate &amp; Join</span>
            <span class="material-symbols-outlined">arrow_forward</span>
          </a>
          <button type="button" class="modal-btn-close" id="workModalInnerClose">Close Details</button>
        </div>
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

      // Close modal if user clicks CTA link to navigate to another section
      const ctaBtn = workModalContent.querySelector('.work-modal-cta-btn');
      if (ctaBtn) {
        ctaBtn.addEventListener('click', closeDetailModal);
      }
    };

    /**
     * Hides the detail modal dialog, restores page scrolling, and resumes autoplay.
     */
    const closeDetailModal = () => {
      if (!workDetailModal) return;
      workDetailModal.classList.remove('is-open');
      workDetailModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      startAutoplay();
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

    // Keyboard ESC dismisses modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && workDetailModal && workDetailModal.classList.contains('is-open')) {
        closeDetailModal();
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

      cards.forEach((card, cardIndex) => {
        const diff = cardIndex - currentIndex;

        card.classList.remove('is-active');

        if (diff === 0) {
          // Active Center Card
          card.classList.add('is-active');
          card.style.transform = 'translateX(0) translateZ(0) scale(1) rotateY(0deg)';
          card.style.opacity = '1';
          card.style.filter = 'none';
          card.style.zIndex = '10';
          card.style.pointerEvents = 'auto';
          card.setAttribute('aria-hidden', 'false');
        } else if (diff === 1) {
          // Immediate Right Card
          const tx = isMobile ? '52%' : isTablet ? 'min(95%, 280px)' : 'min(115%, 340px)';
          const rotY = isMobile ? -15 : -16;
          const tz = isMobile ? '-70px' : '-75px';
          const scale = isMobile ? 0.86 : 0.88;
          card.style.transform = `translateX(${tx}) translateZ(${tz}) scale(${scale}) rotateY(${rotY}deg)`;
          card.style.opacity = '0.88';
          card.style.filter = 'none';
          card.style.zIndex = '6';
          card.style.pointerEvents = 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else if (diff === -1) {
          // Immediate Left Card
          const tx = isMobile ? '-52%' : isTablet ? 'max(-95%, -280px)' : 'max(-115%, -340px)';
          const rotY = isMobile ? 15 : 16;
          const tz = isMobile ? '-70px' : '-75px';
          const scale = isMobile ? 0.86 : 0.88;
          card.style.transform = `translateX(${tx}) translateZ(${tz}) scale(${scale}) rotateY(${rotY}deg)`;
          card.style.opacity = '0.88';
          card.style.filter = 'none';
          card.style.zIndex = '6';
          card.style.pointerEvents = 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else if (diff === 2) {
          // Far Right
          const tx = isMobile ? '92%' : isTablet ? 'min(170%, 500px)' : 'min(215%, 640px)';
          const rotY = isMobile ? -24 : -28;
          const tz = isMobile ? '-130px' : '-150px';
          const scale = isMobile ? 0.72 : 0.76;
          card.style.transform = `translateX(${tx}) translateZ(${tz}) scale(${scale}) rotateY(${rotY}deg)`;
          card.style.opacity = '0.68';
          card.style.filter = 'blur(0.3px)';
          card.style.zIndex = '4';
          card.style.pointerEvents = 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else if (diff === -2) {
          // Far Left
          const tx = isMobile ? '-92%' : isTablet ? 'max(-170%, -500px)' : 'max(-215%, -640px)';
          const rotY = isMobile ? 24 : 28;
          const tz = isMobile ? '-130px' : '-150px';
          const scale = isMobile ? 0.72 : 0.76;
          card.style.transform = `translateX(${tx}) translateZ(${tz}) scale(${scale}) rotateY(${rotY}deg)`;
          card.style.opacity = '0.68';
          card.style.filter = 'blur(0.3px)';
          card.style.zIndex = '4';
          card.style.pointerEvents = 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else if (diff === 3) {
          // Outer Right (fans out on wider screens)
          const tx = isMobile ? '125%' : isTablet ? 'min(235%, 680px)' : 'min(310%, 910px)';
          const rotY = isMobile ? -32 : -36;
          const tz = isMobile ? '-170px' : '-210px';
          const scale = isMobile ? 0.62 : 0.64;
          card.style.transform = `translateX(${tx}) translateZ(${tz}) scale(${scale}) rotateY(${rotY}deg)`;
          card.style.opacity = isMobile ? '0' : '0.45';
          card.style.filter = 'blur(0.6px)';
          card.style.zIndex = '2';
          card.style.pointerEvents = isMobile ? 'none' : 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else if (diff === -3) {
          // Outer Left (fans out on wider screens)
          const tx = isMobile ? '-125%' : isTablet ? 'max(-235%, -680px)' : 'max(-310%, -910px)';
          const rotY = isMobile ? 32 : 36;
          const tz = isMobile ? '-170px' : '-210px';
          const scale = isMobile ? 0.62 : 0.64;
          card.style.transform = `translateX(${tx}) translateZ(${tz}) scale(${scale}) rotateY(${rotY}deg)`;
          card.style.opacity = isMobile ? '0' : '0.45';
          card.style.filter = 'blur(0.6px)';
          card.style.zIndex = '2';
          card.style.pointerEvents = isMobile ? 'none' : 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else if (diff > 3) {
          // Beyond right
          card.style.transform = 'translateX(140%) translateZ(-300px) scale(0.55) rotateY(-45deg)';
          card.style.opacity = '0';
          card.style.zIndex = '0';
          card.style.pointerEvents = 'none';
          card.setAttribute('aria-hidden', 'true');
        } else {
          // Beyond left
          card.style.transform = 'translateX(-140%) translateZ(-300px) scale(0.55) rotateY(45deg)';
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
    };

    // Card click & hover selection
    cards.forEach((card, idx) => {
      // Click selection
      card.addEventListener('click', (e) => {
        if (idx === currentIndex || e.target.closest('.work-open-popup-btn')) {
          openDetailModal(idx);
        } else {
          slideDirection = idx > currentIndex ? 1 : -1;
          updateSlider(idx);
          restartAutoplay();
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetailModal(idx);
        }
      });

      // Hover on previous or next cards triggers smooth slide
      card.addEventListener('mouseenter', () => {
        if (idx !== currentIndex) {
          slideDirection = idx > currentIndex ? 1 : -1;
          updateSlider(idx);
        }
      });
    });

    // Slide Tab bar click & hover interactions
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetIdx = parseInt(tab.getAttribute('data-index'), 10);
        if (!isNaN(targetIdx)) {
          slideDirection = targetIdx > currentIndex ? 1 : -1;
          updateSlider(targetIdx);
          restartAutoplay();
        }
      });

      tab.addEventListener('mouseenter', () => {
        const targetIdx = parseInt(tab.getAttribute('data-index'), 10);
        if (!isNaN(targetIdx) && targetIdx !== currentIndex) {
          slideDirection = targetIdx > currentIndex ? 1 : -1;
          updateSlider(targetIdx);
        }
      });
    });

    // Arrow button controls (Continuous Loop)
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        slideDirection = -1;
        updateSlider(currentIndex - 1);
        restartAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        slideDirection = 1;
        updateSlider(currentIndex + 1);
        restartAutoplay();
      });
    }

    // Keyboard navigation when focused on slider container
    workSlider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        slideDirection = -1;
        updateSlider(currentIndex - 1);
        restartAutoplay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        slideDirection = 1;
        updateSlider(currentIndex + 1);
        restartAutoplay();
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
      restartAutoplay();
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
      restartAutoplay();
    });

    // Autoplay: Automatically advances to next card every 3.5 seconds (3 to 4 seconds)
    const AUTOPLAY_INTERVAL = 3500;

    const startAutoplay = () => {
      if (autoplayTimer) clearInterval(autoplayTimer);
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

    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    // Pause autoplay on mouse hover over the active cards stage or tabs
    const workStage = workSlider.querySelector('.work-3d-stage');
    if (workStage) {
      workStage.addEventListener('mouseenter', stopAutoplay);
      workStage.addEventListener('mouseleave', () => {
        if (!workDetailModal || !workDetailModal.classList.contains('is-open')) {
          startAutoplay();
        }
      });
    }

    const tabsContainer = document.getElementById('workSliderTabs');
    if (tabsContainer) {
      tabsContainer.addEventListener('mouseenter', stopAutoplay);
      tabsContainer.addEventListener('mouseleave', () => {
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
    const initiativesSection = document.getElementById('initiatives');
    if (initiativesSection && 'IntersectionObserver' in window) {
      const sliderObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startAutoplay();
          } else {
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
    // Initialize base styles on all slides
    slides.forEach((slide, idx) => {
      slide.style.position = 'absolute';
      slide.style.inset = '0';
      slide.style.backgroundSize = 'cover';
      slide.style.backgroundPosition = slide.dataset.position || 'center';
      slide.style.transition = 'opacity 1.2s ease-in-out';
      slide.style.opacity = idx === 0 ? '1' : '0';
      slide.style.zIndex = idx === 0 ? '2' : '1';
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
    if (compact && value >= 1000) {
      formatted = `${Math.floor(value / 1000)}k`;
    } else {
      formatted = Math.floor(value).toLocaleString();
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

  // Sort leaves by threshold so leaf count increases at the EXACT SAME SPEED as the number
  LEAVES_CONFIG.sort((a, b) => a.thresh - b.thresh);

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
  const COUNT_DURATION = 4600; // 4.6s slow, smooth count up & foliage bloom
  const HOLD_DURATION = 2400;  // 2.4s comfortable reading hold at peak (20k+, 18, 35+, 250+)
  const FADE_DURATION = 400;   // 0.4s gentle fade before repeating
  const TOTAL_CYCLE = COUNT_DURATION + HOLD_DURATION + FADE_DURATION;

  let sharedRafId = null;
  let cycleStartTime = null;
  let isLoopActive = false;

  // Single shared requestAnimationFrame loop for BOTH numbers and tree leaves
  const renderImpactFrame = (now) => {
    if (!isLoopActive) return;

    if (!cycleStartTime) cycleStartTime = now;
    const elapsed = now - cycleStartTime;
    const cycleTime = elapsed % TOTAL_CYCLE;

    let progress = 0;
    let fade = 1.0;
    let isPeak = false;

    if (cycleTime < COUNT_DURATION) {
      // Natural cubic deceleration
      const t = cycleTime / COUNT_DURATION;
      progress = 1 - Math.pow(1 - t, 2.6);
    } else if (cycleTime < COUNT_DURATION + HOLD_DURATION) {
      progress = 1.0;
      isPeak = true;
    } else {
      progress = 1.0;
      isPeak = true;
      const fTime = cycleTime - (COUNT_DURATION + HOLD_DURATION);
      fade = Math.max(0, 1 - fTime / FADE_DURATION);
    }

    // 1. Update Numbers
    counterItems.forEach(({ el, target, suffix, compact }) => {
      const currentVal = Math.floor(target * progress);
      el.textContent = formatCounterValue(currentVal, compact, suffix);

      if (isPeak && fade > 0.6) {
        el.classList.add('is-peak');
      } else {
        el.classList.remove('is-peak');
      }
    });

    // 2. Update Tree Leaves (Increases at the EXACT SAME SPEED as the number)
    leafNodes.forEach(({ el, data }) => {
      const { x, y, thresh, rot, scale, swayPhase } = data;
      const sway = Math.sin((now * 0.003) + swayPhase) * 3.5;
      const curRot = rot + sway;

      if (progress >= thresh) {
        // Sprouting & spring unfurl
        const growth = Math.min(1, (progress - thresh) / 0.04);
        const pop = growth < 0.7 
          ? (growth / 0.7) * 1.15 
          : 1.15 - ((growth - 0.7) / 0.3) * 0.15;
        const finalScale = scale * pop;

        el.style.opacity = (Math.min(1, growth * 1.8) * fade).toFixed(3);
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
      treeSunAura.style.opacity = ((0.2 + progress * 0.8) * fade).toFixed(2);
      treeSunAura.style.transform = `translate(-50%, 0) scale(${0.85 + progress * 0.25})`;
    }

    sharedRafId = requestAnimationFrame(renderImpactFrame);
  };

  const startShowcase = () => {
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
        cycleStartTime = performance.now();
        if (!isLoopActive) startShowcase();
      });
    }
    if (impactTreeFrame) {
      impactTreeFrame.addEventListener('click', () => {
        cycleStartTime = performance.now();
        if (!isLoopActive) startShowcase();
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
      const email = btn.dataset.copy || 'info@towardsmybharat.in';
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

});


