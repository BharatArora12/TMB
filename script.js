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

  const testimonialCarousel = document.querySelector('.testimonial-carousel');
  if (testimonialCarousel) {
    const testimonialSlides = Array.from(testimonialCarousel.querySelectorAll('.testimonial-slide'));
    const testimonialIndicators = Array.from(testimonialCarousel.querySelectorAll('.testimonial-indicator'));
    const testimonialArrows = Array.from(testimonialCarousel.querySelectorAll('.testimonial-arrow'));
    let activeTestimonial = testimonialSlides.findIndex((slide) => !slide.hidden);

    if (testimonialSlides.length > 0 && testimonialIndicators.length === testimonialSlides.length) {
      const showTestimonial = (index) => {
        activeTestimonial = (index + testimonialSlides.length) % testimonialSlides.length;

        testimonialSlides.forEach((slide, slideIndex) => {
          const isActive = slideIndex === activeTestimonial;
          slide.hidden = !isActive;
          slide.setAttribute('aria-label', `${slideIndex + 1} of ${testimonialSlides.length}`);
        });

        testimonialIndicators.forEach((indicator, indicatorIndex) => {
          const isActive = indicatorIndex === activeTestimonial;
          indicator.classList.toggle('is-active', isActive);
          indicator.setAttribute('aria-pressed', String(isActive));
        });
      };

      testimonialArrows.forEach((arrow) => {
        arrow.addEventListener('click', () => {
          showTestimonial(activeTestimonial + Number(arrow.dataset.testimonialDirection));
        });
      });

      testimonialIndicators.forEach((indicator) => {
        indicator.addEventListener('click', () => {
          showTestimonial(Number(indicator.dataset.testimonialIndex));
        });
      });

      testimonialCarousel.addEventListener('keydown', (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;

        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          showTestimonial(activeTestimonial - 1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          showTestimonial(activeTestimonial + 1);
        }
      });
    }
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

  // =========================================================================
  // 3D SLIDER & POPUP MODAL CONTROLLER (WHAT WORK WE DO)
  // =========================================================================
  const workSlider = document.getElementById('work3dSlider');
  const workDetailModal = document.getElementById('workDetailModal');
  const workModalClose = document.getElementById('workModalClose');
  const workModalContent = document.getElementById('workModalContent');

  // Comprehensive Detailed Data for Each Initiative
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
    const cards = Array.from(workSlider.querySelectorAll('.work-3d-card'));
    const tabs = Array.from(document.querySelectorAll('#workSliderTabs .work-slider-tab'));
    const prevBtn = document.getElementById('workSliderPrev');
    const nextBtn = document.getElementById('workSliderNext');
    const counterCurrent = document.getElementById('workCounterCurrent');
    let currentIndex = 0;
    const totalCards = cards.length;
    let autoplayTimer = null;
    let slideDirection = 1; // 1 = forward, -1 = backward (bounce-back mode)

    // Open Detail Modal
    const openDetailModal = (index) => {
      const data = initiativesData[index];
      if (!data || !workDetailModal || !workModalContent) return;

      stopAutoplay();

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

      workDetailModal.classList.add('is-open');
      workDetailModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Inner close button
      const innerClose = document.getElementById('workModalInnerClose');
      if (innerClose) {
        innerClose.addEventListener('click', closeDetailModal);
      }

      const ctaBtn = workModalContent.querySelector('.work-modal-cta-btn');
      if (ctaBtn) {
        ctaBtn.addEventListener('click', closeDetailModal);
      }
    };

    // Close Detail Modal
    const closeDetailModal = () => {
      if (!workDetailModal) return;
      workDetailModal.classList.remove('is-open');
      workDetailModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      startAutoplay();
    };

    if (workModalClose) {
      workModalClose.addEventListener('click', closeDetailModal);
    }

    if (workDetailModal) {
      workDetailModal.addEventListener('click', (e) => {
        if (e.target === workDetailModal) {
          closeDetailModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && workDetailModal && workDetailModal.classList.contains('is-open')) {
        closeDetailModal();
      }
    });

    const updateSlider = (index) => {
      // Clamp index between 0 and totalCards - 1 (stops at ends, no abrupt jump)
      currentIndex = Math.max(0, Math.min(totalCards - 1, index));
      const isMobile = window.innerWidth < 640;

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
          const tx = isMobile ? '46%' : 'min(58%, 270px)';
          const rotY = isMobile ? -18 : -24;
          const tz = isMobile ? '-85px' : '-130px';
          card.style.transform = `translateX(${tx}) translateZ(${tz}) scale(0.86) rotateY(${rotY}deg)`;
          card.style.opacity = '0.75';
          card.style.filter = 'blur(0.3px)';
          card.style.zIndex = '5';
          card.style.pointerEvents = 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else if (diff === -1) {
          // Immediate Left Card
          const tx = isMobile ? '-46%' : 'max(-58%, -270px)';
          const rotY = isMobile ? 18 : 24;
          const tz = isMobile ? '-85px' : '-130px';
          card.style.transform = `translateX(${tx}) translateZ(${tz}) scale(0.86) rotateY(${rotY}deg)`;
          card.style.opacity = '0.75';
          card.style.filter = 'blur(0.3px)';
          card.style.zIndex = '5';
          card.style.pointerEvents = 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else if (diff === 2) {
          // Far Right
          const tx = isMobile ? '84%' : 'min(105%, 480px)';
          const rotY = isMobile ? -32 : -40;
          const tz = isMobile ? '-160px' : '-250px';
          card.style.transform = `translateX(${tx}) translateZ(${tz}) scale(0.72) rotateY(${rotY}deg)`;
          card.style.opacity = '0.35';
          card.style.filter = 'blur(1px)';
          card.style.zIndex = '2';
          card.style.pointerEvents = 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else if (diff === -2) {
          // Far Left
          const tx = isMobile ? '-84%' : 'max(-105%, -480px)';
          const rotY = isMobile ? 32 : 40;
          const tz = isMobile ? '-160px' : '-250px';
          card.style.transform = `translateX(${tx}) translateZ(${tz}) scale(0.72) rotateY(${rotY}deg)`;
          card.style.opacity = '0.35';
          card.style.filter = 'blur(1px)';
          card.style.zIndex = '2';
          card.style.pointerEvents = 'auto';
          card.setAttribute('aria-hidden', 'true');
        } else if (diff > 2) {
          // Beyond right
          card.style.transform = 'translateX(130%) translateZ(-320px) scale(0.6) rotateY(-50deg)';
          card.style.opacity = '0';
          card.style.zIndex = '0';
          card.style.pointerEvents = 'none';
          card.setAttribute('aria-hidden', 'true');
        } else {
          // Beyond left
          card.style.transform = 'translateX(-130%) translateZ(-320px) scale(0.6) rotateY(50deg)';
          card.style.opacity = '0';
          card.style.zIndex = '0';
          card.style.pointerEvents = 'none';
          card.setAttribute('aria-hidden', 'true');
        }
      });

      // Update Navigation Buttons (Disable when at ends)
      if (prevBtn) {
        prevBtn.disabled = (currentIndex === 0);
      }
      if (nextBtn) {
        nextBtn.disabled = (currentIndex === totalCards - 1);
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

    // Arrow button controls (Bounded)
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex > 0) {
          slideDirection = -1;
          updateSlider(currentIndex - 1);
          restartAutoplay();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex < totalCards - 1) {
          slideDirection = 1;
          updateSlider(currentIndex + 1);
          restartAutoplay();
        }
      });
    }

    // Keyboard navigation when focused on slider container
    workSlider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
          slideDirection = -1;
          updateSlider(currentIndex - 1);
          restartAutoplay();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < totalCards - 1) {
          slideDirection = 1;
          updateSlider(currentIndex + 1);
          restartAutoplay();
        }
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
        if (diffX > 0 && currentIndex > 0) {
          slideDirection = -1;
          updateSlider(currentIndex - 1);
        } else if (diffX < 0 && currentIndex < totalCards - 1) {
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
        if (diffX > 0 && currentIndex > 0) {
          slideDirection = -1;
          updateSlider(currentIndex - 1);
        } else if (diffX < 0 && currentIndex < totalCards - 1) {
          slideDirection = 1;
          updateSlider(currentIndex + 1);
        }
      }
      restartAutoplay();
    });

    // Autoplay with Bounce-Back (Stops at end and slides backward only)
    const startAutoplay = () => {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => {
        // Reverse direction when reaching bounds
        if (currentIndex >= totalCards - 1) {
          slideDirection = -1; // Bounce backward
        } else if (currentIndex <= 0) {
          slideDirection = 1;  // Forward
        }
        updateSlider(currentIndex + slideDirection);
      }, 4500);
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

    // Pause on hover over slider or tabs
    workSlider.addEventListener('mouseenter', stopAutoplay);
    workSlider.addEventListener('mouseleave', startAutoplay);
    workSlider.addEventListener('focusin', stopAutoplay);
    workSlider.addEventListener('focusout', startAutoplay);

    // Responsive update on window resize
    window.addEventListener('resize', () => {
      updateSlider(currentIndex);
    });

    // Initial render & start autoplay
    updateSlider(0);
    startAutoplay();
  }

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

  // 3D Card Interactive Tilt Effect
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    let animationFrameId = null;

    card.addEventListener('mousemove', (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768) {
        return;
      }
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation degree (max 8 degrees)
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
      });
    });

    card.addEventListener('mouseleave', () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
});
