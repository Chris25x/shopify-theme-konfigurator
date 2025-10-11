/**
 * Product Media Gallery with Grid Layout
 * Handles main image display and thumbnail navigation
 */
class ProductMediaGallery {
  constructor(container) {
    this.container = container;
    this.mainImages = container.querySelectorAll('.product__media-item-main');
    this.thumbnails = container.querySelectorAll('.product-thumb');
    this.currentIndex = 0;
    this.thumbStartIndex = 0;
    this.visibleThumbs = 3;
    
    this.init();
  }
  
  init() {
    if (this.mainImages.length === 0) return;
    
    // Set first image as active
    this.showSlide(0);
    
    // Add thumbnail click listeners
    this.thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => this.showSlide(index));
    });
    
    // Add navigation button listeners
    this.addNavigationListeners();
    
    // Update thumbnail visibility
    this.updateThumbnailVisibility();
    
    // Update navigation buttons
    this.updateNavigationButtons();
    
    // Listen for variant changes
    this.listenForVariantChanges();
    
    // Add lazy loading
    this.addLazyLoading();
  }
  
  showSlide(index) {
    if (index < 0 || index >= this.mainImages.length) return;
    
    // Hide all main images
    this.mainImages.forEach(item => {
      item.classList.remove('active');
    });
    
    // Show current main image
    this.mainImages[index].classList.add('active');
    
    // Update thumbnails
    this.thumbnails.forEach(thumb => {
      thumb.classList.remove('is-active');
    });
    if (this.thumbnails[index]) {
      this.thumbnails[index].classList.add('is-active');
    }
    
    this.currentIndex = index;
    
    // Update thumbnail visibility if needed
    this.updateThumbnailVisibility();
  }
  
  addNavigationListeners() {
    const prevBtn = this.container.querySelector('.thumb-nav--prev');
    const nextBtn = this.container.querySelector('.thumb-nav--next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.scrollThumbs('prev'));
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.scrollThumbs('next'));
    }
  }
  
  scrollThumbs(direction) {
    if (direction === 'prev') {
      this.thumbStartIndex = Math.max(0, this.thumbStartIndex - 1);
    } else {
      this.thumbStartIndex = Math.min(
        this.thumbnails.length - this.visibleThumbs,
        this.thumbStartIndex + 1
      );
    }
    
    this.updateThumbnailVisibility();
    this.updateNavigationButtons();
  }
  
  updateThumbnailVisibility() {
    this.thumbnails.forEach((thumb, index) => {
      if (index >= this.thumbStartIndex && index < this.thumbStartIndex + this.visibleThumbs) {
        thumb.classList.remove('thumb-hidden');
      } else {
        thumb.classList.add('thumb-hidden');
      }
    });
  }
  
  updateNavigationButtons() {
    const prevBtn = this.container.querySelector('.thumb-nav--prev');
    const nextBtn = this.container.querySelector('.thumb-nav--next');
    
    if (prevBtn) {
      prevBtn.disabled = this.thumbStartIndex === 0;
    }
    
    if (nextBtn) {
      nextBtn.disabled = this.thumbStartIndex >= this.thumbnails.length - this.visibleThumbs;
    }
  }
  
  listenForVariantChanges() {
    // Listen for variant selector changes
    const variantSelectors = document.querySelectorAll('input[name*="-"][type="radio"]');
    variantSelectors.forEach(selector => {
      selector.addEventListener('change', () => {
        this.updateForVariant();
      });
    });
    
    // Listen for variant picker changes
    const variantPicker = document.querySelector('variant-selects');
    if (variantPicker) {
      variantPicker.addEventListener('change', () => {
        this.updateForVariant();
      });
    }
    
    // Also listen for URL parameter changes (for variant URLs)
    window.addEventListener('popstate', () => {
      this.updateForVariant();
    });
    
    // Listen for form changes
    const productForm = document.querySelector('form[action*="/cart/add"]');
    if (productForm) {
      productForm.addEventListener('change', () => {
        this.updateForVariant();
      });
    }
  }
  
  updateForVariant() {
    // Get current variant from URL or form
    const urlParams = new URLSearchParams(window.location.search);
    const variantId = urlParams.get('variant') || this.getSelectedVariantId();
    
    if (variantId) {
      // First, try to get variant data from the script tag
      const variantScript = document.querySelector('script[type="application/json"][data-selected-variant]');
      let variantData = null;
      if (variantScript) {
        try {
          variantData = JSON.parse(variantScript.textContent);
        } catch (e) {
          console.warn('Could not parse variant data:', e);
        }
      }
      
      // If we have variant data and it has featured_media, use that
      if (variantData && variantData.featured_media) {
        const mediaId = variantData.featured_media.id;
        const variantMedia = this.container.querySelector(`[data-media-id*="${mediaId}"]`);
        if (variantMedia) {
          const mediaIndex = Array.from(this.mainImages).indexOf(variantMedia);
          if (mediaIndex !== -1) {
            this.showSlide(mediaIndex);
            return;
          }
        }
      }
      
      // Try to find media by variant ID in data attributes
      const allMedia = this.container.querySelectorAll('.product__media-item-main');
      for (let i = 0; i < allMedia.length; i++) {
        const mediaElement = allMedia[i];
        if (mediaElement.dataset.variantId === variantId || 
            mediaElement.querySelector(`[data-variant-id="${variantId}"]`)) {
          this.showSlide(i);
          return;
        }
      }
      
      // Try to find variant-specific media by checking if media is associated with any variant
      for (let i = 0; i < allMedia.length; i++) {
        const mediaElement = allMedia[i];
        if (mediaElement.dataset.variantMedia === 'true') {
          // Check if this media belongs to the current variant
          const mediaId = mediaElement.dataset.mediaId.split('-').pop();
          if (variantData && variantData.featured_media && variantData.featured_media.id == mediaId) {
            this.showSlide(i);
            return;
          }
        }
      }
    }
    
    // Fallback: show first image if no variant-specific image found
    if (this.mainImages.length > 0) {
      this.showSlide(0);
    }
  }
  
  getSelectedVariantId() {
    const variantInput = document.querySelector('[name="id"]:checked, [name="id"]');
    return variantInput ? variantInput.value : null;
  }
  
  addLazyLoading() {
    // Add lazy loading for images
    const images = this.container.querySelectorAll('img');
    images.forEach(img => {
      if (img.complete) {
        img.setAttribute('data-loaded', 'true');
      } else {
        img.addEventListener('load', () => {
          img.setAttribute('data-loaded', 'true');
        });
      }
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const galleryContainer = document.querySelector('.product-gallery');
  if (galleryContainer) {
    new ProductMediaGallery(galleryContainer);
  }

  // Initialize description toggles
  const descriptionToggles = document.querySelectorAll('.description-toggle');
  descriptionToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const content = document.getElementById(this.id.replace('toggle', 'content'));
      const isActive = this.classList.contains('active');
      
      if (isActive) {
        this.classList.remove('active');
        content.classList.remove('active');
      } else {
        this.classList.add('active');
        content.classList.add('active');
      }
    });
  });
});