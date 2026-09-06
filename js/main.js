/**
 * INDUS BUILDCORP - MAIN APPLICATION JAVASCRIPT (2026)
 * Lightweight, zero-dependency, ultra-fast vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Sticky Navigation on Scroll
  const header = document.querySelector('.ibc-header-wrap');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('ibc-header-scrolled');
      } else {
        header.classList.remove('ibc-header-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Navigation Drawer
  const menuToggle = document.querySelector('.ibc-menu-toggle');
  const mobileDrawer = document.querySelector('.ibc-mobile-drawer');

  if (menuToggle && mobileDrawer) {
    const toggleMenu = (open) => {
      const isExpanded = open !== undefined ? open : menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      mobileDrawer.classList.toggle('is-open', isExpanded);
      document.body.style.overflow = isExpanded ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close on link click
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('is-open') && !mobileDrawer.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  }

  // 3. Hero Carousel / Slider
  const heroSlider = document.querySelector('.ibc-hero-slider');
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.ibc-hero-slide');
    const dotsContainer = heroSlider.querySelector('.ibc-hero-dots');
    const prevBtn = heroSlider.querySelector('.ibc-hero-prev');
    const nextBtn = heroSlider.querySelector('.ibc-hero-next');

    if (slides.length > 1) {
      let currentIndex = 0;
      let slideTimer = null;
      const totalSlides = slides.length;

      // Generate indicator dots if container exists and empty
      if (dotsContainer && dotsContainer.children.length === 0) {
        slides.forEach((_, idx) => {
          const dot = document.createElement('button');
          dot.className = `ibc-hero-dot ${idx === 0 ? 'is-active' : ''}`;
          dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
          dot.addEventListener('click', () => {
            goToSlide(idx);
            resetTimer();
          });
          dotsContainer.appendChild(dot);
        });
      }

      const dots = dotsContainer ? dotsContainer.querySelectorAll('.ibc-hero-dot') : [];

      const goToSlide = (index) => {
        slides[currentIndex].classList.remove('is-active');
        if (dots[currentIndex]) dots[currentIndex].classList.remove('is-active');

        currentIndex = (index + totalSlides) % totalSlides;

        slides[currentIndex].classList.add('is-active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('is-active');
      };

      const nextSlide = () => goToSlide(currentIndex + 1);
      const prevSlide = () => goToSlide(currentIndex - 1);

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          nextSlide();
          resetTimer();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          prevSlide();
          resetTimer();
        });
      }

      const startTimer = () => {
        if (!slideTimer) {
          slideTimer = setInterval(nextSlide, 6000);
        }
      };

      const stopTimer = () => {
        if (slideTimer) {
          clearInterval(slideTimer);
          slideTimer = null;
        }
      };

      const resetTimer = () => {
        stopTimer();
        startTimer();
      };

      // Pause on hover
      heroSlider.addEventListener('mouseenter', stopTimer);
      heroSlider.addEventListener('mouseleave', startTimer);

      // Touch swipe support
      let touchStartX = 0;
      let touchEndX = 0;
      heroSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
          nextSlide();
          resetTimer();
        } else if (touchEndX - touchStartX > 50) {
          prevSlide();
          resetTimer();
        }
      }, { passive: true });

      startTimer();
    }
  }

  // 4. Project Category Filtering
  const filterBtns = document.querySelectorAll('.ibc-filter-btn');
  const projectCards = document.querySelectorAll('.ibc-project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter') || '*';

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          if (filter === '*' || category.toLowerCase().includes(filter.toLowerCase().replace('.', ''))) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 20);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  }

  // 5. "Discuss a Project" Interactive Scoping Modal
  const createOrGetProjectModal = () => {
    let modal = document.getElementById('ibcProjectModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'ibcProjectModal';
      modal.className = 'ibc-modal-backdrop';
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-labelledby', 'ibcModalTitle');

      modal.innerHTML = `
        <div class="ibc-modal-dialog">
          <div class="ibc-modal-header">
            <button class="ibc-modal-close" aria-label="Close modal">&times;</button>
            <h3 class="ibc-modal-title" id="ibcModalTitle">
              <i class="fa-solid fa-compass-drafting"></i> Discuss a Project
            </h3>
            <p class="ibc-modal-sub">Tell us about your infrastructure requirements. Our engineering and estimation specialists will respond within 24 business hours.</p>
          </div>
          <div class="ibc-modal-body">
            <form id="ibcProjectScopeForm">
              <span class="ibc-modal-section-label">Select Project Sector</span>
              <div class="ibc-pills-grid">
                <label>
                  <input type="checkbox" name="sector" value="Irrigation & Canals" class="ibc-pill-opt" checked>
                  <span class="ibc-pill-label"><i class="fa-solid fa-water"></i> Irrigation &amp; Canals</span>
                </label>
                <label>
                  <input type="checkbox" name="sector" value="Water & UGD" class="ibc-pill-opt">
                  <span class="ibc-pill-label"><i class="fa-solid fa-faucet-drip"></i> Water &amp; Drainage (UGD/STP)</span>
                </label>
                <label>
                  <input type="checkbox" name="sector" value="Highways & Roads" class="ibc-pill-opt">
                  <span class="ibc-pill-label"><i class="fa-solid fa-road"></i> Highways &amp; CC Roads</span>
                </label>
                <label>
                  <input type="checkbox" name="sector" value="Commercial & Buildings" class="ibc-pill-opt">
                  <span class="ibc-pill-label"><i class="fa-solid fa-building"></i> Commercial &amp; Buildings</span>
                </label>
                <label>
                  <input type="checkbox" name="sector" value="Layout Development" class="ibc-pill-opt">
                  <span class="ibc-pill-label"><i class="fa-solid fa-map-location-dot"></i> Layout Development</span>
                </label>
              </div>

              <div class="ibc-modal-form-grid">
                <div class="ibc-modal-field">
                  <label for="modalScopeScale" style="font-size: 0.8125rem; font-weight: 600; color: #94a3b8;">Estimated Scope / Budget</label>
                  <select id="modalScopeScale" name="budget" class="ibc-modal-select">
                    <option value="Under 5 Crores">Under ₹5 Crores</option>
                    <option value="5 to 25 Crores" selected>₹5 Cr – ₹25 Crores</option>
                    <option value="25 to 50 Crores">₹25 Cr – ₹50 Crores</option>
                    <option value="50 to 100 Crores">₹50 Cr – ₹100 Crores</option>
                    <option value="100+ Crores">₹100+ Crores (Major Infrastructure)</option>
                  </select>
                </div>
                <div class="ibc-modal-field">
                  <label for="modalLocation" style="font-size: 0.8125rem; font-weight: 600; color: #94a3b8;">Project Location / State</label>
                  <input type="text" id="modalLocation" name="location" class="ibc-modal-input" placeholder="e.g. Bengaluru, Karnataka" required>
                </div>
                <div class="ibc-modal-field">
                  <label for="modalClientName" style="font-size: 0.8125rem; font-weight: 600; color: #94a3b8;">Your Full Name *</label>
                  <input type="text" id="modalClientName" name="name" class="ibc-modal-input" placeholder="Name or Organization" required>
                </div>
                <div class="ibc-modal-field">
                  <label for="modalClientPhone" style="font-size: 0.8125rem; font-weight: 600; color: #94a3b8;">Phone / Mobile *</label>
                  <input type="tel" id="modalClientPhone" name="phone" class="ibc-modal-input" placeholder="e.g. 9876543210" required>
                </div>
                <div class="ibc-modal-field ibc-modal-field--full">
                  <label for="modalClientEmail" style="font-size: 0.8125rem; font-weight: 600; color: #94a3b8;">Official Email Address *</label>
                  <input type="email" id="modalClientEmail" name="email" class="ibc-modal-input" placeholder="name@company.com" required>
                </div>
                <div class="ibc-modal-field ibc-modal-field--full">
                  <label for="modalMessage" style="font-size: 0.8125rem; font-weight: 600; color: #94a3b8;">Brief Scope Description</label>
                  <textarea id="modalMessage" name="message" class="ibc-modal-textarea" placeholder="Provide any specifications, timelines, or tender details..."></textarea>
                </div>
              </div>

              <div id="modalFormStatus" style="display: none; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 0.875rem;"></div>

              <div style="display: flex; gap: 12px; align-items: center; justify-content: flex-end;">
                <button type="submit" class="ibc-btn ibc-btn--primary" style="width: 100%; text-align: center;">
                  <i class="fa-solid fa-paper-plane"></i> Submit Technical Inquiry
                </button>
              </div>
            </form>

            <!-- Express Contact Channels -->
            <div class="ibc-modal-express">
              <div class="ibc-modal-express-text">
                <i class="fa-solid fa-headset" style="color: #0284c7; margin-right: 6px;"></i>
                Direct Engineering Desk: <strong>080-41684646</strong>
              </div>
              <div class="ibc-modal-express-actions">
                <a href="tel:08041684646" class="ibc-btn ibc-btn--secondary" style="padding: 8px 16px; font-size: 0.8rem;">
                  <i class="fa-solid fa-phone"></i> Call Now
                </a>
                <a href="https://wa.me/918041684646" target="_blank" rel="noopener" class="ibc-btn ibc-btn--whatsapp" style="padding: 8px 16px; font-size: 0.8rem;">
                  <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    return modal;
  };

  const projectModal = createOrGetProjectModal();
  const modalCloseBtn = projectModal.querySelector('.ibc-modal-close');
  const modalForm = projectModal.querySelector('#ibcProjectScopeForm');
  const modalStatus = projectModal.querySelector('#modalFormStatus');

  const openModal = () => {
    projectModal.classList.add('is-open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = projectModal.querySelector('input[type="text"], input[type="tel"]');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  };

  const closeModal = () => {
    projectModal.classList.remove('is-open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Bind all "Discuss a Project" buttons to open the modal
  document.querySelectorAll('a[href="#discuss"], [data-open-modal="project"], .ibc-btn--discuss').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Modal Form Submission Validation
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = modalForm.querySelector('#modalClientName').value.trim();
      const phoneVal = modalForm.querySelector('#modalClientPhone').value.trim();
      const emailVal = modalForm.querySelector('#modalClientEmail').value.trim();

      if (!nameVal || !phoneVal || !emailVal) {
        modalStatus.style.display = 'block';
        modalStatus.style.backgroundColor = '#fef2f2';
        modalStatus.style.color = '#b91c1c';
        modalStatus.style.border = '1px solid #fecaca';
        modalStatus.innerHTML = 'Please provide your Name, Phone Number, and Email Address.';
        return;
      }

      modalStatus.style.display = 'block';
      modalStatus.style.backgroundColor = '#ecfdf5';
      modalStatus.style.color = '#065f46';
      modalStatus.style.border = '1px solid #a7f3d0';
      modalStatus.innerHTML = `
        <strong><i class="fa-solid fa-circle-check"></i> Inquiry Recorded Successfully!</strong>
        <p style="margin: 4px 0 0; font-size: 0.85rem;">Thank you, ${nameVal}. Your technical inquiry has been submitted to the Indus Buildcorp engineering desk. We will review your scope and get in touch within 24 hours.</p>
      `;

      modalForm.reset();
      setTimeout(() => {
        closeModal();
        modalStatus.style.display = 'none';
      }, 3500);
    });
  }

  // 6. Contact Page Form Validation & Submission
  const contactForms = document.querySelectorAll('.ibc-contact-form, #contact-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = form.querySelector('[name="name"], #name');
      const emailInput = form.querySelector('[name="mail"], [name="email"], #mail');
      const phoneInput = form.querySelector('[name="tel-number"], [name="phone"], #tel-number');
      const messageInput = form.querySelector('[name="comment"], [name="message"], #comment');
      const statusBox = form.querySelector('.ibc-form-status, #msg');

      const validateField = (input, condition) => {
        if (!input) return true;
        if (!condition) {
          input.classList.add('is-invalid');
          isValid = false;
          return false;
        } else {
          input.classList.remove('is-invalid');
          return true;
        }
      };

      if (nameInput) validateField(nameInput, nameInput.value.trim().length >= 2);
      if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField(emailInput, emailRegex.test(emailInput.value.trim()));
      }
      if (phoneInput) {
        const phoneRegex = /^[\d\s+\-()]{7,16}$/;
        validateField(phoneInput, phoneRegex.test(phoneInput.value.trim()));
      }
      if (messageInput) validateField(messageInput, messageInput.value.trim().length >= 5);

      if (isValid) {
        if (statusBox) {
          statusBox.className = 'ibc-form-status ibc-form-status--success';
          statusBox.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="fas fa-check-circle" style="font-size: 1.25rem;"></i>
              <div>
                <strong>Thank you for contacting Indus Buildcorp.</strong>
                <p style="margin: 4px 0 0; font-size: 0.875rem; opacity: 0.9;">Your project inquiry has been recorded. Our engineering & estimating team will reach out to you within 24 business hours.</p>
              </div>
            </div>
          `;
          statusBox.style.display = 'block';
        }
        form.reset();
        if (statusBox) statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        if (statusBox) {
          statusBox.className = 'ibc-form-status';
          statusBox.style.display = 'block';
          statusBox.style.backgroundColor = '#fef2f2';
          statusBox.style.color = '#b91c1c';
          statusBox.style.border = '1px solid #fecaca';
          statusBox.innerHTML = 'Please check the highlighted fields above and ensure all required details are provided correctly.';
        }
      }
    });

    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
      });
    });
  });

  // 7. Image Lightbox for Project Detail Pages
  const galleryThumbs = document.querySelectorAll('.ibc-project-gallery-thumb img, .ibc-project-gallery img, .ibc-gallery-item img');
  if (galleryThumbs.length > 0) {
    let modal = document.getElementById('ibc-lightbox-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'ibc-lightbox-modal';
      modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(7, 10, 16, 0.92); backdrop-filter: blur(8px);
        z-index: 99999; display: none; align-items: center; justify-content: center;
        padding: 24px; cursor: pointer;
      `;
      modal.innerHTML = `
        <div style="position: relative; max-width: 90vw; max-height: 90vh;">
          <img id="ibc-lightbox-img" style="max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: 8px; box-shadow: 0 25px 50px rgba(0,0,0,0.5);">
          <button style="position: absolute; top: -45px; right: 0; background: none; border: none; color: #fff; font-size: 32px; cursor: pointer;">&times;</button>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    const lightboxImg = document.getElementById('ibc-lightbox-img');
    galleryThumbs.forEach(thumb => {
      thumb.style.cursor = 'zoom-in';
      thumb.addEventListener('click', (e) => {
        e.stopPropagation();
        if (lightboxImg && modal) {
          lightboxImg.src = thumb.src;
          lightboxImg.alt = thumb.alt || 'Project photo';
          modal.style.display = 'flex';
        }
      });
    });
  }

  // 8. Current Year Auto-updater in Footers
  const yearEls = document.querySelectorAll('.ibc-current-year, #ibcYear');
  const currentYear = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = currentYear;
  });
});
