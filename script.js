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

  // Testimonials Side-Scroll Carousel
  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialPrev = document.getElementById('testimonialPrev');
  const testimonialNext = document.getElementById('testimonialNext');
  const testimonialIndicators = Array.from(document.querySelectorAll('.testimonial-indicator'));

  if (testimonialTrack && testimonialPrev && testimonialNext && testimonialIndicators.length > 0) {
    const slides = Array.from(testimonialTrack.querySelectorAll('.testimonial-slide'));
    let activeIndex = 0;

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

    testimonialPrev.addEventListener('click', () => {
      scrollToSlide(activeIndex - 1);
    });

    testimonialNext.addEventListener('click', () => {
      scrollToSlide(activeIndex + 1);
    });

    testimonialIndicators.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetIndex = Number(dot.dataset.slideIndex);
        if (!isNaN(targetIndex)) {
          scrollToSlide(targetIndex);
        }
      });
    });

    // Sync indicators on native touch swipe / horizontal scroll
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

    // Keyboard arrow navigation
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

  const udyamCredentialButton = document.querySelector('.hero-credential');
  const udyamCertModal = document.getElementById('udyamCertModal');
  const closeCertificateButtons = document.querySelectorAll('[data-close-certificate]');

  const toggleUdyamCert = (shouldOpen) => {
    if (!udyamCertModal) return;
    udyamCertModal.classList.toggle('is-open', shouldOpen);
    udyamCertModal.setAttribute('aria-hidden', String(!shouldOpen));
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  if (udyamCredentialButton && udyamCertModal) {
    udyamCredentialButton.addEventListener('click', () => toggleUdyamCert(true));
    udyamCredentialButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleUdyamCert(true);
      }
    });
  }

  closeCertificateButtons.forEach((button) => {
    button.addEventListener('click', () => toggleUdyamCert(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && udyamCertModal && udyamCertModal.classList.contains('is-open')) {
      toggleUdyamCert(false);
    }
  });

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

  const impactCounters = Array.from(document.querySelectorAll('[data-count-up]'));
  const formatCounter = (value, compact) => {
    if (compact && value >= 1000) return `${Math.floor(value / 1000)}k`;
    return Math.floor(value).toLocaleString();
  };

  const animateImpactCounters = () => {
    const duration = 1600;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    impactCounters.forEach((counter) => {
      const target = Number(counter.dataset.countUp);
      const suffix = counter.dataset.countSuffix || '';
      const compact = counter.dataset.countFormat === 'compact';

      if (prefersReducedMotion) {
        counter.textContent = `${formatCounter(target, compact)}${suffix}`;
        return;
      }

      const startTime = performance.now();
      const updateCounter = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        const currentValue = Math.floor(target * easedProgress);
        counter.textContent = `${formatCounter(currentValue, compact)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = `${formatCounter(target, compact)}${suffix}`;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const impactMetrics = document.querySelector('.impact-metrics-section');
  if (impactMetrics && impactCounters.length > 0) {
    impactCounters.forEach((counter) => {
      const compact = counter.dataset.countFormat === 'compact';
      counter.textContent = `0${counter.dataset.countSuffix || ''}`;
      if (compact) counter.textContent = '0';
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      animateImpactCounters();
    } else {
      const impactObserver = new IntersectionObserver((entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          animateImpactCounters();
        }
      }, { threshold: 0.2 });

      impactObserver.observe(impactMetrics);
    }
  }

});
