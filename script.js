document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Sticky Navigation Header
  const header = document.getElementById('main-header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check immediately on load

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      });
    });
  }

  // 3. Hero Slideshow Carousel
  const slides = document.querySelectorAll('.hero-slider .slide');
  let currentSlideIndex = 0;
  const slideInterval = 5000; // 5 seconds

  const nextSlide = () => {
    if (slides.length > 0) {
      slides[currentSlideIndex].classList.remove('active');
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      slides[currentSlideIndex].classList.add('active');
    }
  };
  setInterval(nextSlide, slideInterval);

  // 4. Scroll Reveal Animations (Intersection Observer)
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, revealObserverOptions);

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // 5. Lightbox Gallery Images Array & Logic
  // Gather all gallery items for navigation
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  let currentGalleryIndex = 0;
  const galleryImagesList = [];

  // Parse all images in gallery grid
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('.gallery-img');
    const overlaySpan = item.querySelector('.gallery-overlay span');
    const caption = overlaySpan ? overlaySpan.innerText : 'Project Renderings';
    
    galleryImagesList.push({
      src: img.src,
      caption: caption
    });

    // Overwrite inline onclick to track current active index
    item.removeAttribute('onclick');
    item.addEventListener('click', () => {
      openGalleryLightbox(index);
    });
  });

  const openGalleryLightbox = (index) => {
    currentGalleryIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  };

  const updateLightboxContent = () => {
    const item = galleryImagesList[currentGalleryIndex];
    if (item && lightboxImg && lightboxCaption) {
      lightboxImg.src = item.src;
      lightboxCaption.innerText = item.caption;
    }
  };

  window.navigateLightbox = (direction) => {
    currentGalleryIndex = (currentGalleryIndex + direction + galleryImagesList.length) % galleryImagesList.length;
    updateLightboxContent();
  };

  window.closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
  };

  // Close lightbox clicking background
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation support for lightbox
  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    }
  });

  // Expose function globally for manual trigger if needed
  window.openLightbox = (src, caption) => {
    if (lightboxImg && lightboxCaption && lightbox) {
      lightboxImg.src = src;
      lightboxCaption.innerText = caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

});

// 6. Floor Plan Tab Swapping
window.switchFloorplan = (tabIndex) => {
  const tabs = document.querySelectorAll('.floorplan-tabs .tab-btn');
  const contents = document.querySelectorAll('.floorplans .floorplan-content');

  // Deactivate all tabs & contents
  tabs.forEach(tab => tab.classList.remove('active'));
  contents.forEach(content => content.classList.remove('active'));

  // Activate chosen tab & content
  if (tabs[tabIndex]) tabs[tabIndex].classList.add('active');
  if (contents[tabIndex]) contents[tabIndex].classList.add('active');
};

// 7. Pop-up Enquiry Form Modal Controller
const enquiryModal = document.getElementById('enquiry-modal');
const popupFormTitle = document.getElementById('popup-form-title');
const popupFormSource = document.getElementById('popup-form-source');

window.openEnquiryModal = (sourceName = 'General Inquiry') => {
  if (enquiryModal && popupFormTitle && popupFormSource) {
    popupFormSource.value = sourceName;
    
    // Customize popup text dynamically based on button clicked
    if (sourceName.includes('Brochure')) {
      popupFormTitle.innerText = 'Download Project Brochure';
    } else if (sourceName.includes('Price')) {
      popupFormTitle.innerText = 'Request Price List & Quotation';
    } else if (sourceName.includes('Floor')) {
      popupFormTitle.innerText = 'Request Floor Plan Layouts';
    } else {
      popupFormTitle.innerText = 'Request Pricing & Offers';
    }

    enquiryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeEnquiryModal = () => {
  if (enquiryModal) {
    enquiryModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
};

// Close modal clicking backdrop
if (enquiryModal) {
  enquiryModal.addEventListener('click', (e) => {
    if (e.target === enquiryModal) {
      closeEnquiryModal();
    }
  });
}

// 8. Lead Capture Form Submission Simulation
const successModal = document.getElementById('success-modal');

window.handleFormSubmit = (event, formType) => {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const data = {};
  
  formData.forEach((value, key) => {
    data[key] = value;
  });

  // Client-side simulation console logging
  console.log(`[Form Submitted] - Type: ${formType}`);
  console.log('Customer Details:', data);

  // Close open Enquiry Modal first
  closeEnquiryModal();

  // Reset original form fields
  form.reset();

  // Display success message
  if (successModal) {
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeSuccessModal = () => {
  if (successModal) {
    successModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
};

if (successModal) {
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      closeSuccessModal();
    }
  });
}
