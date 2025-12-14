class CartDrawer extends HTMLElement {
  constructor() {
    super();

    // Prüfe, ob wir auf der Konfigurator-Seite sind und ob es ein mobiles Gerät ist
    this.shouldRedirectToCartPage = this.isKonfiguratorPageOnMobile();
    
    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }

  isKonfiguratorPageOnMobile() {
    // Prüfe, ob wir auf der Konfigurator-Seite sind
    const isKonfiguratorPage = window.location.pathname.includes('/pages/konfigurator') || 
                                document.body.classList.contains('konfigurator-page');
    
    if (!isKonfiguratorPage) return false;
    
    // Prüfe, ob es ein mobiles Touch-Gerät ist
    const isTouchDevice = ('ontouchstart' in window) || 
                          (navigator.maxTouchPoints > 0) || 
                          (navigator.msMaxTouchPoints > 0) ||
                          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    return isTouchDevice;
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    if (!cartLink) return;

    // Wenn wir auf der Konfigurator-Seite mit mobilem Gerät sind, leite direkt zur Cart-Seite weiter
    if (this.shouldRedirectToCartPage) {
      cartLink.setAttribute('href', '/cart');
      cartLink.removeAttribute('role');
      cartLink.removeAttribute('aria-haspopup');
      return; // Keine Event-Listener für Drawer-Öffnung hinzufügen
    }

    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    // Wenn wir auf der Konfigurator-Seite mit mobilem Gerät sind, leite direkt zur Cart-Seite weiter
    if (this.shouldRedirectToCartPage) {
      window.location.href = '/cart';
      return;
    }
    
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
    
    // Stelle sicher, dass visibility nicht auf hidden gesetzt ist
    this.style.visibility = '';
    
    // here the animation doesn't seem to always get triggered. A timeout seem to help
    setTimeout(() => {
      this.classList.add('animate', 'active');
    });

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = this.classList.contains('is-empty')
          ? this.querySelector('.drawer__inner-empty')
          : document.getElementById('CartDrawer');
        const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true }
    );

    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    
    // Warte auf das Ende der Transition, bevor overflow-hidden entfernt wird
    this.addEventListener(
      'transitionend',
      () => {
        document.body.classList.remove('overflow-hidden');
        // Stelle sicher, dass der Drawer auch nach der Transition ausgeblendet bleibt
        if (!this.classList.contains('active')) {
          this.style.visibility = 'hidden';
        }
      },
      { once: true }
    );
    
    // Fallback: Entferne overflow-hidden auch nach kurzer Zeit, falls transitionend nicht feuert
    setTimeout(() => {
    document.body.classList.remove('overflow-hidden');
      if (!this.classList.contains('active')) {
        this.style.visibility = 'hidden';
      }
    }, 300);
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    // Entferne is-empty Klasse vom cart-drawer Element und drawer__inner
    this.classList.remove('is-empty');
    const drawerInner = this.querySelector('.drawer__inner');
    if (drawerInner) {
      drawerInner.classList.remove('is-empty');
    }
    
    // Verstecke drawer__inner-empty wenn vorhanden
    const drawerInnerEmpty = this.querySelector('.drawer__inner-empty');
    if (drawerInnerEmpty) {
      drawerInnerEmpty.style.display = 'none';
    }
    
    // Entferne is-empty Klasse von cart-drawer-items
    const cartDrawerItems = this.querySelector('cart-drawer-items');
    if (cartDrawerItems) {
      cartDrawerItems.classList.remove('is-empty');
    }
    
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      if (section.id === 'cart-icon-bubble') {
        // Spezielle Behandlung für cart-icon-bubble: Aktualisiere den Inhalt des Links
        const cartIconElement = document.getElementById('cart-icon-bubble');
        // Versuche sowohl section.id als auch section.section zu verwenden
        const sectionKey = section.section || section.id;
        if (cartIconElement && parsedState.sections && parsedState.sections[sectionKey]) {
          const sectionHTML = parsedState.sections[sectionKey];
          
          try {
            // Parse den HTML-String
            const parsedHTML = new DOMParser().parseFromString(sectionHTML, 'text/html');
            
            // Versuche .shopify-section zu finden (Standard-Format)
            let content = parsedHTML.querySelector('.shopify-section');
            if (content) {
              cartIconElement.innerHTML = content.innerHTML;
              return;
            }
            
            // Versuche div mit shopify-section id zu finden
            content = parsedHTML.querySelector('div[id*="shopify-section-cart-icon-bubble"]');
            if (content) {
              cartIconElement.innerHTML = content.innerHTML;
              return;
            }
            
            // Fallback: Verwende den Body-Inhalt direkt
            if (parsedHTML.body && parsedHTML.body.innerHTML.trim()) {
              cartIconElement.innerHTML = parsedHTML.body.innerHTML;
            } else {
              // Letzter Fallback: Verwende den HTML-String direkt (falls er bereits sauber ist)
              cartIconElement.innerHTML = sectionHTML.trim();
            }
          } catch (error) {
            console.error('Fehler beim Parsen der cart-icon-bubble Section:', error, sectionHTML);
            // Fallback: Verwende den HTML-String direkt
            cartIconElement.innerHTML = sectionHTML;
          }
        }
      } else {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);

      if (!sectionElement) return;
      sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
      }
    });

    setTimeout(() => {
      // Wenn wir auf der Konfigurator-Seite mit mobilem Gerät sind, leite direkt zur Cart-Seite weiter
      if (this.shouldRedirectToCartPage) {
        window.location.href = '/cart';
        return;
      }
      
      this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
      this.open();
    });
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
    ];
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);
