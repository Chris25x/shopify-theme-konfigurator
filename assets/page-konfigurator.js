// Konfigurator JavaScript - Extracted from page-konfigurator.liquid

// CSS-Konstanten für bessere Wartbarkeit - Angepasst an Shop-Design
const CSS_CONSTANTS = {
  COLORS: {
    ERROR_BG: '#ffeaea',
    ERROR_TEXT: '#D93025',
    WARNING_BG: '#fff3cd',
    WARNING_TEXT: '#856404',
    WARNING_BORDER: '#ffeaa7',
    PRIMARY: '#005A9C',
    SUCCESS_BG: '#d4edda',
    SUCCESS_TEXT: '#155724',
    SUCCESS_BORDER: '#c3e6cb',
    INFO_BG: '#d1ecf1',
    INFO_TEXT: '#0c5460',
    INFO_BORDER: '#bee5eb',
    OVERLAY_BG: 'rgba(0, 0, 0, 0.5)',
    TEXT_PRIMARY: '#111827',
    TEXT_SECONDARY: '#6b7280'
  },
  STYLES: {
    BORDER_RADIUS: '8px',
    PADDING: '16px 24px',
    BOX_SHADOW: '0 10px 25px rgba(0, 0, 0, 0.15)',
    TRANSITION: 'all 0.3s ease',
    FONT_FAMILY: 'var(--font-body-family)',
    BUTTON_PADDING: '12px 24px',
    BUTTON_BORDER_RADIUS: '6px'
  }
};

let rowCounter = 1;
    const maxRows = 5;
    const maxUnitsPerRow = 12;
    let totalUnits = 0;  // Variable zur Verfolgung der verbrauchten Einheiten
    let currentPage = 1;
    let selectedVerdrahtung = ''; // Neue Variable für die Verdrahtungsauswahl
    let selectedMontageart = ''; // Neue Variable für die Montageart-Auswahl
    let isFirstRowAtBottom = false; // Neue Variable für die Position der ersten Reihe
    let sectionAOrder = [];

    // Utility-Funktionen für bessere Wartbarkeit
    function createStyledElement(tag, styles = {}) {
      const element = document.createElement(tag);
      Object.assign(element.style, styles);
      return element;
    }

    // Einheitliches Dialog-System für den Konfigurator
    function showDialog(options = {}) {
      const {
        type = 'info', // 'info', 'warning', 'error', 'success'
        title = 'Hinweis',
        message = '',
        showCancel = false,
        confirmText = 'OK',
        cancelText = 'Abbrechen',
        onConfirm = null,
        onCancel = null
      } = options;

      // Entferne bestehende Dialoge
      const existingDialog = document.querySelector('.konfigurator-dialog');
      if (existingDialog) {
        existingDialog.remove();
      }

      // Erstelle Overlay
      const overlay = createStyledElement('div', {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: CSS_CONSTANTS.COLORS.OVERLAY_BG,
        zIndex: '9999',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: CSS_CONSTANTS.STYLES.FONT_FAMILY
      });

      // Erstelle Dialog-Container
      const dialog = createStyledElement('div', {
        backgroundColor: '#fff',
        borderRadius: CSS_CONSTANTS.STYLES.BORDER_RADIUS,
        boxShadow: CSS_CONSTANTS.STYLES.BOX_SHADOW,
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative',
        animation: 'dialogSlideIn 0.3s ease-out'
      });
      dialog.className = 'konfigurator-dialog';

      // Bestimme Farben basierend auf Typ
      let bgColor, textColor, borderColor, iconColor;
      switch (type) {
        case 'error':
          bgColor = CSS_CONSTANTS.COLORS.ERROR_BG;
          textColor = CSS_CONSTANTS.COLORS.ERROR_TEXT;
          borderColor = CSS_CONSTANTS.COLORS.ERROR_TEXT;
          iconColor = CSS_CONSTANTS.COLORS.ERROR_TEXT;
          break;
        case 'warning':
          bgColor = CSS_CONSTANTS.COLORS.WARNING_BG;
          textColor = CSS_CONSTANTS.COLORS.WARNING_TEXT;
          borderColor = CSS_CONSTANTS.COLORS.WARNING_BORDER;
          iconColor = CSS_CONSTANTS.COLORS.WARNING_TEXT;
          break;
        case 'success':
          bgColor = CSS_CONSTANTS.COLORS.SUCCESS_BG;
          textColor = CSS_CONSTANTS.COLORS.SUCCESS_TEXT;
          borderColor = CSS_CONSTANTS.COLORS.SUCCESS_BORDER;
          iconColor = CSS_CONSTANTS.COLORS.SUCCESS_TEXT;
          break;
        default: // info
          bgColor = CSS_CONSTANTS.COLORS.INFO_BG;
          textColor = CSS_CONSTANTS.COLORS.INFO_TEXT;
          borderColor = CSS_CONSTANTS.COLORS.INFO_BORDER;
          iconColor = CSS_CONSTANTS.COLORS.INFO_TEXT;
      }

      // Erstelle Header
      const header = createStyledElement('div', {
        padding: '20px 24px 16px',
        borderBottom: `1px solid ${borderColor}`,
        backgroundColor: bgColor,
        borderRadius: `${CSS_CONSTANTS.STYLES.BORDER_RADIUS} ${CSS_CONSTANTS.STYLES.BORDER_RADIUS} 0 0`
      });

      const titleElement = createStyledElement('h3', {
        margin: '0',
        fontSize: '18px',
        fontWeight: '600',
        color: textColor,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      });

      // Icon basierend auf Typ
      const icon = createStyledElement('span', {
        fontSize: '20px',
        color: iconColor
      });
      switch (type) {
        case 'error':
          icon.textContent = '⚠️';
          break;
        case 'warning':
          icon.textContent = '⚠️';
          break;
        case 'success':
          icon.textContent = '✅';
          break;
        default:
          icon.textContent = 'ℹ️';
      }

      titleElement.appendChild(icon);
      titleElement.appendChild(document.createTextNode(title));
      header.appendChild(titleElement);

      // Erstelle Content
      const content = createStyledElement('div', {
        padding: '20px 24px',
        color: CSS_CONSTANTS.COLORS.TEXT_PRIMARY,
        lineHeight: '1.5'
      });

      const messageElement = createStyledElement('div', {
        fontSize: '16px',
        marginBottom: '0'
      });
      messageElement.innerHTML = message;
      content.appendChild(messageElement);

      // Erstelle Footer mit Buttons
      const footer = createStyledElement('div', {
        padding: '16px 24px 20px',
        display: 'flex',
        justifyContent: showCancel ? 'space-between' : 'center',
        gap: '12px',
        borderTop: '1px solid #e5e7eb'
      });

      const confirmButton = createStyledElement('button', {
        backgroundColor: CSS_CONSTANTS.COLORS.PRIMARY,
        color: '#fff',
        border: 'none',
        borderRadius: CSS_CONSTANTS.STYLES.BUTTON_BORDER_RADIUS,
        padding: CSS_CONSTANTS.STYLES.BUTTON_PADDING,
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: CSS_CONSTANTS.STYLES.TRANSITION,
        minWidth: '120px'
      });
      confirmButton.textContent = confirmText;

      confirmButton.addEventListener('mouseenter', () => {
        confirmButton.style.backgroundColor = '#00467a';
        confirmButton.style.transform = 'translateY(-1px)';
      });

      confirmButton.addEventListener('mouseleave', () => {
        confirmButton.style.backgroundColor = CSS_CONSTANTS.COLORS.PRIMARY;
        confirmButton.style.transform = 'translateY(0)';
      });

      confirmButton.addEventListener('click', () => {
        if (onConfirm) onConfirm();
        overlay.remove();
        document.body.style.overflow = '';
      });

      footer.appendChild(confirmButton);

      if (showCancel) {
        const cancelButton = createStyledElement('button', {
          backgroundColor: 'transparent',
          color: CSS_CONSTANTS.COLORS.TEXT_SECONDARY,
          border: `2px solid #e5e7eb`,
          borderRadius: CSS_CONSTANTS.STYLES.BUTTON_BORDER_RADIUS,
          padding: CSS_CONSTANTS.STYLES.BUTTON_PADDING,
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: CSS_CONSTANTS.STYLES.TRANSITION,
          minWidth: '120px'
        });
        cancelButton.textContent = cancelText;

        cancelButton.addEventListener('mouseenter', () => {
          cancelButton.style.backgroundColor = '#f8fafc';
          cancelButton.style.borderColor = CSS_CONSTANTS.COLORS.PRIMARY;
          cancelButton.style.color = CSS_CONSTANTS.COLORS.PRIMARY;
        });

        cancelButton.addEventListener('mouseleave', () => {
          cancelButton.style.backgroundColor = 'transparent';
          cancelButton.style.borderColor = '#e5e7eb';
          cancelButton.style.color = CSS_CONSTANTS.COLORS.TEXT_SECONDARY;
        });

        cancelButton.addEventListener('click', () => {
          if (onCancel) onCancel();
          overlay.remove();
          document.body.style.overflow = '';
        });

        footer.insertBefore(cancelButton, confirmButton);
      }

      // Zusammenbauen
      dialog.appendChild(header);
      dialog.appendChild(content);
      dialog.appendChild(footer);
      overlay.appendChild(dialog);

      // Overlay-Klick zum Schließen
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.remove();
          document.body.style.overflow = '';
        }
      });

      // ESC-Taste zum Schließen
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          overlay.remove();
          document.body.style.overflow = '';
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);

      // Scroll deaktivieren
      document.body.style.overflow = 'hidden';

      // Dialog anzeigen
      document.body.appendChild(overlay);

      return overlay;
    }

    // Vereinfachte Funktionen für verschiedene Dialog-Typen
    function showError(message, title = 'Fehler') {
      return showDialog({
        type: 'error',
        title: title,
        message: message
      });
    }

    function showWarning(message, title = 'Warnung') {
      return showDialog({
        type: 'warning',
        title: title,
        message: message
      });
    }

    function showSuccess(message, title = 'Erfolg') {
      return showDialog({
        type: 'success',
        title: title,
        message: message
      });
    }

    function showInfo(message, title = 'Information') {
      return showDialog({
        type: 'info',
        title: title,
        message: message
      });
    }

    function showConfirm(message, title = 'Bestätigung', onConfirm = null, onCancel = null) {
      return showDialog({
        type: 'warning',
        title: title,
        message: message,
        showCancel: true,
        confirmText: 'Bestätigen',
        cancelText: 'Abbrechen',
        onConfirm: onConfirm,
        onCancel: onCancel
      });
    }

    // Wrapper: Bestehende Aufrufe auf cbAlert mappen
    function showNiceDialog(title, message) {
      return showInfo(message, title);
    }

    // Tastatur-Bedienung für Dropdown-Optionen (Enter/Leertaste)
    document.addEventListener('keydown', function(e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList && e.target.classList.contains('dropdown-option')) {
        e.preventDefault();
        e.target.click();
      }
    });

    // --- NEU: Produktdaten aus dem JSON-Skript laden ---
    let shopifyProducts = [];
    document.addEventListener("DOMContentLoaded", () => {
      const productsScript = document.getElementById('konfigurator-products');
      if (productsScript) {
        try {
          shopifyProducts = JSON.parse(productsScript.textContent.trim());
          // Produktdaten erfolgreich geladen
        } catch (e) {
          console.warn('Konnte Produktdaten nicht parsen:', e);
          console.log('Script content:', productsScript.textContent.substring(0, 200));
        }
      }
      // ... bestehender Code ...
    });

    // --- NEU: Globale options-Array wiederhergestellt ---
    const options = [
      { name: "Leitungsschutzschalter 1 polig", size: 1, img: "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/LSS1_freigestellt.png?v=1756108987", variantId: "55403256742153" },
      { name: "Leitungsschutzschalter 3 polig", size: 3, img: "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/LSS3.png?v=1756113781", variantId: "55403132715273" },

      { name: "Klingeltrafo", size: 2, img: "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Klingeltrafo_e9548037-333f-4341-aa85-229b61328c91.png?v=1756118852", variantId: "55403136254217" },
      { name: "Stromstoßschalter", size: 1, img: "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Stromstossschalter.png?v=1756148388", variantId: "55403138416905" },
      { name: "Sicherungssockel", size: 4.5, img: "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Sicherungssockel.png?v=1756209996", variantId: "55403158208777" },
      { name: "Zeitschaltuhr", size: 2, img: "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Zeitschaltuhr_bc2f1421-e26b-45d6-ad76-1d8aeff9057e.png?v=1756117305", variantId: "55403159912713" },
      { name: "Dimmschalter", size: 1, img: "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Dimmschalter.png?v=1756121027", variantId: "55403161747721" },
      { name: "Treppenlicht-Zeitschalter", size: 1, img: "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Treppenlicht_Zeitschalter.png?v=1756149656", variantId: "55403163156745" },
      { name: "Steckdose", size: 2.5, img: "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Steckdose_4b62b405-1c0b-4007-8a07-8a71264c6c7f.png?v=1756277751", variantId: "55403164958985" }
    ];

    // --- NEU: Funktionen für dynamische Preisberechnung ---
    const variantPriceCache = {};
    const variantPriceFetchInFlight = new Set();
    function getVariantPrice(variantId) {
      variantId = String(variantId);
      // 1) Suche in vorab geladenen Shopify-Daten
      for (const product of shopifyProducts) {
        for (const variant of product.variants) {
          if (String(variant.id) === variantId) {
            return parseFloat(variant.price);
          }
        }
      }
      // 2) Cache prüfen
      if (variantId in variantPriceCache) {
        return parseFloat(variantPriceCache[variantId]);
      }
      // 3) Live nachladen (einmalig) und danach neu berechnen
      if (!variantPriceFetchInFlight.has(variantId)) {
        variantPriceFetchInFlight.add(variantId);
        fetch(`/variants/${variantId}.json`, { headers: { 'Accept': 'application/json' } })
          .then(r => r.json())
          .then(data => {
            const v = data && data.variant ? data.variant : null;
            if (v && (v.price !== undefined && v.price !== null)) {
              let price = parseFloat(v.price);
              // Falls Preis in Cent geliefert wird, normalisieren
              if (price > 1000) price = price / 100;
              variantPriceCache[variantId] = price;
              // Produktkartenpreise aktualisieren, falls eine der Karten diese Variante nutzt
              if (typeof updateStaticProductCardPrices === 'function') {
                updateStaticProductCardPrices();
              }
              updateInfoBox();
              if (typeof currentPage !== 'undefined' && currentPage === 5) {
                updateGesamtpreis();
              }
            } else {
              console.error(`Preis konnte nicht gefunden werden für VariantID ${variantId} (Shopify-Response ohne Preis).`);
            }
          })
          .catch((err) => {
            console.error(`Preisabruf fehlgeschlagen für VariantID ${variantId}:`, err);
          })
          .finally(() => {
            variantPriceFetchInFlight.delete(variantId);
          });
      }
      // Wenn wir hier ankommen, gibt es noch keinen Preis; Fehlerhinweis in der Konsole
      console.error(`Preis nicht gefunden für VariantID ${variantId}. Variante nicht im vorab geladenen JSON und noch nicht gecacht.`);
      return 0;
    }

    // --- NEU: Preise der drei Produktkarten dynamisch setzen ---
    let priceCardRefreshScheduled = false;
    function formatPriceDE(value) {
      if (typeof value !== 'number' || isNaN(value)) return '';
      return value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    }
    function updateStaticProductCardPrices() {
      try {
        const nameToVariant = {
          'Unterzähler': '56050139267337',
          'Überspannungsschutz': '56050140021001',
          'Hauptschalter': '56050140479753'
        };
        let needsRefresh = false;
        const cards = document.querySelectorAll('.produktkarte');
        cards.forEach(card => {
          const nameEl = card.querySelector('.produktname');
          const priceEl = card.querySelector('.produktpreis .preis');
          if (!nameEl || !priceEl) return;
          const name = (nameEl.textContent || '').trim();
          const variantId = nameToVariant[name];
          if (!variantId) return;
          const price = getVariantPrice(variantId);
          if (price && price > 0) {
            priceEl.textContent = formatPriceDE(price);
          } else {
            // Preis noch nicht verfügbar → später erneut versuchen
            needsRefresh = true;
          }
        });
        if (needsRefresh && !priceCardRefreshScheduled) {
          priceCardRefreshScheduled = true;
          setTimeout(() => {
            priceCardRefreshScheduled = false;
            updateStaticProductCardPrices();
          }, 1200);
        }
      } catch (e) {
        console.warn('Konnte Produktkarten-Preise nicht aktualisieren:', e);
      }
    }

    // Reihenklemmen entfernt

    // Verdrahtung: Mapping je nach Auswahl und Reihenanzahl (IDs hier eintragen)
    const verdrahtungVariantMap = {
      'Nur Einzelteile (ohne Verdrahtung & Zubehör)': {
        '1': null,
        '2': null,
        '3': null,
        '4': null,
        '5': null
      },
      'Verdrahtungszubehör (ohne Vormontage & Verdrahtung)': {
        '1': '56067295969545',
        '2': '56067296002313',
        '3': '56067296035081',
        '4': '56067296067849',
        '5': '56067296100617'
      },
      'Vormontage & Verdrahtung': {
        '1': '56067305242889',
        '2': '56067305275657',
        '3': '56067305308425',
        '4': '56067305341193',
        '5': '56067305373961'
      }
    };

    function getVerdrahtungVariantId() {
      if (!selectedVerdrahtung) return null;
      const byRows = verdrahtungVariantMap[selectedVerdrahtung];
      if (!byRows) return null;
      // Berücksichtige Zusatzreihe row1_2 als eigenständige Reihe
      const actualRows = typeof getActualRowCount === 'function' ? getActualRowCount() : rowCounter;
      const key = String(Math.max(1, Math.min(5, actualRows)));
      return byRows[key] || null;
    }

    function getVerdrahtungPrice() {
      const vId = getVerdrahtungVariantId();
      if (!vId) return 0;
      return getVariantPrice(vId);
    }

    // --- NEU: Mapping für Montageart-Varianten nach Reihenanzahl ---
    const montageartVariantMap = {
      'Aufputz-Montage': {
        '1': '56050050072841',
        '2': '56050050105609',
        '3': '56050050138377',
        '4': '56050050171145',
        '5': '56050050203913'
      },
      'Aufputz(Feuchtraum)-Montage': {
        '1': '56050086510857',
        '2': '56050086543625',
        '3': '56050086576393',
        '4': '56050086609161',
        '5': '56050086641929'
      },
      'Unterputz-Montage': {
        '1': '56050091950345',
        '2': '56050091983113',
        '3': '56050092015881',
        '4': '56050092048649',
        '5': '56050092081417'
      },
      'Hohlwand-Montage': {
        '1': '56050096144649',
        '2': '56050096177417',
        '3': '56050096210185', // z. B. andere Variante für 3 Reihen
        '4': '56050096242953',
        '5': '56050096275721'
      }
    };

    function getMontageartVariantId() {
      if (!selectedMontageart) return null;
      const byRows = montageartVariantMap[selectedMontageart];
      if (!byRows) return null;
      // Berücksichtige Zusatzreihe row1_2 als eigenständige Reihe
      const actualRows = typeof getActualRowCount === 'function' ? getActualRowCount() : rowCounter;
      const key = String(Math.max(1, Math.min(5, actualRows)));
      return byRows[key] || null;
    }

    function getMontageartPrice() {
      const vId = getMontageartVariantId();
      if (!vId) return 0;
      return getVariantPrice(vId);
    }

    // Einheitliche Preisberechnung (Basispreis ohne Mengenfaktor)
    function calculateBaseSum() {
      let sum = 0;
      // Reihen 1..rowCounter
      for (let i = 1; i <= rowCounter; i++) {
        const rowContent = document.getElementById("row" + i + "Content");
        if (rowContent) {
          Array.from(rowContent.children).forEach(productBox => {
            const variantId = productBox.getAttribute('data-variant-id');
            if (variantId && variantId !== 'undefined') {
              sum += getVariantPrice(variantId);
            }
          });
        }
      }
      // Zusatzreihe row1Content_2 berücksichtigen
      const row1Content2 = document.getElementById('row1Content_2');
      if (row1Content2) {
        Array.from(row1Content2.children).forEach(productBox => {
          const variantId = productBox.getAttribute('data-variant-id');
          if (variantId && variantId !== 'undefined') {
            sum += getVariantPrice(variantId);
          }
        });
      }
      // Verdrahtung (falls Mapping vorhanden)
      const vIdVerd = getVerdrahtungVariantId();
      if (vIdVerd) {
        const verdrahtungPrice = getVariantPrice(vIdVerd);
        sum += verdrahtungPrice;
        // Verdrahtung Preis hinzugefügt
      }
      // Montageart (abhängig von Reihenanzahl)
      if (selectedMontageart) {
        const montagePrice = getMontageartPrice();
        sum += montagePrice;
        // Montageart Preis hinzugefügt
      }
      return sum;
    }

    function getActualRowCount() {
      // Zählt alle Reihen-Container (row1, row2, ..., row1_2), unabhängig von Sichtbarkeit
      return document.querySelectorAll('.row-container').length;
    }

    // Berechnet die insgesamt belegten TE-Einheiten aus dem DOM inkl. Zusatzreihe und Reihenklemmen
    function getUsedUnits() {
      let units = 0;
      for (let i = 1; i <= rowCounter; i++) {
        const rowContent = document.getElementById("row" + i + "Content");
        if (rowContent) {
          Array.from(rowContent.children).forEach(productBox => {
            const size = parseFloat(productBox.getAttribute('data-size')) || 0;
            units += size;
          });
        }
      }
      // Zusatzreihe row1Content_2 berücksichtigen
      const row1Content2 = document.getElementById('row1Content_2');
      if (row1Content2) {
        Array.from(row1Content2.children).forEach(productBox => {
          const size = parseFloat(productBox.getAttribute('data-size')) || 0;
          units += size;
        });
      }
      // Reihenklemmen entfernt
      return units;
    }

    function updateInfoBox() {
      try {
        const rowCountElement = document.getElementById("rowCount");
        const usedUnitsElement = document.getElementById("usedUnits");
        const totalPriceElement = document.getElementById("totalPrice");

        if (!rowCountElement || !usedUnitsElement || !totalPriceElement) {
          throw new Error("Info-Box Elemente nicht gefunden");
        }

        // --- Alle Reihen zählen ---
        const reihen = getActualRowCount();
        rowCountElement.textContent = reihen;
        usedUnitsElement.textContent = getUsedUnits();

        // --- Einheitliche Preisberechnung ---
        const sum = calculateBaseSum();
        // Menge berücksichtigen (wie im Warenkorb)
        let qty = 1;
        const qtyInput = document.getElementById("verteilerAnzahl");
        if (qtyInput) {
          const parsed = parseInt(qtyInput.value);
          qty = isNaN(parsed) ? 1 : Math.max(0, Math.min(10, parsed));
        }
        const totalWithQty = sum * qty;
        totalPriceElement.textContent = totalWithQty.toFixed(2) + " €";
      } catch (error) {
        console.error("Fehler beim Aktualisieren der Info-Box:", error.message);
      }
    }
    // ... existing code ...

    document.addEventListener("DOMContentLoaded", () => {
      setupRow(1);
      updateInfoBox();
      updateSummary();
      // Preise der sichtbaren Produktkarten dynamisch einsetzen
      updateStaticProductCardPrices();
      
      // Keyboard-Support für Dropdown-Trigger hinzufügen
      addTriggerKeyboardSupport();

      document.getElementById("addFiRowButton").addEventListener("click", () => {
        if (getActualRowCount() < maxRows) {
          rowCounter++;
          const newRowStrip = document.createElement("div");
          newRowStrip.id = "row" + rowCounter + "-strip";
          newRowStrip.className = "row-strip";

          const newRow = document.createElement("div");
          newRow.id = "row" + rowCounter;
          newRow.className = "row-container";

          const newRowContent = document.createElement("div");
          newRowContent.id = "row" + rowCounter + "Content";
          newRowContent.className = "row-content";
          newRowContent.dataset.section = "B"; // Markiere die Reihe als Sektion B

          newRow.appendChild(newRowContent);

          const configurator = document.getElementById("configurator");
          const buttonContainer = document.querySelector('#configurator > div:last-child');

          // Prüfe die Position des Schalters "Position im Verteiler"
          const positionButtons = document.querySelectorAll('.konfigurator-option-btn');
          let isPositionBottom = false;
          positionButtons.forEach(btn => {
            if (btn.textContent === "Unten" && btn.classList.contains('selected')) {
              isPositionBottom = true;
            }
          });

          if (isPositionBottom) {
            // Wenn Position "Unten" ist, füge neue Reihen über row1_2 ein (falls vorhanden) oder über row1
            const row1_2 = document.getElementById('row1_2');
            const insertBefore = row1_2 || document.getElementById('row1');
            if (insertBefore) {
              configurator.insertBefore(newRowStrip, insertBefore);
              configurator.insertBefore(newRow, insertBefore);
            } else {
              // Fallback: vor den Buttons einfügen
              configurator.insertBefore(newRowStrip, buttonContainer);
              configurator.insertBefore(newRow, buttonContainer);
            }
          } else {
            // Wenn Position "Oben" ist, füge neue Reihen vor den Buttons ein
            configurator.insertBefore(newRowStrip, buttonContainer);
            configurator.insertBefore(newRow, buttonContainer);
          }
          setupRow(rowCounter);
          updateInfoBox();
          updateSummary();

          // Füge den FI-/Leitungsschutzschalter zur neuen Reihe hinzu
          const fiProduct = {
            name: "FI-/Leitungsschutzschalter",
            size: 4,
            img: "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/FI-Schalter-gpt.png?v=1756113758"
          };
          addFixedProductToRow(rowCounter, fiProduct);
        } else {
          showWarning('Es werden nur maximal 5 Reihen unterstüzt. Wenn du mehr Platz brauchst, <a href="/#contact" style="color: #005A9C; text-decoration: underline;">kontaktiere uns</a> – wir finden eine passende Lösung', 'Maximale Anzahl an Reihen erreicht!');
        }
      });

      document.getElementById("addFreeRowButton").addEventListener("click", () => {
        if (getActualRowCount() < maxRows) {
          rowCounter++;
          const newRowStrip = document.createElement("div");
          newRowStrip.id = "row" + rowCounter + "-strip";
          newRowStrip.className = "row-strip";

          const newRow = document.createElement("div");
          newRow.id = "row" + rowCounter;
          newRow.className = "row-container";

          const newRowContent = document.createElement("div");
          newRowContent.id = "row" + rowCounter + "Content";
          newRowContent.className = "row-content";
          newRowContent.dataset.section = "B"; // Markiere die Reihe als Sektion B

          newRow.appendChild(newRowContent);

          const configurator = document.getElementById("configurator");
          const buttonContainer = document.querySelector('#configurator > div:last-child');

          // Prüfe die Position des Schalters "Position im Verteiler"
          const positionButtons = document.querySelectorAll('.konfigurator-option-btn');
          let isPositionBottom = false;
          positionButtons.forEach(btn => {
            if (btn.textContent === "Unten" && btn.classList.contains('selected')) {
              isPositionBottom = true;
            }
          });

          if (isPositionBottom) {
            // Wenn Position "Unten" ist, füge neue Reihen über row1_2 ein (falls vorhanden) oder über row1
            const row1_2 = document.getElementById('row1_2');
            const insertBefore = row1_2 || document.getElementById('row1');
            if (insertBefore) {
              configurator.insertBefore(newRowStrip, insertBefore);
              configurator.insertBefore(newRow, insertBefore);
            } else {
              // Fallback: vor den Buttons einfügen
              configurator.insertBefore(newRowStrip, buttonContainer);
              configurator.insertBefore(newRow, buttonContainer);
            }
          } else {
            // Wenn Position "Oben" ist, füge neue Reihen vor den Buttons ein
            configurator.insertBefore(newRowStrip, buttonContainer);
            configurator.insertBefore(newRow, buttonContainer);
          }
          setupRow(rowCounter);
          updateInfoBox();
          updateSummary();
        } else {
          showWarning('Es werden nur maximal 5 Reihen unterstüzt. Wenn du mehr Platz brauchst, <a href="/#contact" style="color: #005A9C; text-decoration: underline;">kontaktiere uns</a> – wir finden eine passende Lösung', 'Maximale Anzahl an Reihen erreicht!');
        }
      });

      document.getElementById("nextButton").addEventListener("click", () => {
        if (currentPage < 5) {
          // Pflichtauswahl auf Seite 3 (Verteilerschrank) bevor wir zu Seite 4 wechseln
          if (currentPage === 3) {
            if (!validatePage(currentPage)) {
              return; // Seitenwechsel verhindern, wenn die Validierung fehlschlägt
            }
          }
          // Pflichtauswahl auf Seite 4 (Verdrahtung) bevor wir zu Seite 5 wechseln
          if (currentPage === 4) {
            const verdrahtungBtn = document.getElementById('verdrahtung-btn');
            const verdrahtungText = (selectedVerdrahtung || (verdrahtungBtn ? verdrahtungBtn.textContent.trim() : ''));
            let errorBox = document.getElementById("verdrahtung-error");
            if (!verdrahtungText || verdrahtungText === 'Verdrahtungsoption') {
              if (!errorBox) {
                errorBox = document.createElement("div");
                errorBox.id = "verdrahtung-error";
                errorBox.style.background = "#ffeaea";
                errorBox.style.color = "#D93025";
                errorBox.style.padding = "12px 20px";
                errorBox.style.borderRadius = "5px";
                errorBox.style.margin = "20px auto";
                errorBox.style.maxWidth = "600px";
                errorBox.style.textAlign = "center";
                errorBox.textContent = "Bitte wählen Sie eine Verdrahtungsoption aus.";
                // Füge die Fehlermeldung unterhalb der Dropdowns ein
                const verdrahtungBox = document.querySelector('#page4 .dropdown-container');
                if (verdrahtungBox && verdrahtungBox.parentNode) {
                  verdrahtungBox.parentNode.insertBefore(errorBox, verdrahtungBox.nextSibling);
                }
              }
              return;
            } else {
              if (errorBox) errorBox.remove();
            }
          }
          // Nächste Seite berechnen und Seite 2 überspringen
          let targetPage = currentPage + 1;
          if (targetPage === 2) targetPage = 3;
          currentPage = targetPage;
          if (currentPage === 5) {
            updateSummary();
          }
        } else if (currentPage === 5) {
          addToCart();
        }
        showPage(currentPage);
      });

      document.getElementById("prevButton").addEventListener("click", () => {
        if (currentPage > 1) {
          // Vorherige Seite berechnen und Seite 2 überspringen
          let targetPage = currentPage - 1;
          if (targetPage === 2) targetPage = 1;
          currentPage = targetPage;
          if (currentPage < 5) {
            document.getElementById("nextButton").textContent = "Weiter";
          }
        }
        showPage(currentPage);
      });

      // Startseite anzeigen
      showPage(currentPage);

      // Stelle sicher, dass die Hauptleitungsklemme initial in Reihe 1 ist, wenn 'mit' aktiv ist
      const mitBtn = document.getElementById('hlk-mit-btn');
      if (mitBtn && mitBtn.classList.contains('active')) {
        const rowContent = document.getElementById("row1Content");
        if (rowContent && !Array.from(rowContent.children).some(box => box.querySelector('img')?.alt === "Hauptleitungsklemme")) {
          const hauptleitungsklemme = {
            name: "Hauptleitungsklemme",
            size: 5,
            img: "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Hauptabzweigklemme.png?v=1748178901",
            variantId: "56051869876489"
          };
          addFixedProductToRow(1, hauptleitungsklemme);
        }
      }
      // Stelle sicher, dass der Hauptschalter initial NICHT in Reihe 1 ist
      for (let i = 1; i <= rowCounter; i++) {
        const rowContent = document.getElementById("row" + i + "Content");
        if (rowContent) {
          Array.from(rowContent.children).forEach(box => {
            if (box.querySelector('img')?.alt === "Hauptschalter") {
              removeProductFromRow(i, box);
            }
          });
        }
      }

      // --- Produktbilder vorladen ---
      const produktBilder = [
        "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Hauptabzweigklemme.png?v=1748178901",
        "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Unterzaehler.png?v=1749299190",
        "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Uberspannungsschutz.png?v=1748243634",
        "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Hauptschalter.png?v=1749293582",
        "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/FI-Schalter-gpt.png?v=1756113758"
        // Hier ggf. weitere Produktbilder ergänzen
      ];
      produktBilder.forEach(src => {
        const img = new window.Image();
        img.src = src;
      });

      // --- NEU: Preload aller Produktbilder ---
      if (Array.isArray(options)) {
        options.forEach(opt => {
          if (opt.img) {
            const img = new Image();
            img.src = opt.img;
          }
        });
      }
      // FI-/Leitungsschutzschalter Bild ggf. extra vorladen
      const fiImg = "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/FI-Schalter-gpt.png?v=1756113758";
      const fiPreload = new Image();
      fiPreload.src = fiImg;
      // Hauptleitungsklemme Bild ggf. extra vorladen
      const hlkImg = "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Hauptabzweigklemme.png?v=1748178901";
      const hlkPreload = new Image();
      hlkPreload.src = hlkImg;
    });

    // Füge Event-Listener für das initiale Laden hinzu
    document.addEventListener('DOMContentLoaded', function() {
      showPage(currentPage);
      // Zusätzliche Sicherheit: Verstecke den Zurück-Button auf Page 1
      const prevButton = document.getElementById("prevButton");
      if (prevButton && currentPage === 1) {
        prevButton.style.display = "none";
        prevButton.classList.add('hidden-on-page1');
      }
    });

    function showPage(pageNumber) {
      // Alle Seiten ausblenden
      document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
      });

      // Aktuelle Seite anzeigen
      document.getElementById('page' + pageNumber).classList.add('active');
      
      // Scroll-Verhalten beim Seitenwechsel
      if (pageNumber > 1) {
        if (pageNumber === 5) {
          // Bei Page 5 (Zusammenfassung): KEIN Scrollen
          // Der Benutzer bleibt an der aktuellen Position
        } else if (pageNumber === 3 || pageNumber === 4) {
          // Bei Page 3 und 4: Section-Container in den Fokus bringen
          const sectionContainer = document.querySelector('.page-konfigurator-section');
          if (sectionContainer) {
            sectionContainer.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          } else {
            // Fallback: Scroll nach oben
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }
        } else {
          // Bei anderen Seiten: Normal nach oben scrollen
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }

      // Reihenklemmen entfernt

      // NEU: Bei Anzeige der Zusammenfassung die Preise aktualisieren
      if (pageNumber === 5) {
        updateInfoBox();
      }

      // Statusleiste aktualisieren
      document.querySelectorAll('.status-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 === pageNumber) {
          step.classList.add('active');
        } else if (index + 1 < pageNumber) {
          step.classList.add('completed');
        }
      });

      // Button-Text aktualisieren
      const nextButton = document.getElementById("nextButton");
      if (pageNumber === 5) {
        nextButton.innerHTML = '<i class="fas fa-shopping-cart"></i> In den Warenkorb legen';
      } else {
        nextButton.textContent = "Weiter";
      }

      // Blende den Zurück-Button auf Seite 1 aus, sonst ein
      const prevButton = document.getElementById("prevButton");
      const buttonContainer = document.querySelector('.button-container');
      const configuratorButtons = document.querySelector('#configurator > div:last-child');
      
      if (pageNumber === 1) {
        prevButton.style.display = "none";
        prevButton.classList.add('hidden-on-page1');
        if (window.innerWidth <= 1260) {
          // Verschiebe den "Weiter" Button in den Konfigurator-Button-Container
          if (configuratorButtons && nextButton.parentNode === buttonContainer) {
            configuratorButtons.appendChild(nextButton);
          }
          buttonContainer.style.display = "none";
        } else {
          // Desktop-Ansicht: Button zurück in den button-container
          if (configuratorButtons && nextButton.parentNode === configuratorButtons) {
            buttonContainer.appendChild(nextButton);
          }
          buttonContainer.style.display = "flex";
          buttonContainer.style.justifyContent = "flex-end";
          buttonContainer.style.width = "1200px";
          buttonContainer.style.margin = "20px auto";
        }
      } else {
        prevButton.style.display = "inline-block";
        prevButton.classList.remove('hidden-on-page1');
        // Entferne existierende mobile Button-Container
        const existingMobileContainer = document.querySelector('.mobile-button-container');
        if (existingMobileContainer) {
          existingMobileContainer.remove();
        }

        // Stelle sicher, dass die Buttons im button-container sind
        if (configuratorButtons && nextButton.parentNode === configuratorButtons) {
          buttonContainer.appendChild(nextButton);
        }
        if (configuratorButtons && prevButton.parentNode === configuratorButtons) {
          buttonContainer.appendChild(prevButton);
        }

        // Setze die Styles für den button-container
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "space-between";
        buttonContainer.style.width = window.innerWidth <= 1260 ? "100%" : "1200px";
        buttonContainer.style.margin = "20px auto";
        buttonContainer.style.padding = window.innerWidth <= 1260 ? "0 10px" : "0";
        buttonContainer.style.boxSizing = "border-box";
      }
    }

    // Füge Event-Listener für Fenstergrößenänderung hinzu
    window.addEventListener('resize', function() {
      showPage(currentPage);
    });

    function setupRow(rowNumber) {
      const dropdown = createDropdown(rowNumber);
      const resetButton = createResetButton(rowNumber);
      const removeButton = createRemoveButton(rowNumber);

      const buttonsContainerTop = document.createElement("div");
      buttonsContainerTop.className = "buttons-container-top";
      buttonsContainerTop.id = "buttonsRow" + rowNumber;
      
      // Füge die Buttons nur für Reihen > 1 hinzu
      if (rowNumber > 1) {
        buttonsContainerTop.appendChild(dropdown);
        buttonsContainerTop.appendChild(resetButton);
        if (removeButton) {
          buttonsContainerTop.appendChild(removeButton);
        }
      }

      // Füge den Position-Dropdown nur in der ersten Reihe hinzu
      if (rowNumber === 1) {
        const positionDropdown = createPositionDropdown();
        buttonsContainerTop.appendChild(positionDropdown);
      }

      const rowStrip = document.getElementById("row" + rowNumber + "-strip");
      rowStrip.appendChild(buttonsContainerTop);
      setDropdownListeners(rowNumber);

      // Füge das feste Element in der ersten Reihe hinzu
      if (rowNumber === 1) {
        const fixedProduct = {
          name: "Hauptleitungsklemme",
          size: 5,
          img: "https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Hauptabzweigklemme.png?v=1748178901",
          variantId: "56051869876489"
        };
        addFixedProductToRow(rowNumber, fixedProduct);
      }
      updateInfoBox();
    }

    function createRow(rowNumber) {
      const newRowStrip = document.createElement("div");
      newRowStrip.id = "row" + rowNumber + "-strip";
      newRowStrip.className = "row-strip";

      const newRow = document.createElement("div");
      newRow.id = "row" + rowNumber;
      newRow.className = "row-container";

      const newRowContent = document.createElement("div");
      newRowContent.id = "row" + rowNumber + "Content";
      newRowContent.className = "row-content";

      newRow.appendChild(newRowContent);

      // Finde die richtige Einfügeposition: nach row1_2 (falls vorhanden) oder nach row1
      const row1_2 = document.getElementById('row1_2');
      const insertAfter = row1_2 || document.getElementById('row1');
      
      if (insertAfter) {
        document.getElementById("configurator").insertBefore(newRowStrip, insertAfter.nextSibling);
        document.getElementById("configurator").insertBefore(newRow, insertAfter.nextSibling);
      } else {
        // Fallback: vor den Buttons einfügen
        document.getElementById("configurator").insertBefore(newRowStrip, document.getElementById("addFiRowButton"));
        document.getElementById("configurator").insertBefore(newRow, document.getElementById("addFiRowButton"));
      }
      setupRow(rowNumber); // Neue Reihe mit Buttons und Dropdown versehen
    }

    // Dropdown-Listener
    function setDropdownListeners(rowNumber) {
      const dropdownButton = document.querySelector(`#buttonsRow${rowNumber} .dropdown-btn`);
      if (dropdownButton) {
        dropdownButton.addEventListener("click", function (event) {
          event.stopPropagation(); // Verhindert das Schließen des Dropdowns
          const dropdown = this.nextElementSibling;
          const willOpen = dropdown.style.display !== "block";
          dropdown.style.display = willOpen ? "block" : "none";
          dropdownButton.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
          dropdown.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
        });

        // Verhindere das Schließen des Dropdowns beim Klicken auf eine Option
        const dropdown = dropdownButton.nextElementSibling;
        dropdown.addEventListener("click", function(event) {
          event.stopPropagation();
        });
      }
    }

    // Dropdown erstellen
    function createDropdown(rowNumber) {
      const dropdownContainer = document.createElement("div");
      dropdownContainer.className = "dropdown-container";

      const dropdownButton = document.createElement("button");
      dropdownButton.className = "konfigurator-option-btn dropdown-btn";
      dropdownButton.textContent = "Element hinzufügen";
      dropdownButton.classList.add("dropdown-btn");
      dropdownButton.type = "button";
      dropdownButton.setAttribute('aria-haspopup','menu');
      dropdownButton.setAttribute('aria-expanded','false');

      const dropdown = document.createElement("div");
      dropdown.className = "dropdown";
      dropdown.setAttribute('role','menu');
      const dropdownId = `row${rowNumber}-dropdown`;
      dropdown.id = dropdownId;
      dropdownButton.setAttribute('aria-controls', dropdownId);

      options.forEach(option => {
        const optionDiv = document.createElement("div");
        optionDiv.className = "dropdown-option";
        optionDiv.setAttribute('role','menuitem');
        optionDiv.tabIndex = 0;
        optionDiv.textContent = option.name;
        optionDiv.addEventListener("click", () => addProductToRow(rowNumber, option));
        optionDiv.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            addProductToRow(rowNumber, option);
          }
        });
        dropdown.appendChild(optionDiv);
      });

      dropdownContainer.append(dropdownButton, dropdown);
      return dropdownContainer;
    }

    // Produkte zur Reihe hinzufügen
    function addProductToRow(rowNumber, product) {
      try {
        // Verhindere das Hinzufügen von Elementen zur ersten Reihe
        if (rowNumber === 1) {
          const errorMessage = document.createElement("div");
          errorMessage.style.position = "fixed";
          errorMessage.style.top = "50%";
          errorMessage.style.left = "50%";
          errorMessage.style.transform = "translate(-50%, -50%)";
          errorMessage.style.backgroundColor = "#FFEBEE";
          errorMessage.style.color = "#D93025";
          errorMessage.style.padding = "20px";
          errorMessage.style.borderRadius = "8px";
          errorMessage.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
          errorMessage.style.zIndex = "1000";
          errorMessage.style.textAlign = "center";
          errorMessage.style.fontSize = "18px";
          errorMessage.style.fontWeight = "bold";
          errorMessage.style.maxWidth = "500px";
          errorMessage.style.border = "2px solid #D93025";
          errorMessage.innerHTML = `
            <div style="margin-bottom: 10px;">
              <i class="fas fa-exclamation-circle" style="font-size: 24px; margin-right: 10px;"></i>
              In der ersten Reihe können keine weiteren Elemente hinzugefügt werden!
            </div>
            <div style="font-size: 16px; font-weight: normal;">
              Bitte fügen Sie Elemente in der zweiten Reihe hinzu.
            </div>
          `;

          document.body.appendChild(errorMessage);
          setTimeout(() => {
            errorMessage.remove();
          }, 3000);
          return;
        }

        const rowContent = document.getElementById("row" + rowNumber + "Content");
        if (!rowContent) {
          throw new Error("Reihe nicht gefunden");
        }

        // Berechne den belegten Platz in der Reihe
        const occupiedSpace = Array.from(rowContent.children).reduce((total, productBox) => {
          try {
            return total + parseFloat(productBox.dataset.size);
          } catch (e) {
            console.warn("Fehler beim Berechnen der Einheiten eines Produkts");
            return total;
          }
        }, 0);

        // Prüfe, ob das neue Element die maximale Anzahl von 12 Einheiten überschreiten würde
        if (occupiedSpace + product.size > maxUnitsPerRow) {
          // Erstelle die Fehlermeldung
          showWarning('Bitte einen weiteren FI-Bereich konfigurieren.', 'Pro FI-Bereich sind nur 12TE zugelassen!');
          return;
        }

        // NEU: Produktbox mit Dropdowns (falls nötig) erzeugen
        const productBox = createProductBox(product);
        rowContent.appendChild(productBox);

        // Überprüfe die Leitungsschutzschalter-Einheiten
        let totalLSUnits = 0;
        const leitungsschutzschalterElements = rowContent.querySelectorAll('.product-box');
        leitungsschutzschalterElements.forEach(element => {
          const img = element.querySelector('img');
          if (img && (img.alt.includes('Leitungsschutzschalter 1-polig') || img.alt.includes('Leitungsschutzschalter 3-polig'))) {
            const size = parseFloat(element.dataset.size) || 0;
            totalLSUnits += size;
          }
        });

        if (totalLSUnits > 6) {
          showWarning('Laut DIN VDE 0100-530:2018-6 sind nur noch sechs LS-Schalter (dreiphasig verteilt) hinter einem Gruppen-FI-Schutzschalter zulässig!', 'Hinweis');
        }

        totalUnits += product.size;
        updateInfoBox();
        updateSummary();
      } catch (error) {
        console.error("Fehler beim Hinzufügen des Produkts:", error.message);
        showError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      }
    }

    // Drag-and-Drop Funktionen
    let draggedItem = null;
    let initialX = 0;
    let initialY = 0;
    let currentRow = null;

    function startDragging(e) {
      // Nur starten, wenn auf das Icon geklickt wurde
      if (!e.target.closest('.action-icon.move-icon')) return;
      
      // Verhindere Drag-and-Drop für fixed-product Elemente und FI-/Leitungsschutzschalter
      if (this.classList.contains('fixed-product') || this.querySelector('img')?.alt === "FI-/Leitungsschutzschalter") return;
      
      draggedItem = this;
      currentRow = this.parentNode;
      
      // Berechne die Startposition
      const rect = this.getBoundingClientRect();
      initialX = e.clientX || e.touches[0].clientX;
      initialY = e.clientY || e.touches[0].clientY;
      
      // Füge die dragging-Klasse hinzu
      this.classList.add('dragging');
      
      // Setze die Position für das Ziehen
      this.style.position = 'relative';
      this.style.zIndex = '1000';
      
      // Event-Listener für das Bewegen und Loslassen
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag, { passive: false });
      document.addEventListener('mouseup', stopDragging);
      document.addEventListener('touchend', stopDragging);
      
      // Verhindere Standard-Verhalten für Touch-Geräte
      e.preventDefault();
    }

    function drag(e) {
      if (!draggedItem) return;
      
      e.preventDefault();
      
      // Berechne die neue Position
      const x = (e.clientX || e.touches[0].clientX) - initialX;
      const y = (e.clientY || e.touches[0].clientY) - initialY;
      
      // Aktualisiere die Position mit einer sanften Animation
      draggedItem.style.transform = `translate(${x}px, ${y}px)`;
      
      // Finde das Element unter dem Cursor
      const elements = document.elementsFromPoint(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
      const targetElement = elements.find(el => 
        el.classList.contains('product-box') && 
        el !== draggedItem && 
        !el.classList.contains('fixed-product')
      );
      
      if (targetElement) {
        // Verhindere das Verschieben vor den FI-/Leitungsschutzschalter
        const fiSchalter = currentRow.querySelector('.product-box img[alt="FI-/Leitungsschutzschalter"]');
        if (fiSchalter && targetElement === fiSchalter.parentElement) {
          return;
        }
        
        // Bestimme die Position relativ zum Ziel
        const targetRect = targetElement.getBoundingClientRect();
        const isBefore = (e.clientX || e.touches[0].clientX) < targetRect.left + targetRect.width / 2;
        
        // Entferne das Element temporär
        const tempParent = document.createElement('div');
        draggedItem.parentNode.insertBefore(tempParent, draggedItem);
        draggedItem.remove();
        
        // Füge das Element an der richtigen Position wieder ein
        if (isBefore) {
          currentRow.insertBefore(draggedItem, targetElement);
        } else {
          currentRow.insertBefore(draggedItem, targetElement.nextSibling);
        }
        
        // Entferne das temporäre Element
        tempParent.remove();
        
        // Aktualisiere die Startposition für die nächste Bewegung
        const newRect = draggedItem.getBoundingClientRect();
        initialX = e.clientX || e.touches[0].clientX;
        initialY = e.clientY || e.touches[0].clientY;
      }
    }

    function stopDragging() {
      if (!draggedItem) return;
      
      // Entferne die dragging-Klasse
      draggedItem.classList.remove('dragging');
      
      // Setze die Position zurück
      draggedItem.style.transform = '';
      draggedItem.style.zIndex = '';
      
      // Entferne die Event-Listener
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('touchend', stopDragging);
      
      draggedItem = null;
    }

    // Speichere die FI-Schalter Konfigurationen
    const fiSchalterConfigs = new Map();

    function updateFiSchalterConfig(rowNumber, type, value) {
      const configKey = `row${rowNumber}`;
      if (!fiSchalterConfigs.has(configKey)) {
        fiSchalterConfigs.set(configKey, {
          nennstrom: '40',
          charakteristik: 'A'
        });
      }
      
      const config = fiSchalterConfigs.get(configKey);
      config[type] = value;
      
      // Aktualisiere die Zusammenfassung, falls wir auf der Zusammenfassungsseite sind
      if (currentPage === 5) {
        updateSummary();
      }
    }

    // Produkt aus der Reihe entfernen
    function removeProductFromRow(rowNumber, productBox) {
      try {
        
        const rowContent = document.getElementById("row" + rowNumber + "Content");
        if (!rowContent) {
          throw new Error("Reihe nicht gefunden");
        }

        const size = parseFloat(productBox.dataset.size) || 0;
        
        
        // Berechne den belegten Platz vor dem Entfernen
        let occupiedSpace = 0;
        Array.from(rowContent.children).forEach(box => {
          occupiedSpace += parseFloat(box.dataset.size) || 0;
        });
        
        
        productBox.remove();
        totalUnits -= size;
        updateInfoBox();
        updateSummary();
        
        // Berechne den belegten Platz nach dem Entfernen
        occupiedSpace = 0;
        Array.from(rowContent.children).forEach(box => {
          occupiedSpace += parseFloat(box.dataset.size) || 0;
        });
        

        // Wenn ein Element aus row1Content entfernt wurde, prüfe ob Elemente verschoben werden können
        if (rowNumber === 1 && rowContent.id === "row1Content") {
          checkAndMoveElements();
        }
      } catch (error) {
        console.error("Fehler beim Entfernen des Produkts:", error.message);
      }
    }

    function createResetButton(rowNumber) {
      const resetButton = document.createElement("button");
      resetButton.className = "konfigurator-option-btn konfigurator-btn-yellow";
      resetButton.textContent = "Reihe zurücksetzen";
      resetButton.addEventListener("click", () => resetRow(rowNumber));
      return resetButton;
    }

    function resetRow(rowNumber) {
      try {
      const rowContent = document.getElementById("row" + rowNumber + "Content");
        if (!rowContent) {
          throw new Error("Reihe nicht gefunden");
        }

        // Berechne die zu entfernenden Einheiten, ohne das feste Element
        const unitsToRemove = Array.from(rowContent.children)
          .filter(productBox => !productBox.classList.contains('fixed-product'))
          .reduce((total, productBox) => {
            try {
              return total + parseFloat(productBox.dataset.size);
            } catch (e) {
              console.warn("Fehler beim Berechnen der Einheiten eines Produkts");
              return total;
            }
          }, 0);

        // Entferne nur die nicht-festen Elemente
        Array.from(rowContent.children)
          .filter(productBox => !productBox.classList.contains('fixed-product'))
          .forEach(productBox => productBox.remove());

        totalUnits -= unitsToRemove;
        updateInfoBox();
        updateSummary();
      } catch (error) {
        console.error("Fehler beim Zurücksetzen der Reihe:", error.message);
        showError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      }
    }

    function createRemoveButton(rowNumber) {
      if (rowNumber === 1) {
        return null;
      }
      const removeButton = document.createElement("button");
      removeButton.className = "konfigurator-option-btn konfigurator-btn-red";
      removeButton.textContent = "Reihe entfernen";
      removeButton.addEventListener("click", () => removeRow(rowNumber));
      return removeButton;
    }

    // Reihenklemmen-Logik entfernt

    // Neues, portales Dropdown-Menü (ein Container für alle Menüs)
    let portalDropdownEl = null;
    function ensurePortalDropdown() {
      if (!portalDropdownEl) {
        portalDropdownEl = document.createElement('div');
        portalDropdownEl.id = 'portal-dropdown';
        portalDropdownEl.style.position = 'absolute';
        portalDropdownEl.style.zIndex = '999999';
        portalDropdownEl.style.background = '#fff';
        portalDropdownEl.style.border = '1px solid #ddd';
        portalDropdownEl.style.borderRadius = '6px';
        portalDropdownEl.style.boxShadow = '0 4px 10px rgba(0,0,0,.1)';
        portalDropdownEl.style.minWidth = '240px';
        portalDropdownEl.style.maxHeight = '60vh';
        portalDropdownEl.style.overflowY = 'auto';
        portalDropdownEl.style.display = 'none';
        portalDropdownEl.setAttribute('role','menu');
        document.body.appendChild(portalDropdownEl);
        ['pointerdown','mousedown','click','touchstart'].forEach(ev => {
          portalDropdownEl.addEventListener(ev, e => e.stopPropagation());
        });
      }
      return portalDropdownEl;
    }

    function renderDropdownOptions(type) {
      const options = type === 'montageart'
        ? [
            { label: 'Aufputz-Montage', action: () => selectMontageart('Aufputz-Montage'), key: 'Aufputz-Montage' },
            { label: 'Aufputz(Feuchtraum)-Montage', action: () => selectMontageart('Aufputz(Feuchtraum)-Montage'), key: 'Aufputz(Feuchtraum)-Montage' },
            { label: 'Unterputz-Montage', action: () => selectMontageart('Unterputz-Montage'), key: 'Unterputz-Montage' },
            { label: 'Hohlwand-Montage', action: () => selectMontageart('Hohlwand-Montage'), key: 'Hohlwand-Montage' }
          ]
        : [
            { label: 'Nur Einzelteile (ohne Verdrahtung & Zubehör)', action: () => selectVerdrahtung('Nur Einzelteile (ohne Verdrahtung & Zubehör)'), key: 'Nur Einzelteile (ohne Verdrahtung & Zubehör)' },
            { label: 'Verdrahtungszubehör (ohne Vormontage & Verdrahtung)', action: () => selectVerdrahtung('Verdrahtungszubehör (ohne Vormontage & Verdrahtung)'), key: 'Verdrahtungszubehör (ohne Vormontage & Verdrahtung)' },
            { label: 'Vormontage & Verdrahtung', action: () => selectVerdrahtung('Vormontage & Verdrahtung'), key: 'Vormontage & Verdrahtung' }
          ];
      
      const portal = ensurePortalDropdown();
      portal.innerHTML = '';
      
      options.forEach(opt => {
        const item = document.createElement('div');
        item.className = 'dropdown-option';
        item.setAttribute('role','menuitem');
        item.tabIndex = 0;
        item.style.padding = '12px 16px';
        item.style.cursor = 'pointer';
        item.style.borderBottom = '1px solid #eee';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        
        // Erstelle Label-Container
        const labelContainer = document.createElement('span');
        labelContainer.textContent = opt.label;
        labelContainer.style.flex = '1';
        
        // Erstelle Preis-Container
        const priceContainer = document.createElement('span');
        priceContainer.className = 'dropdown-price';
        priceContainer.style.color = '#005A9C';
        priceContainer.style.fontWeight = '600';
        priceContainer.style.fontSize = '14px';
        priceContainer.style.marginLeft = '12px';
        priceContainer.textContent = 'Lade...';
        
        // Berechne den Preis für diese Option
        const currentRows = typeof getActualRowCount === 'function' ? getActualRowCount() : rowCounter;
        const actualRows = Math.max(1, Math.min(5, currentRows));
        const rowKey = String(actualRows);
        
        let variantId = null;
        if (type === 'montageart') {
          const variantMap = montageartVariantMap[opt.key];
          if (variantMap) {
            variantId = variantMap[rowKey];
          }
        } else {
          const variantMap = verdrahtungVariantMap[opt.key];
          if (variantMap) {
            variantId = variantMap[rowKey];
          }
        }
        
        // Lade den Preis synchron
        if (variantId) {
          try {
            const price = getVariantPrice(variantId);
            if (price > 0) {
              priceContainer.textContent = `+${price.toFixed(2)} €`;
            } else {
              priceContainer.textContent = '0,00 €';
            }
          } catch (error) {
            priceContainer.textContent = 'Preis n/a';
          }
        } else {
          priceContainer.textContent = '0,00 €';
        }
        
        item.appendChild(labelContainer);
        item.appendChild(priceContainer);
        
        item.addEventListener('mousedown', (e) => { e.stopPropagation(); opt.action(); closePortalDropdown(); });
        item.addEventListener('touchstart', (e) => { e.stopPropagation(); opt.action(); closePortalDropdown(); }, { passive: true });
        item.addEventListener('click', (e) => { e.stopPropagation(); opt.action(); closePortalDropdown(); });
        
        portal.appendChild(item);
      });
      
      if (portal.lastChild) {
        portal.lastChild.style.borderBottom = 'none';
      }
    }

    function openDropdownMenu(type, anchorBtn) {
      renderDropdownOptions(type);
      const portal = ensurePortalDropdown();
      
      // Portal-Dropdown-Positionierung
      positionPortalDropdown(portal, anchorBtn);
      
      // ARIA-Attribute setzen
      anchorBtn.setAttribute('aria-expanded', 'true');
      portal.setAttribute('aria-hidden', 'false');
      
      // Event-Listener hinzufügen
      addPortalEventListeners(portal, anchorBtn);
    }
    
    function positionPortalDropdown(portal, trigger) {
      const rect = trigger.getBoundingClientRect();
      const scrollX = window.pageXOffset;
      const scrollY = window.pageYOffset;
      const viewportWidth = window.innerWidth;
      
      // Temporär anzeigen um Breite zu messen
      portal.style.display = 'block';
      portal.style.visibility = 'hidden';
      
      // Breite messen
      const menuWidth = portal.offsetWidth;
      
      // Ideale Position berechnen (zentriert)
      const buttonCenterX = rect.left + (rect.width / 2);
      let idealLeft = buttonCenterX - (menuWidth / 2) + scrollX;
      
      // An Viewport-Grenzen klammern (8px Padding)
      const minLeft = scrollX + 8;
      const maxLeft = scrollX + viewportWidth - menuWidth - 8;
      idealLeft = Math.max(minLeft, Math.min(maxLeft, idealLeft));
      
      // Defensive max-width setzen
      portal.style.maxWidth = Math.max(220, viewportWidth - 16) + 'px';
      
      // Position setzen
      portal.style.position = 'absolute';
      portal.style.left = Math.floor(idealLeft) + 'px';
      portal.style.top = Math.floor(rect.bottom + 8 + scrollY) + 'px';
      portal.style.zIndex = '999999';
      
      // Sichtbarkeit wiederherstellen
      portal.style.visibility = 'visible';
    }
    
    function addPortalEventListeners(portal, trigger) {
      let isOpen = true;
      
      // Repositionierung bei Scroll/Resize/Orientation
      const handleReposition = () => {
        if (isOpen) {
          positionPortalDropdown(portal, trigger);
        }
      };
      
      const handleResize = () => handleReposition();
      const handleScroll = () => handleReposition();
      const handleOrientationChange = () => {
        setTimeout(handleReposition, 100);
      };
      
      // Keyboard Navigation
      const handleKeydown = (e) => {
        if (!isOpen) return;
        
        const options = portal.querySelectorAll('.dropdown-option');
        const currentFocused = document.activeElement;
        const currentIndex = Array.from(options).indexOf(currentFocused);
        
        switch (e.key) {
          case 'Escape':
            e.preventDefault();
            closePortalDropdown();
            trigger.focus();
            break;
            
          case 'ArrowDown':
            e.preventDefault();
            if (currentIndex < options.length - 1) {
              options[currentIndex + 1].focus();
            } else {
              options[0].focus();
            }
            break;
            
          case 'ArrowUp':
            e.preventDefault();
            if (currentIndex > 0) {
              options[currentIndex - 1].focus();
            } else {
              options[options.length - 1].focus();
            }
            break;
            
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (currentFocused && currentFocused.classList.contains('dropdown-option')) {
              currentFocused.click();
            }
            break;
        }
      };
      
      // Outside Click Handler
      const handleClickOutside = (e) => {
        if (!isOpen) return;
        
        if (!portal.contains(e.target) && !trigger.contains(e.target)) {
          closePortalDropdown();
        }
      };
      
      // Event-Listener hinzufügen
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('orientationchange', handleOrientationChange);
      document.addEventListener('keydown', handleKeydown);
      
      // Outside Click mit Verzögerung
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
      
      // Cleanup-Funktion speichern
      portal._cleanupPortal = () => {
        isOpen = false;
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('orientationchange', handleOrientationChange);
        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('click', handleClickOutside);
      };
      
      // Erstes Element fokussieren
      setTimeout(() => {
        const firstOption = portal.querySelector('.dropdown-option');
        if (firstOption) firstOption.focus();
      }, 0);
    }

    function closePortalDropdown() {
      const portal = ensurePortalDropdown();
      
      // Cleanup Event-Listener
      if (portal._cleanupPortal) {
        portal._cleanupPortal();
        delete portal._cleanupPortal;
      }
      
      // ARIA-Attribute zurücksetzen
      const triggers = document.querySelectorAll('#montageart-btn, #verdrahtung-btn');
      triggers.forEach(trigger => {
        trigger.setAttribute('aria-expanded', 'false');
      });
      portal.setAttribute('aria-hidden', 'true');
      
      // Portal ausblenden
      portal.style.display = 'none';
    }

    function selectMontageart(option) {
      const dropdownBtn = document.getElementById('montageart-btn');
      if (dropdownBtn) dropdownBtn.innerHTML = `<i class="fas fa-cog"></i> ${option}`;
      closePortalDropdown();
      selectedMontageart = option;
      updateInfoBox();
      updateSummary();
    }

    function selectVerdrahtung(option) {
      const dropdownBtn = document.getElementById('verdrahtung-btn');
      if (dropdownBtn) dropdownBtn.innerHTML = `<i class="fas fa-plug"></i> ${option}`;
      closePortalDropdown();
      selectedVerdrahtung = option; // Speichere die ausgewählte Option
      updateInfoBox();
      updateSummary();
    }
    
    // Keyboard-Support für Dropdown-Trigger
    function addTriggerKeyboardSupport() {
      const triggers = document.querySelectorAll('#montageart-btn, #verdrahtung-btn');
      
      triggers.forEach(trigger => {
        const handleTriggerKeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            const type = trigger.id === 'montageart-btn' ? 'montageart' : 'verdrahtung';
            openDropdownMenu(type, trigger);
          }
        };
        
        trigger.addEventListener('keydown', handleTriggerKeydown);
        
        // Cleanup-Funktion speichern
        trigger._cleanupTriggerKeyboard = () => {
          trigger.removeEventListener('keydown', handleTriggerKeydown);
        };
      });
    }

    // Outside-Close für Portal- und Reihen-Dropdowns
    document.addEventListener('pointerdown', function(event) {
      const portal = document.getElementById('portal-dropdown');
      const toggleBtn = event.target.closest('.dropdown-btn');
      if (toggleBtn) return; // Button selbst öffnet
      // Klick innerhalb eines beliebigen Reihen-Dropdowns nicht schließen
      const insideRowDropdown = event.target.closest('.dropdown');
      if (insideRowDropdown) return;
      // Klick im Portal-Dropdown nicht schließen
      if (portal && portal.contains(event.target)) return;

      // Portal schließen
      if (portal) portal.style.display = 'none';

      // Alle Reihen-Dropdowns schließen und ARIA aktualisieren
      const rowDropdowns = document.querySelectorAll('.dropdown');
      rowDropdowns.forEach(dd => {
        dd.style.display = 'none';
        dd.setAttribute('aria-hidden','true');
        const btn = dd.previousElementSibling;
        if (btn && btn.classList.contains('dropdown-btn')) {
          btn.setAttribute('aria-expanded','false');
        }
      });
    });

    function updateSummary() {
      try {
        // --- Alle Reihen zählen ---
        // Anzahl Reihen inkl. Zusatzreihe aus der tatsächlichen DOM-Zählung
        const actualRows = getActualRowCount();
        document.getElementById("summaryRowCount").textContent = String(actualRows);
        document.getElementById("summaryUsedUnits").textContent = getUsedUnits();
        // Name/Referenz aus Eingabefeld übernehmen
        const nameInput = document.getElementById('verteilerName');
        const nameValue = nameInput ? nameInput.value.trim() : '';
        const nameOut = document.getElementById('summaryVerteilerName');
        if (nameOut) nameOut.textContent = nameValue || 'Nicht angegeben';
        updateGesamtpreis();
        
        // Zweispaltige Tabelle: links Reihe, rechts die Elemente spaltenweise
        const grid = document.createElement('div');
        grid.className = 'summary-elements';
        // --- Zuerst Reihe 1 ausgeben ---
        const row1Content = document.getElementById("row1Content");
        if (row1Content) {
          const isFiBereich = Array.from(row1Content.children).some(box => {
            const img = box.querySelector('img');
            return img && img.alt === 'FI-/Leitungsschutzschalter';
          });
          const bereichTyp = isFiBereich ? 'FI-Bereich' : 'Freier Bereich';
          let reihenElemente = [];
          Array.from(row1Content.children).forEach(box => {
            const img = box.querySelector('img');
            if (img) {
              let name = img.alt;
              if (name === 'FI-/Leitungsschutzschalter') {
                const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
                const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '40';
                const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'A';
                name = `FI-/Leitungsschutzschalter ${nennstrom}A, ${charakteristik}-Charakteristik`;
              } else if (name === 'Sicherungssockel') {
                const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '';
                if (nennstrom) name = `Sicherungssockel ${nennstrom}A`;
              }
              if (name === 'Leitungsschutzschalter 1 polig' || name === 'Leitungsschutzschalter 3 polig') {
                const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
                const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '16';
                const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'B';
                name = `${name} ${nennstrom}A, ${charakteristik}-Charakteristik`;
              }
              reihenElemente.push(name);
            }
          });
          const rowBlock = document.createElement('div');
          rowBlock.className = 'summary-row ' + (isFiBereich ? 'fi' : 'free');
          const label = document.createElement('div');
          label.className = 'summary-label';
          label.textContent = `Reihe 1 (${bereichTyp})`;
          const itemsCol = document.createElement('div');
          itemsCol.className = 'summary-items';
          reihenElemente.forEach(txt => {
            const item = document.createElement('div');
            item.className = 'summary-item';
            item.textContent = txt;
            itemsCol.appendChild(item);
          });
          rowBlock.appendChild(label);
          rowBlock.appendChild(itemsCol);
          grid.appendChild(rowBlock);
        }
        // --- Dann Reihe 1 Zusatz, falls vorhanden ---
        const row1Content2 = document.getElementById('row1Content_2');
        if (row1Content2 && row1Content2.children.length > 0) {
          let reihenElemente2 = [];
          Array.from(row1Content2.children).forEach(box => {
            const img = box.querySelector('img');
            if (img) {
              let name = img.alt;
              if (name === 'FI-/Leitungsschutzschalter') {
                const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
                const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '40';
                const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'A';
                name = `FI-/Leitungsschutzschalter ${nennstrom}A, ${charakteristik}-Charakteristik`;
              } else if (name === 'Sicherungssockel') {
                const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '';
                if (nennstrom) name = `Sicherungssockel ${nennstrom}A`;
              }
              if (name === 'Leitungsschutzschalter 1 polig' || name === 'Leitungsschutzschalter 3 polig') {
                const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
                const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '16';
                const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'B';
                name = `${name} ${nennstrom}A, ${charakteristik}-Charakteristik`;
              }
              reihenElemente2.push(name);
            }
          });
          const rowBlock = document.createElement('div');
          rowBlock.className = 'summary-row free';
          const label = document.createElement('div');
          label.className = 'summary-label';
          label.textContent = `Reihe 1 Zusatz (Freier Bereich)`;
          const itemsCol = document.createElement('div');
          itemsCol.className = 'summary-items';
          reihenElemente2.forEach(txt => {
            const item = document.createElement('div');
            item.className = 'summary-item';
            item.textContent = txt;
            itemsCol.appendChild(item);
          });
          rowBlock.appendChild(label);
          rowBlock.appendChild(itemsCol);
          grid.appendChild(rowBlock);
        }
        // --- Dann alle weiteren Reihen ab 2 ---
        for (let i = 2; i <= rowCounter; i++) {
          const rowContent = document.getElementById("row" + i + "Content");
          if (rowContent) {
            const isFiBereich = Array.from(rowContent.children).some(box => {
              const img = box.querySelector('img');
              return img && img.alt === 'FI-/Leitungsschutzschalter';
            });
            const bereichTyp = isFiBereich ? 'FI-Bereich' : 'Freier Bereich';
            let reihenElemente = [];
            Array.from(rowContent.children).forEach(box => {
              const img = box.querySelector('img');
              if (img) {
                let name = img.alt;
                if (name === 'FI-/Leitungsschutzschalter') {
                  const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                  const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '40';
                  const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'A';
                  name = `FI-/Leitungsschutzschalter ${nennstrom}A, ${charakteristik}-Charakteristik`;
                } else if (name === 'Sicherungssockel') {
                  const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '';
                  if (nennstrom) name = `Sicherungssockel ${nennstrom}A`;
                }
                if (name === 'Leitungsschutzschalter 1 polig' || name === 'Leitungsschutzschalter 3 polig') {
                  const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                  const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '16';
                  const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'B';
                  name = `${name} ${nennstrom}A, ${charakteristik}-Charakteristik`;
                }
                reihenElemente.push(name);
              }
            });
            const rowBlock = document.createElement('div');
            rowBlock.className = 'summary-row ' + (isFiBereich ? 'fi' : 'free');
            const label = document.createElement('div');
            label.className = 'summary-label';
            label.textContent = `Reihe ${i} (${bereichTyp})`;
            const itemsCol = document.createElement('div');
            itemsCol.className = 'summary-items';
            reihenElemente.forEach(txt => {
              const item = document.createElement('div');
              item.className = 'summary-item';
              item.textContent = txt;
              itemsCol.appendChild(item);
            });
            rowBlock.appendChild(label);
            rowBlock.appendChild(itemsCol);
            grid.appendChild(rowBlock);
          }
        }
        // Aktualisiere die Elemente-Liste in der Zusammenfassung
        const summaryElements = document.getElementById("summaryElements");
        if (summaryElements) {
          summaryElements.innerHTML = '';
          summaryElements.appendChild(grid);
        }
        // ... bestehender Code für Montageart, Platzreserve, Verdrahtung, Position ...
        // Montageart aus neuer portalbasierten Auswahl
        const summaryMontageart = document.getElementById('summaryMontageart');
        if (summaryMontageart) {
          const actualRowsMA = getActualRowCount();
          const labelMA = selectedMontageart ? selectedMontageart : 'Nicht ausgewählt';
          summaryMontageart.textContent = `${labelMA}${labelMA !== 'Nicht ausgewählt' ? ` (für ${actualRowsMA} Reihe${actualRowsMA>1?'n':''})` : ''}`;
        }
        const summaryPlatzreserve = document.getElementById("summaryPlatzreserve");
        const platzreserveBtn = document.querySelector('#platzreserve-dropdown');
        if (summaryPlatzreserve) {
          if (platzreserveBtn && platzreserveBtn.previousElementSibling) {
            summaryPlatzreserve.textContent = platzreserveBtn.previousElementSibling.textContent.replace("Zusätzliche Platzreserve", "Nicht ausgewählt");
          } else {
            summaryPlatzreserve.textContent = "Nicht ausgewählt";
          }
        }
        const summaryVerdrahtung = document.getElementById('summaryVerdrahtung');
        if (summaryVerdrahtung) {
          const actualRowsV = getActualRowCount();
          const labelV = selectedVerdrahtung ? selectedVerdrahtung : 'Nicht ausgewählt';
          summaryVerdrahtung.textContent = `${labelV}${labelV !== 'Nicht ausgewählt' ? ` (für ${actualRowsV} Reihe${actualRowsV>1?'n':''})` : ''}`;
        }
        const summaryPosition = document.getElementById("summaryPosition");
        if (summaryPosition) {
          summaryPosition.textContent = isFirstRowAtBottom ? "Unten" : "Oben";
        }
      } catch (error) {
        console.error("Fehler beim Aktualisieren der Zusammenfassung:", error);
      }
    }

    function updateGesamtpreis() {
      let anzahl = parseInt(document.getElementById("verteilerAnzahl").value);
      if (isNaN(anzahl)) anzahl = 0;
      anzahl = Math.max(0, Math.min(10, anzahl));
      document.getElementById("verteilerAnzahl").value = anzahl;
      
      // Basispreis vereinheitlicht und mit Anzahl multipliziert
      const basis = calculateBaseSum();
      const gesamtpreis = basis * anzahl;
      document.getElementById("summaryTotalPrice").textContent = gesamtpreis.toFixed(2) + " €";
    }

    function generatePdf() {
      // Logo in Originalgröße hinzufügen
      const logoUrl = 'https://cdn.shopify.com/s/files/1/0944/8711/8089/files/ChatGPT_Image_26._Juni_2025_21_21_38.png?v=1750966699';
      const img = new Image();
      img.src = logoUrl;
      
      // Warte bis das Bild geladen ist
      img.onload = function() {
      // Erstelle ein neues PDF-Dokument
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
        let currentPage = 1;
        let yPos = 30; // Startposition für den Inhalt
        const pageHeight = 280; // Maximale Höhe pro Seite
        const margin = 20; // Seitenrand

        // Hilfsfunktion zum Prüfen und Erstellen einer neuen Seite
        function checkNewPage(requiredSpace) {
          if (yPos + requiredSpace > pageHeight) {
            doc.addPage();
            currentPage++;
            yPos = margin;
            // Entferne die einfache Seitenzahl, damit nur noch 'Seite X von Y' am Ende steht
            // doc.setFontSize(10);
            // doc.setTextColor(100, 100, 100);
            // doc.text(`Seite ${currentPage}`, 105, 280, { align: 'center' });
          }
        }

        const imgWidth = img.width;
        const imgHeight = img.height;
        const maxWidth = 65; // Maximale Breite in mm
        const scale = maxWidth / imgWidth;
        const scaledHeight = imgHeight * scale;
        
        // Berechne die Position für das Logo (rechts)
        const pageWidth = 210; // Standard A4 Breite in mm
        const logoX = pageWidth - margin - maxWidth;
        
        // Füge Logo rechts ein
        doc.addImage(logoUrl, 'PNG', logoX, 10, maxWidth, scaledHeight);
        
        // Titel linksbündig
      doc.setFontSize(20);
        doc.setTextColor(0, 90, 156); // #005A9C
        doc.text('Verteilerkonfiguration', margin, 25); // yPos angepasst für gleiche Zeile mit Logo
        yPos = 35; // Erhöhe yPos für den nächsten Inhalt

        // Erstellungsdatum und Uhrzeit
        const now = new Date();
        const dateStr = now.toLocaleDateString('de-DE');
        const timeStr = now.toLocaleTimeString('de-DE');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Erstellt am: ${dateStr} um ${timeStr}`, margin, yPos);
        yPos += 15;

      // Verteiler-Informationen
        checkNewPage(40);
      doc.setFontSize(12);
        doc.setTextColor(0, 90, 156);
        doc.text('Verteiler-Informationen', margin, yPos);
        yPos += 10;
      doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Name/Referenz: ${document.getElementById("summaryVerteilerName").textContent}`, margin, yPos);
        yPos += 10;
        doc.text(`Anzahl: ${document.getElementById("verteilerAnzahl").value}`, margin, yPos);
        yPos += 10;
        doc.text(`Position im Verteiler: ${document.getElementById("summaryPosition").textContent}`, margin, yPos);
        yPos += 15;

      // Konfiguration
        checkNewPage(40);
        doc.setFontSize(12);
        doc.setTextColor(0, 90, 156);
        doc.text('Konfiguration', margin, yPos);
        yPos += 10;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
        doc.text(`Anzahl der Reihen: ${document.getElementById("rowCount").textContent}`, margin, yPos);
        yPos += 10;
        doc.text(`Belegte Einheiten: ${document.getElementById("summaryUsedUnits").textContent}`, margin, yPos);
        yPos += 15;

      // Verwendete Elemente
        checkNewPage(40);
        doc.setFontSize(12);
        doc.setTextColor(0, 90, 156);
        doc.text('Verwendete Elemente', margin, yPos);
        yPos += 10;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
        
        const maxTextWidth = doc.internal.pageSize.getWidth() - margin * 2;
        let reihenIndex = 1;
        for (let i = 1; i <= rowCounter; i++) {
          const rowContent = document.getElementById('row' + i + 'Content');
          if (rowContent && rowContent.children.length > 0) {
            const isFiBereich = Array.from(rowContent.children).some(box => {
              const img = box.querySelector('img');
              return img && img.alt === 'FI-/Leitungsschutzschalter';
            });
            const bereichTyp = isFiBereich ? 'FI-Bereich' : 'Freier Bereich';
            let reihenElemente = [];
            Array.from(rowContent.children).forEach(box => {
              const img = box.querySelector('img');
              if (img) {
                let name = img.alt;
                if (name === 'FI-/Leitungsschutzschalter') {
                  const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                  const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '40';
                  const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'A';
                  name = `FI-/Leitungsschutzschalter ${nennstrom}A, ${charakteristik}-Charakteristik`;
                } else if (name === 'Sicherungssockel') {
                  const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '';
                  if (nennstrom) name = `Sicherungssockel ${nennstrom}A`;
                }
                if (name === 'Leitungsschutzschalter 1 polig' || name === 'Leitungsschutzschalter 3 polig') {
                  const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                  const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '16';
                  const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'B';
                  name = `${name} ${nennstrom}A, ${charakteristik}-Charakteristik`;
                }
                reihenElemente.push(name);
              }
            });
            doc.text(`Reihe ${reihenIndex} (${bereichTyp}):`, margin, yPos);
            yPos += 7;
            const elementText = reihenElemente.join('; ');
            const lines = doc.splitTextToSize(elementText, maxTextWidth - 5);
            lines.forEach(line => {
              doc.text(line, margin + 5, yPos);
              yPos += 7;
            });
            yPos += 3;
            reihenIndex++;
          }
        }
        // Zusatzreihe row1Content_2 berücksichtigen
        const row1Content2 = document.getElementById('row1Content_2');
        if (row1Content2 && row1Content2.children.length > 0) {
          let reihenElemente = [];
          Array.from(row1Content2.children).forEach(box => {
            const img = box.querySelector('img');
            if (img) {
              let name = img.alt;
              if (name === 'FI-/Leitungsschutzschalter') {
                const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
                const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '40';
                const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'A';
                name = `FI-/Leitungsschutzschalter ${nennstrom}A, ${charakteristik}-Charakteristik`;
              } else if (name === 'Sicherungssockel') {
                const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '';
                if (nennstrom) name = `Sicherungssockel ${nennstrom}A`;
              }
              if (name === 'Leitungsschutzschalter 1 polig' || name === 'Leitungsschutzschalter 3 polig') {
                const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
                const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '16';
                const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'B';
                name = `${name} ${nennstrom}A, ${charakteristik}-Charakteristik`;
              }
              reihenElemente.push(name);
            }
          });
          doc.text(`Reihe 1 Zusatz (Freier Bereich):`, margin, yPos);
          yPos += 7;
          const elementText = reihenElemente.join('; ');
          const lines = doc.splitTextToSize(elementText, maxTextWidth - 5);
          lines.forEach(line => {
            doc.text(line, margin + 5, yPos);
            yPos += 7;
          });
          yPos += 3;
        }

        

        // --- NEU: Verteilerschrank Abschnitt ---
        checkNewPage(30);
        doc.setFontSize(12);
        doc.setTextColor(0, 90, 156);
        doc.text('Verteilerschrank', margin, yPos);
        yPos += 10;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
        doc.text(`Montageart: ${document.getElementById("summaryMontageart").textContent}`, margin, yPos);
        yPos += 15;

        // --- NEU: Verdrahtung Abschnitt ---
        checkNewPage(30);
        doc.setFontSize(12);
        doc.setTextColor(0, 90, 156);
        doc.text('Verdrahtung', margin, yPos);
        yPos += 10;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
        doc.text(`Verdrahtungsoption: ${document.getElementById("summaryVerdrahtung").textContent}`, margin, yPos);
        yPos += 15;

        // Füge Seitenzahlen zu allen Seiten hinzu
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
          doc.text(`Seite ${i} von ${pageCount}`, 105, 290, { align: 'center' });
        }

      // Speichere die PDF
      doc.save('Verteiler-Konfiguration.pdf');
      };
    }

    // Gestylte PDF-Version (Brand-Layout)
    function generatePdfStyled() {
      const BRAND = { r: 0, g: 90, b: 156 };
      const GREY = { r: 100, g: 100, b: 100 };
      const BORDER = { r: 231, g: 235, b: 242 };
      const STRIPE = { r: 245, g: 248, b: 252 };
      const CARD_RADIUS = 3;
      const PADDING = 6;
      const margin = 16;
      const pageWidth = 210;
      const pageHeight = 297;

      const logoUrl = 'https://cdn.shopify.com/s/files/1/0944/8711/8089/files/ChatGPT_Image_26._Juni_2025_21_21_38.png?v=1750966699';
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = logoUrl;

      img.onload = function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        let yPos = margin;

        function setColor({ r, g, b }) { doc.setTextColor(r, g, b); doc.setDrawColor(r, g, b); }
        function setFill({ r, g, b }) { doc.setFillColor(r, g, b); }
        function line(y) { doc.line(margin, y, pageWidth - margin, y); }
        function checkNewPage(requiredSpace) {
          if (yPos + requiredSpace > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
            drawHeader();
          }
        }

        function drawHeader() {
          setColor(BORDER); doc.setLineWidth(0.3); line(yPos); yPos += 6;
          const maxLogoW = 45;
          const scale = maxLogoW / img.width;
          const logoH = img.height * scale;
          const logoX = pageWidth - margin - maxLogoW;
          doc.addImage(logoUrl, 'PNG', logoX, yPos - 2, maxLogoW, logoH);
          setColor(BRAND); doc.setFontSize(18);
          doc.text('Verteilerkonfiguration', margin, yPos + 6);
          const now = new Date();
          setColor(GREY); doc.setFontSize(10);
          doc.text(`Erstellt am: ${now.toLocaleDateString('de-DE')} um ${now.toLocaleTimeString('de-DE')}`, margin, yPos + 12);
          yPos += Math.max(logoH + 4, 18) + 6;
          setColor(BRAND); setFill(BRAND);
          doc.rect(margin, yPos, pageWidth - margin * 2, 0.8, 'F');
          yPos += 6;
        }

        function drawSectionCard(title, drawContent) {
          const minHeight = 28;
          checkNewPage(minHeight);
          const cardX = margin; const cardY = yPos; const cardW = pageWidth - margin * 2;
          setFill(STRIPE);
          doc.roundedRect(cardX, cardY, cardW, 10, CARD_RADIUS, CARD_RADIUS, 'F');
          setColor(BRAND); doc.setFontSize(12);
          doc.text(title, cardX + PADDING, cardY + 7);
          let innerY = cardY + 10 + PADDING;
          innerY = drawContent(cardX + PADDING, innerY, cardW - PADDING * 2);
          const cardH = Math.max(minHeight, (innerY + PADDING) - cardY);
          setColor(BORDER); doc.setLineWidth(0.3);
          doc.roundedRect(cardX, cardY, cardW, cardH, CARD_RADIUS, CARD_RADIUS, 'S');
          yPos = cardY + cardH + 8;
        }

        function drawKeyValue(x, y, label, value, maxWidth) {
          setColor(GREY); doc.setFontSize(10); doc.text(label, x, y);
          setColor({ r: 0, g: 0, b: 0 }); doc.setFontSize(12);
          const lines = doc.splitTextToSize(value || '-', maxWidth);
          doc.text(lines, x, y + 5);
          return y + 5 + (lines.length * 5);
        }

        function drawTable(x, y, w, columns, rows) {
          const headH = 8; let curY = y; const lineH = 5; const cellPadV = 2;
          // Header
          checkNewPage(headH + 4);
          setFill(STRIPE); setColor(BORDER); doc.setLineWidth(0.2);
          doc.rect(x, curY, w, headH, 'F');
          setColor(BRAND); doc.setFontSize(10);
          let cx = x;
          columns.forEach(col => {
            const textX = col.align === 'right' ? cx + col.width - 2 : cx + 2;
            doc.text(col.label, textX, curY + 5.5, { align: col.align || 'left' });
            cx += col.width;
          });
          curY += headH;

          // Body
          setColor({ r: 0, g: 0, b: 0 }); doc.setFontSize(10);
          rows.forEach((row, idx) => {
            // Vorbereiten: Text umbrechen je Spalte, max Zeilen ermitteln
            const wrapped = columns.map(col => {
              const val = (row[col.key] ?? '').toString();
              const lines = doc.splitTextToSize(val, Math.max(1, col.width - 4));
              return { col, lines };
            });
            const maxLines = Math.max(1, ...wrapped.map(wc => wc.lines.length));
            const rowH = maxLines * lineH + cellPadV; // dynamische Zeilenhöhe

            // Seitenumbruch falls nötig
            checkNewPage(rowH + 6);

            // Zebra-Hintergrund
            if (idx % 2 === 1) { setFill({ r: 252, g: 253, b: 255 }); doc.rect(x, curY, w, rowH, 'F'); }

            // Zellen zeichnen
            let cx2 = x;
            wrapped.forEach(wc => {
              const { col, lines } = wc;
              const textX = col.align === 'right' ? cx2 + col.width - 2 : cx2 + 2;
              const align = col.align || 'left';
              // jede Zeile separat zeichnen
              lines.forEach((ln, i) => {
                const ty = curY + 4.8 + i * lineH;
                doc.text(ln, textX, ty, { align });
              });
              cx2 += col.width;
            });

            // Untere Linie
            setColor(BORDER); doc.setLineWidth(0.2); doc.line(x, curY + rowH, x + w, curY + rowH);
            curY += rowH;
          });

          // Außenrahmen
          setColor(BORDER); doc.setLineWidth(0.3); doc.rect(x, y, w, curY - y);
          return curY;
        }

        // Header
        drawHeader();

        // Daten aus DOM
        const verteilerName = (document.getElementById('summaryVerteilerName')?.textContent || '').trim() || '—';
        const verteilerAnzahl = (document.getElementById('verteilerAnzahl')?.value || '').trim() || '—';
        const position = (document.getElementById('summaryPosition')?.textContent || '').trim() || '—';
        const rowCountText = (document.getElementById('rowCount')?.textContent || '').trim() || '—';
        const usedUnits = (document.getElementById('summaryUsedUnits')?.textContent || '').trim() || '—';
        const montageart = (document.getElementById('summaryMontageart')?.textContent || '').trim() || '—';
        const verdrahtung = (document.getElementById('summaryVerdrahtung')?.textContent || '').trim() || '—';

        const reihen = [];
        const mainRowNodes = Array.from(document.querySelectorAll('.row-content[id^="row"][id$="Content"]'))
          .filter(n => !/row1Content_2/.test(n.id))
          .map(n => ({ node: n, num: parseInt((n.id.match(/row(\d+)Content/)||[])[1]||'0', 10) }))
          .filter(r => r.num > 0 && r.node.children.length > 0)
          .sort((a,b) => a.num - b.num);

        mainRowNodes.forEach(r => {
          const rowContent = r.node;
          const isFiBereich = Array.from(rowContent.children).some(box => box.querySelector('img')?.alt === 'FI-/Leitungsschutzschalter');
          const bereichTyp = isFiBereich ? 'FI-Bereich' : 'Freier Bereich';
          const rows = []; let pos = 1;
          Array.from(rowContent.children).forEach(box => {
            const img = box.querySelector('img'); if (!img) return; let name = img.alt;
            if (name === 'FI-/Leitungsschutzschalter') {
              const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
              const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
              const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '40';
              const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'A';
              name = `FI-/Leitungsschutzschalter ${nennstrom}A, ${charakteristik}-Charakteristik`;
            } else if (name === 'Sicherungssockel') {
              const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
              const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '';
              if (nennstrom) name = `Sicherungssockel ${nennstrom}A`;
            }
            if (name === 'Leitungsschutzschalter 1 polig' || name === 'Leitungsschutzschalter 3 polig') {
              const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
              const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
              const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '16';
              const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'B';
              name = `${name} ${nennstrom}A, ${charakteristik}-Charakteristik`;
            }
            rows.push({ pos: String(pos++), element: name, qty: '1', note: '' });
          });
          reihen.push({ heading: `Reihe ${r.num} (${bereichTyp})`, rows });

          if (r.num === 1) {
            const row1Content2 = document.getElementById('row1Content_2');
            if (row1Content2 && row1Content2.children.length > 0) {
              const rows2 = []; let pos2 = 1;
              Array.from(row1Content2.children).forEach(box => {
                const img = box.querySelector('img'); if (!img) return; let name = img.alt;
                if (name === 'FI-/Leitungsschutzschalter') {
                  const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                  const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '40';
                  const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'A';
                  name = `FI-/Leitungsschutzschalter ${nennstrom}A, ${charakteristik}-Charakteristik`;
                } else if (name === 'Sicherungssockel') {
                  const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '';
                  if (nennstrom) name = `Sicherungssockel ${nennstrom}A`;
                }
                if (name === 'Leitungsschutzschalter 1 polig' || name === 'Leitungsschutzschalter 3 polig') {
                  const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
                  const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '16';
                  const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'B';
                  name = `${name} ${nennstrom}A, ${charakteristik}-Charakteristik`;
                }
                rows2.push({ pos: String(pos2++), element: name, qty: '1', note: '' });
              });
              reihen.push({ heading: `Reihe 1 Zusatz (Freier Bereich)`, rows: rows2 });
            }
          }
        });

        // Karten
        drawSectionCard('Verteiler-Informationen', (x, y, w) => {
          const colW = (w - PADDING) / 2; let yy = y;
          yy = drawKeyValue(x, yy, 'Name/Referenz*', verteilerName, colW);
          yy = drawKeyValue(x, yy + 2, 'Anzahl', verteilerAnzahl, colW);
          const rightX = x + colW + PADDING; let yRight = y;
          yRight = drawKeyValue(rightX, yRight, 'Position im Verteiler', position, colW);
          return Math.max(yy, yRight) + 2;
        });

        drawSectionCard('Konfiguration', (x, y, w) => {
          let yy = y;
          yy = drawKeyValue(x, yy, 'Anzahl der Reihen', rowCountText, w / 2);
          yy = drawKeyValue(x, yy + 2, 'Belegte Einheiten (gesamt)', usedUnits, w / 2);
          return yy;
        });

        drawSectionCard('Verteiler-Informationen', (x, y, w) => {
          const colW = (w - PADDING) / 2; let yy = y;
          yy = drawKeyValue(x, yy, 'Name/Referenz*', verteilerName, colW);
          yy = drawKeyValue(x, yy + 2, 'Anzahl', verteilerAnzahl, colW);
          const rightX = x + colW + PADDING; let yRight = y;
          yRight = drawKeyValue(rightX, yRight, 'Position im Verteiler', position, colW);
          return Math.max(yy, yRight) + 2;
        });

        drawSectionCard('Konfiguration', (x, y, w) => {
          let yy = y;
          yy = drawKeyValue(x, yy, 'Anzahl der Reihen', rowCountText, w / 2);
          yy = drawKeyValue(x, yy + 2, 'Belegte Einheiten (gesamt)', usedUnits, w / 2);
          return yy;
        });

        drawSectionCard('Verteilerschrank', (x, y, w) => drawKeyValue(x, y, 'Montageart', montageart, w));
        drawSectionCard('Verdrahtung', (x, y, w) => drawKeyValue(x, y, 'Verdrahtungsoption', verdrahtung, w));

        // Verwendete Elemente: manuell zeichnen mit zuverlässigen Seitenumbrüchen
        // Titelzeile
        checkNewPage(30);
        doc.setFontSize(12); setColor(BRAND); doc.text('Verwendete Elemente', margin, yPos);
        yPos += 10; setColor({ r: 0, g: 0, b: 0 }); doc.setFontSize(10);

        if (reihen.length === 0) { setColor(GREY); doc.setFontSize(11); doc.text('Keine Elemente ausgewählt.', margin, yPos); yPos += 6; }
        else {
          const lineH = 5.2;
          const pad = 3;
          const cardW = pageWidth - margin * 2;
          const labelW = Math.min(60, Math.max(45, cardW * 0.35));
          const gap = 3;
          const itemsX = margin + labelW + gap;
          const itemsW = cardW - labelW - gap;

          reihen.forEach(r => {
            // Zeilen (rechts) vorbereiten
            const itemLines = [];
            r.rows.forEach(item => {
              const text = `- ${item.element}`;
              const lines = doc.splitTextToSize(text, itemsW - 6);
              itemLines.push(lines);
            });
            const itemsHeight = itemLines.reduce((acc, lines) => acc + lines.length * lineH + 1.5, 0);
            const labelLines = doc.splitTextToSize(r.heading, labelW - 4);
            const labelHeight = labelLines.length * lineH + 2;
            const needed = pad + Math.max(itemsHeight, labelHeight) + pad;

            checkNewPage(needed + 8);
            // Außenrahmen
            setColor(BORDER); doc.setLineWidth(0.3); doc.rect(margin, yPos, cardW, needed);

            // Label links
            setColor({ r: 0, g: 0, b: 0 }); doc.setFontSize(11);
            let ly = yPos + pad + lineH;
            labelLines.forEach(ln => { doc.text(ln, margin + 3, ly - 1); ly += lineH; });

            // Elemente rechts (untereinander)
            doc.setFontSize(10);
            let cy = yPos + pad + 1;
            itemLines.forEach(lines => {
              let ty = cy + lineH;
              lines.forEach(ln => { doc.text(ln, itemsX + 3, ty - 1); ty += lineH; });
              cy += (lines.length * lineH) + 1.5;
            });

            yPos += needed + 6;
          });
        }

        // Entfernt doppelte Ausgabe von Verteilerschrank/Verdrahtung am Ende

        // Seitenzahlen
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i); setColor(GREY); doc.setFontSize(10);
          doc.text(`Seite ${i} von ${pageCount}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
        }

      doc.save('Verteiler-Konfiguration.pdf');
      };
    }

    // Event-Listener für den PDF-Download-Button
    document.getElementById("downloadPdf").addEventListener("click", generatePdfStyled);

    // Funktion zum Hinzufügen des festen Elements
    function addFixedProductToRow(rowNumber, product) {
      try {
        const rowContent = document.getElementById("row" + rowNumber + "Content");
        if (!rowContent) {
          throw new Error("Reihe nicht gefunden");
        }

        const productBox = document.createElement("div");
        productBox.className = "product-box fixed-product";
        productBox.dataset.size = product.size;
        productBox.dataset.productName = product.name;
        productBox.style.position = "relative";
        
        // Füge Dropdowns für FI-/Leitungsschutzschalter hinzu
        if (product.name === "FI-/Leitungsschutzschalter") {
          const dropdownsContainer = document.createElement("div");
          dropdownsContainer.className = "fi-dropdowns";
          
          // Nennstrom Dropdown
          const nennstromDropdown = document.createElement("div");
          nennstromDropdown.className = "fi-dropdown";
          nennstromDropdown.innerHTML = `
            <label for="nennstrom-${rowNumber}">Nennstrom</label>
            <select id="nennstrom-${rowNumber}">
              <option value="40">40A</option>
              <option value="63">63A</option>
            </select>
          `;
          
          // Charakteristik Dropdown
          const charakteristikDropdown = document.createElement("div");
          charakteristikDropdown.className = "fi-dropdown";
          charakteristikDropdown.innerHTML = `
            <label for="charakteristik-${rowNumber}">Charakteristik</label>
            <select id="charakteristik-${rowNumber}">
              <option value="A">A-Charakteristik</option>
              <option value="B">B-Charakteristik</option>
              <option value="F">F-Charakteristik</option>
            </select>
          `;
          
          dropdownsContainer.appendChild(nennstromDropdown);
          dropdownsContainer.appendChild(charakteristikDropdown);
          productBox.insertBefore(dropdownsContainer, productBox.firstChild);
          
          // Event-Listener für die Dropdowns
          const nennstromSelect = nennstromDropdown.querySelector('select');
          const charakteristikSelect = charakteristikDropdown.querySelector('select');
          
          // Funktion zum Aktualisieren der VariantID basierend auf der Auswahl
          function updateVariantIdAndConfig() {
            const nennstrom = nennstromSelect.value;
            const charakteristik = charakteristikSelect.value;
            // VariantIDs für verschiedene Kombinationen
            const variantMap = {
              '40-A': '55553541800201', // 40A mit A-Charakteristik
              '40-B': '55553541865737', // 40A mit B-Charakteristik
              '40-F': '55553541931273', // 40A mit F-Charakteristik
              '63-A': '55553541832969', // 63A mit A-Charakteristik
              '63-B': '55553541898505', // 63A mit B-Charakteristik
              '63-F': '55553541964041'  // 63A mit F-Charakteristik
            };
            const variantId = variantMap[`${nennstrom}-${charakteristik}`];
            if (variantId) {
              productBox.setAttribute('data-variant-id', variantId);
            }
            // Speichere die aktuelle Konfiguration IMMER in fiSchalterConfigs
            fiSchalterConfigs.set(`row${rowNumber}`, {
              nennstrom: nennstrom,
              charakteristik: charakteristik
            });
            // Aktualisiere die Zusammenfassung, falls wir auf der Zusammenfassungsseite sind
            if (currentPage === 5) {
              updateSummary();
            }
            updateInfoBox();
          }
          // Event-Listener für Änderungen
          nennstromSelect.addEventListener('change', updateVariantIdAndConfig);
          charakteristikSelect.addEventListener('change', updateVariantIdAndConfig);
          // Initial VariantID und Konfiguration setzen
          updateVariantIdAndConfig();
        } else {
          // Für andere Produkte die normale Varianten-ID setzen
          productBox.setAttribute('data-variant-id', product.variantId);
        }
        
        // Spezielle Behandlung für die Hauptleitungsklemme
        if (product.name === "Hauptleitungsklemme") {
          productBox.style.height = "215px";
          productBox.style.lineHeight = "0";
          productBox.style.width = "460px";
          productBox.style.alignSelf = "center";
        }
        
        // Erstelle den Inhalt des Produkts
        const productContent = document.createElement("div");
        productContent.className = "product-content";
        
        // Erstelle das Bild-Element
              const img = document.createElement("img");
      img.src = product.img;
      img.alt = product.name;
      img.loading = 'lazy';
      img.decoding = 'async';
        
        productContent.appendChild(img);
        productBox.appendChild(productContent);
        
        // Füge das Produkt zur Reihe hinzu
        rowContent.appendChild(productBox);
        totalUnits += product.size;
        updateInfoBox();
        updateSummary();
        
      } catch (error) {
        console.error("Fehler beim Hinzufügen des Produkts:", error);
      }
    }

    // Funktion zum Erstellen des Position-Dropdowns
    function createPositionDropdown() {
      const container = document.createElement("div");
      container.className = "konfigurator-position-container";

      const label = document.createElement("span");
      label.className = "konfigurator-position-label";
      label.textContent = "Position im Verteiler:";
      container.appendChild(label);

      const options = ["Oben", "Unten"];
      options.forEach(option => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "konfigurator-option-btn";
        btn.textContent = option;
        if (option === "Oben") btn.classList.add("selected");
        btn.addEventListener("click", function() {
          // Auswahl-Status setzen
          container.querySelectorAll('.konfigurator-option-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');

          // Position der ersten Reihe ändern
          const configurator = document.getElementById('configurator');
          const firstRowStrip = document.getElementById('row1-strip');
          const firstRow = document.getElementById('row1');
          const row1_2 = document.getElementById('row1_2');
          const produktkartenGrid = document.querySelector('.produktkarten-grid');
          const buttonContainer = document.querySelector('#configurator > div:last-child');

          if (option === "Unten") {
            isFirstRowAtBottom = true;
            // Verschiebe die erste Reihe und row1_2 (falls vorhanden) ganz nach unten, aber vor den fixierten Buttons
            // Reihenfolge: row1_2, dann row1, dann row1-strip
            // Füge zuerst firstRowStrip ein, dann firstRow, dann row1_2 (falls vorhanden)
            configurator.insertBefore(firstRowStrip, buttonContainer);
            configurator.insertBefore(firstRow, firstRowStrip);
            if (row1_2) {
              configurator.insertBefore(row1_2, firstRow);
            }
          } else {
            isFirstRowAtBottom = false;
            // Verschiebe nach oben: zuerst row1-strip, dann row1, dann (falls vorhanden) row1_2
            let insertAfter = produktkartenGrid;
            configurator.insertBefore(firstRowStrip, insertAfter.nextSibling);
            configurator.insertBefore(firstRow, firstRowStrip.nextSibling);
            if (row1_2) {
              configurator.insertBefore(row1_2, firstRow.nextSibling);
            }
          }

          // Stelle sicher, dass der Strip direkt über der Reihe ist
          if (firstRowStrip && firstRow) {
            const stripRect = firstRowStrip.getBoundingClientRect();
            const rowRect = firstRow.getBoundingClientRect();
            if (Math.abs(stripRect.bottom - rowRect.top) > 1) {
              firstRowStrip.style.marginBottom = '0';
              firstRow.style.marginTop = '0';
            }
          }
        });
        container.appendChild(btn);
      });

      return container;
    }

    function getProductId(productName) {
      // Für alle Produkte die gleiche Test-Produkt-ID zurückgeben
      return "55402957930761";
    }

    // Funktion zum Sammeln aller ausgewählten Produkte
    function getAllSelectedProducts() {
      const selectedProducts = [];
      for (let i = 1; i <= rowCounter; i++) {
        const rowContent = document.getElementById(`row${i}Content`);
        if (rowContent) {
          const productBoxes = rowContent.getElementsByClassName('product-box');
          Array.from(productBoxes).forEach(box => {
            const productName = box.querySelector('img')?.alt;
            if (productName === "FI-/Leitungsschutzschalter") {
              const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
              const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
              let nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '40';
              let charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'A';
              let variantId = '';
              if (nennstrom === '40' && charakteristik === 'A') {
                variantId = '55553541800201';
              } else if (nennstrom === '40' && charakteristik === 'B') {
                variantId = '55553541865737';
              } else if (nennstrom === '40' && charakteristik === 'F') {
                variantId = '55553541931273';
              } else if (nennstrom === '63' && charakteristik === 'A') {
                variantId = '55553541832969';
              } else if (nennstrom === '63' && charakteristik === 'B') {
                variantId = '55553541898505';
              } else if (nennstrom === '63' && charakteristik === 'F') {
                variantId = '55553541964041';
              }
              if (variantId) {
                selectedProducts.push({
                  id: parseInt(variantId),
                  quantity: 1
                });
              }
            } else if (productName === "Leitungsschutzschalter 1 polig") {
              const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
              const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
              let nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '16';
              let charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'B';
              let variantId = '';
              if (nennstrom === '6' && charakteristik === 'B') {
                variantId = '55629002014985';
              } else if (nennstrom === '10' && charakteristik === 'B') {
                variantId = '55629002047753';
              } else if (nennstrom === '13' && charakteristik === 'B') {
                variantId = '55629002080521';
              } else if (nennstrom === '16' && charakteristik === 'B') {
                variantId = '55629002113289';
              } else if (nennstrom === '20' && charakteristik === 'B') {
                variantId = '55629002146057';
              } else if (nennstrom === '25' && charakteristik === 'B') {
                variantId = '55629002178825';
              } else if (nennstrom === '32' && charakteristik === 'B') {
                variantId = '55629002211593';
              } else if (nennstrom === '6' && charakteristik === 'C') {
                variantId = '55629002244361';
              } else if (nennstrom === '10' && charakteristik === 'C') {
                variantId = '55629002277129';
              } else if (nennstrom === '13' && charakteristik === 'C') {
                variantId = '55629002309897';
              } else if (nennstrom === '16' && charakteristik === 'C') {
                variantId = '55629002342665';
              } else if (nennstrom === '20' && charakteristik === 'C') {
                variantId = '55629002375433';
              } else if (nennstrom === '25' && charakteristik === 'C') {
                variantId = '55629002408201';
              } else if (nennstrom === '32' && charakteristik === 'C') {
                variantId = '55629002440969';
              }
              if (variantId) {
                selectedProducts.push({
                  id: parseInt(variantId),
                  quantity: 1
                });
              }
            } else if (productName === "Leitungsschutzschalter 3 polig") {
              const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
              const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
              let nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '16';
              let charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'B';
              let variantId = '';
              if (nennstrom === '6' && charakteristik === 'B') {
                variantId = '55629034455305';
              } else if (nennstrom === '10' && charakteristik === 'B') {
                variantId = '55629034488073';
              } else if (nennstrom === '13' && charakteristik === 'B') {
                variantId = '55629034520841';
              } else if (nennstrom === '16' && charakteristik === 'B') {
                variantId = '55629034553609';
              } else if (nennstrom === '20' && charakteristik === 'B') {
                variantId = '55629034586377';
              } else if (nennstrom === '25' && charakteristik === 'B') {
                variantId = '55629034619145';
              } else if (nennstrom === '32' && charakteristik === 'B') {
                variantId = '55629034651913';
              } else if (nennstrom === '40' && charakteristik === 'B') {
                variantId = '55629034684681';
              } else if (nennstrom === '50' && charakteristik === 'B') {
                variantId = '55629034717449';
              } else if (nennstrom === '63' && charakteristik === 'B') {
                variantId = '55629034750217';
              } else if (nennstrom === '6' && charakteristik === 'C') {
                variantId = '55629034782985';
              } else if (nennstrom === '10' && charakteristik === 'C') {
                variantId = '55629034815753';
              } else if (nennstrom === '13' && charakteristik === 'C') {
                variantId = '55629034848521';
              } else if (nennstrom === '16' && charakteristik === 'C') {
                variantId = '55629034881289';
              } else if (nennstrom === '20' && charakteristik === 'C') {
                variantId = '55629034914057';
              } else if (nennstrom === '25' && charakteristik === 'C') {
                variantId = '55629034946825';
              } else if (nennstrom === '32' && charakteristik === 'C') {
                variantId = '55629034979593';
              } else if (nennstrom === '40' && charakteristik === 'C') {
                variantId = '55629035012361';
              } else if (nennstrom === '50' && charakteristik === 'C') {
                variantId = '55629035045129';
              } else if (nennstrom === '63' && charakteristik === 'C') {
                variantId = '55629035077897';
              }
              if (variantId) {
                selectedProducts.push({
                  id: parseInt(variantId),
                  quantity: 1
                });
              }
            } else {
              const variantId = box.getAttribute('data-variant-id');
              if (variantId && variantId !== 'undefined') {
                selectedProducts.push({
                  id: parseInt(variantId),
                  quantity: 1
                });
              }
            }
          });
        }
      }

      // Zusatzreihe row1Content_2 auch sammeln
      const row1Content2 = document.getElementById('row1Content_2');
      if (row1Content2) {
        const productBoxes2 = row1Content2.getElementsByClassName('product-box');
        Array.from(productBoxes2).forEach(box => {
          const productName = box.querySelector('img')?.alt;
          if (productName === "FI-/Leitungsschutzschalter") {
            const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
            const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
            let nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '40';
            let charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'A';
            let variantId = '';
            if (nennstrom === '40' && charakteristik === 'A') {
              variantId = '55553541800201';
            } else if (nennstrom === '40' && charakteristik === 'B') {
              variantId = '55553541865737';
            } else if (nennstrom === '40' && charakteristik === 'F') {
              variantId = '55553541931273';
            } else if (nennstrom === '63' && charakteristik === 'A') {
              variantId = '55553541832969';
            } else if (nennstrom === '63' && charakteristik === 'B') {
              variantId = '55553541898505';
            } else if (nennstrom === '63' && charakteristik === 'F') {
              variantId = '55553541964041';
            }
            if (variantId) {
              selectedProducts.push({ id: parseInt(variantId), quantity: 1 });
            }
          } else if (productName === "Leitungsschutzschalter 1 polig") {
            const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
            const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
            let nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '16';
            let charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'B';
            let variantId = '';
            if (nennstrom === '6' && charakteristik === 'B') {
              variantId = '55629002014985';
            } else if (nennstrom === '10' && charakteristik === 'B') {
              variantId = '55629002047753';
            } else if (nennstrom === '13' && charakteristik === 'B') {
              variantId = '55629002080521';
            } else if (nennstrom === '16' && charakteristik === 'B') {
              variantId = '55629002113289';
            } else if (nennstrom === '20' && charakteristik === 'B') {
              variantId = '55629002146057';
            } else if (nennstrom === '25' && charakteristik === 'B') {
              variantId = '55629002178825';
            } else if (nennstrom === '32' && charakteristik === 'B') {
              variantId = '55629002211593';
            } else if (nennstrom === '6' && charakteristik === 'C') {
              variantId = '55629002244361';
            } else if (nennstrom === '10' && charakteristik === 'C') {
              variantId = '55629002277129';
            } else if (nennstrom === '13' && charakteristik === 'C') {
              variantId = '55629002309897';
            } else if (nennstrom === '16' && charakteristik === 'C') {
              variantId = '55629002342665';
            } else if (nennstrom === '20' && charakteristik === 'C') {
              variantId = '55629002375433';
            } else if (nennstrom === '25' && charakteristik === 'C') {
              variantId = '55629002408201';
            } else if (nennstrom === '32' && charakteristik === 'C') {
              variantId = '55629002440969';
            }
            if (variantId) {
              selectedProducts.push({ id: parseInt(variantId), quantity: 1 });
            }
          } else if (productName === "Leitungsschutzschalter 3 polig") {
            const nennstromSelect = box.querySelector('select[id^="nennstrom-"]');
            const charakteristikSelect = box.querySelector('select[id^="charakteristik-"]');
            let nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '16';
            let charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'B';
            let variantId = '';
            if (nennstrom === '6' && charakteristik === 'B') {
              variantId = '55629034455305';
            } else if (nennstrom === '10' && charakteristik === 'B') {
              variantId = '55629034488073';
            } else if (nennstrom === '13' && charakteristik === 'B') {
              variantId = '55629034520841';
            } else if (nennstrom === '16' && charakteristik === 'B') {
              variantId = '55629034553609';
            } else if (nennstrom === '20' && charakteristik === 'B') {
              variantId = '55629034586377';
            } else if (nennstrom === '25' && charakteristik === 'B') {
              variantId = '55629034619145';
            } else if (nennstrom === '32' && charakteristik === 'B') {
              variantId = '55629034651913';
            } else if (nennstrom === '40' && charakteristik === 'B') {
              variantId = '55629034684681';
            } else if (nennstrom === '50' && charakteristik === 'B') {
              variantId = '55629034717449';
            } else if (nennstrom === '63' && charakteristik === 'B') {
              variantId = '55629034750217';
            } else if (nennstrom === '6' && charakteristik === 'C') {
              variantId = '55629034782985';
            } else if (nennstrom === '10' && charakteristik === 'C') {
              variantId = '55629034815753';
            } else if (nennstrom === '13' && charakteristik === 'C') {
              variantId = '55629034848521';
            } else if (nennstrom === '16' && charakteristik === 'C') {
              variantId = '55629034881289';
            } else if (nennstrom === '20' && charakteristik === 'C') {
              variantId = '55629034914057';
            } else if (nennstrom === '25' && charakteristik === 'C') {
              variantId = '55629034946825';
            } else if (nennstrom === '32' && charakteristik === 'C') {
              variantId = '55629034979593';
            } else if (nennstrom === '40' && charakteristik === 'C') {
              variantId = '55629035012361';
            } else if (nennstrom === '50' && charakteristik === 'C') {
              variantId = '55629035045129';
            } else if (nennstrom === '63' && charakteristik === 'C') {
              variantId = '55629035077897';
            }
            if (variantId) {
              selectedProducts.push({ id: parseInt(variantId), quantity: 1 });
            }
          } else {
            const variantId = box.getAttribute('data-variant-id');
            if (variantId && variantId !== 'undefined') {
              selectedProducts.push({ id: parseInt(variantId), quantity: 1 });
            }
          }
        });
      }
      
      // --- NEU: Multipliziere alle Produkte mit der Anzahl aus dem Zusammenfassungsfeld ---
      let anzahl = parseInt(document.getElementById("verteilerAnzahl").value);
      if (isNaN(anzahl)) anzahl = 0;
      anzahl = Math.max(0, Math.min(10, anzahl));
      document.getElementById("verteilerAnzahl").value = anzahl;
      
      // Montageart-Produkt zum Warenkorb hinzufügen (abhängig von Reihenanzahl)
      const montageVariantId = getMontageartVariantId();
      if (montageVariantId) {
        selectedProducts.push({
          id: parseInt(montageVariantId),
          quantity: anzahl
        });
      }
      
      // Verdrahtung zum Warenkorb hinzufügen (abhängig von Reihenanzahl)
      const verdrahtungVariantId = getVerdrahtungVariantId();
      if (verdrahtungVariantId) {
        selectedProducts.push({
          id: parseInt(verdrahtungVariantId),
          quantity: anzahl
        });
      }
      selectedProducts.forEach(item => item.quantity = anzahl);
      return selectedProducts;
    }

    // Funktion zum Hinzufügen zum Shopify-Warenkorb
    async function addToShopifyCart(items) {
      try {
        // Filtere ungültige Items heraus und stelle sicher, dass die Menge mindestens 1 ist
        const validItems = items.filter(item => item.id && !isNaN(item.id))
          .map(item => ({
            ...item,
            quantity: Math.max(1, item.quantity || 1)
          }));
        
        if (validItems.length === 0) {
          throw new Error('Keine gültigen Produkte zum Hinzufügen gefunden');
        }
        
        // Sammle die Reiheninformationen
        // Reihenfolge wie gewünscht/auf der Zusammenfassungsseite
        const reihenInfo = {};
        // Anzahl (Menge)
        const qtyEl = document.getElementById('verteilerAnzahl');
        const qtyVal = qtyEl ? String(Math.max(0, Math.min(10, parseInt(qtyEl.value) || 0))) : '1';
        reihenInfo["Anzahl"] = qtyVal;
        // Name/Referenz
        const nameOutEl = document.getElementById('summaryVerteilerName');
        reihenInfo["Name/Referenz"] = (nameOutEl?.textContent || 'Nicht angegeben').trim();
        // Position im Verteiler
        const posEl = document.getElementById('summaryPosition');
        reihenInfo["Position im Verteiler"] = (posEl?.textContent || '').trim() || '—';
        // Anzahl Reihen
        reihenInfo["Anzahl Reihen"] = String(getActualRowCount());
        // Belegte Einheiten
        const usedUnitsEl = document.getElementById('summaryUsedUnits');
        reihenInfo["Belegte Einheiten"] = (usedUnitsEl?.textContent || '').trim() || '0';
        // Montageart
        reihenInfo["Montageart"] = selectedMontageart ? selectedMontageart : 'Nicht ausgewählt';
        // Verdrahtungsoption
        reihenInfo["Verdrahtungsoption"] = selectedVerdrahtung ? selectedVerdrahtung : 'Nicht ausgewählt';

        // Durchlaufe alle Reihen und sammle die Elemente (nur reihenbezogen)
        for (let i = 1; i <= rowCounter; i++) {
          const rowContent = document.getElementById(`row${i}Content`);
          // Korrigiertes ID-Target für Zusatzreihe von Reihe 1
          const row1_2Content = document.getElementById('row1Content_2');
          
          // Sammle Elemente aus der Hauptreihe
          const elements = [];
          if (rowContent) {
            Array.from(rowContent.children).forEach(productBox => {
              const productName = productBox.querySelector('img')?.alt;
              if (productName) {
                if (productName === "FI-/Leitungsschutzschalter") {
                  const nennstromSelect = productBox.querySelector('select[id^="nennstrom-"]');
                  const charakteristikSelect = productBox.querySelector('select[id^="charakteristik-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '40';
                  const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'A';
                  const label = `1x FI-/Leitungsschutzschalter ${nennstrom}A, ${charakteristik}-Charakteristik`;
                  elements.push(label);
                } else if (productName === "Leitungsschutzschalter 1 polig") {
                  const nennstromSelect = productBox.querySelector('select[id^="nennstrom-"]');
                  const charakteristikSelect = productBox.querySelector('select[id^="charakteristik-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '16';
                  const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'B';
                  const label = `1x Leitungsschutzschalter 1 polig ${nennstrom}A, ${charakteristik}-Charakteristik`;
                  elements.push(label);
                } else if (productName === "Leitungsschutzschalter 3 polig") {
                  const nennstromSelect = productBox.querySelector('select[id^="nennstrom-"]');
                  const charakteristikSelect = productBox.querySelector('select[id^="charakteristik-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '16';
                  const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'B';
                  const label = `1x Leitungsschutzschalter 3 polig ${nennstrom}A, ${charakteristik}-Charakteristik`;
                  elements.push(label);
                } else if (productName === "Sicherungssockel") {
                  const nennstromSelect = productBox.querySelector('select[id^="nennstrom-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '';
                  const label = `1x Sicherungssockel${nennstrom ? ' ' + nennstrom + 'A' : ''}`;
                  elements.push(label);
                } else {
                  const label = `1x ${productName}`;
                  elements.push(label);
                }
              }
            });
          }

          // Wenn es sich um Reihe 1 handelt und row1_2 existiert, füge deren Elemente hinzu
          if (i === 1 && row1_2Content) {
            Array.from(row1_2Content.children).forEach(productBox => {
              const productName = productBox.querySelector('img')?.alt;
              if (productName) {
                if (productName === "FI-/Leitungsschutzschalter") {
                  const nennstromSelect = productBox.querySelector('select[id^="nennstrom-"]');
                  const charakteristikSelect = productBox.querySelector('select[id^="charakteristik-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '40';
                  const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'A';
                  const label = `1x FI-/Leitungsschutzschalter ${nennstrom}A, ${charakteristik}-Charakteristik`;
                  elements.push(label);
                } else if (productName === "Leitungsschutzschalter 1 polig") {
                  const nennstromSelect = productBox.querySelector('select[id^="nennstrom-"]');
                  const charakteristikSelect = productBox.querySelector('select[id^="charakteristik-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '16';
                  const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'B';
                  const label = `1x Leitungsschutzschalter 1 polig ${nennstrom}A, ${charakteristik}-Charakteristik`;
                  elements.push(label);
                } else if (productName === "Leitungsschutzschalter 3 polig") {
                  const nennstromSelect = productBox.querySelector('select[id^="nennstrom-"]');
                  const charakteristikSelect = productBox.querySelector('select[id^="charakteristik-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '16';
                  const charakteristik = charakteristikSelect ? charakteristikSelect.value.trim() : 'B';
                  const label = `1x Leitungsschutzschalter 3 polig ${nennstrom}A, ${charakteristik}-Charakteristik`;
                  elements.push(label);
                } else if (productName === "Sicherungssockel") {
                  const nennstromSelect = productBox.querySelector('select[id^="nennstrom-"]');
                  const nennstrom = nennstromSelect ? nennstromSelect.value.trim() : '';
                  const label = `1x Sicherungssockel${nennstrom ? ' ' + nennstrom + 'A' : ''}`;
                  elements.push(label);
                } else {
                  const label = `1x ${productName}`;
                  elements.push(label);
                }
              }
            });
          }

          if (elements.length > 0) {
            // Bestimme den Bereichstyp
            const isFiBereich = elements.some(element => 
              element.includes('FI-/Leitungsschutzschalter') || 
              element.includes('Leitungsschutzschalter 1 polig') || 
              element.includes('Leitungsschutzschalter 3 polig')
            );
            const bereichTyp = isFiBereich ? " - FI-Bereich" : " - Freier Bereich";
            const reihenKey = `Reihe ${i}${bereichTyp}`;
            const reihenValue = elements.join(", ");
            reihenInfo[reihenKey] = reihenValue;
          }
        }

        // Keine globale Zusammenfassung – nur reihenbezogene Einträge
        // Bereits oben gesetzt: Montageart und Verdrahtungsoption
        
        // Füge die Produkte zum Warenkorb hinzu
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            items: validItems
          }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(`Fehler beim Hinzufügen zum Warenkorb: ${responseData.message || 'Unbekannter Fehler'}`);
        }

        // Speichere die Reiheninformationen als Cart-Attribute
        await fetch("/cart/update.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attributes: reihenInfo
          })
        });

        // Weiterleitung zum Warenkorb
        window.location.href = '/cart';
      } catch (error) {
        console.error('Fehler beim Hinzufügen zum Warenkorb:', error);
        showError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      }
    }

    // Bestehende addToCart Funktion überschreiben
    function addToCart() {
      const selectedProducts = getAllSelectedProducts();
      if (selectedProducts.length > 0) {
        addToShopifyCart(selectedProducts);
      } else {
        showWarning('Bitte wählen Sie mindestens ein Produkt aus.', 'Keine Produkte ausgewählt');
      }
    }

    // Füge die neue Funktion für die Markenauswahl hinzu
    function selectMarke(option) {
      const dropdownBtn = document.querySelector('#markenauswahl-dropdown').previousElementSibling;
      dropdownBtn.innerHTML = `<i class="fas fa-tag"></i> ${option}`;
      document.getElementById('markenauswahl-dropdown').style.display = 'none';
      
      // Speichere die ausgewählte Marke für spätere Verwendung
      selectedMarke = option;
      
      // Aktualisiere die Zusammenfassung, falls wir auf der Zusammenfassungsseite sind
      if (currentPage === 5) {
        updateSummary();
      }
    }

    // ... existing code ...
    function addElementToFirstRow(element) {
      const rowContent = document.getElementById("row1Content");
      if (!rowContent) return;

      // Wenn es sich um die Hauptleitungsklemme handelt, füge sie immer an erster Stelle ein
      if (element.name === "Hauptleitungsklemme") {
        // Entferne zuerst die alte Hauptleitungsklemme, falls vorhanden
        Array.from(rowContent.children).forEach(box => {
          if (box.querySelector('img')?.alt === "Hauptleitungsklemme") {
            box.remove();
          }
        });
        // Erstelle das neue Element
        const productBox = createProductBox(element);
        // Füge die neue Hauptleitungsklemme am Anfang ein
        rowContent.insertBefore(productBox, rowContent.firstChild);
        totalUnits += element.size;
        updateInfoBox();
        updateSummary();
        return;
      }

      // Prüfe, ob das Element in Sektion A gehört
      const sectionAElements = ["Hauptleitungsklemme", "Unterzähler", "Überspannungsschutz", "Hauptschalter"];
      if (sectionAElements.includes(element.name)) {
        // Für andere Elemente: Bestimme die richtige Position basierend auf der Reihenfolge
        const elementIndex = sectionAElements.indexOf(element.name);
        
        if (elementIndex === -1) {
          // Wenn es kein spezielles Element ist, füge es am Ende hinzu
          const productBox = createProductBox(element);
          rowContent.appendChild(productBox);
        } else {
          // Finde die richtige Position für das spezielle Element
          let insertBefore = null;
          for (let i = elementIndex + 1; i < sectionAElements.length; i++) {
            const nextElement = Array.from(rowContent.children).find(box => 
              box.querySelector('img')?.alt === sectionAElements[i]
            );
            if (nextElement) {
              insertBefore = nextElement;
              break;
            }
          }
          
          const productBox = createProductBox(element);
          if (insertBefore) {
            rowContent.insertBefore(productBox, insertBefore);
          } else {
            rowContent.appendChild(productBox);
          }
        }
        totalUnits += element.size;
        updateInfoBox();
        updateSummary();
      }
    }

    function createProductBox(element) {
      const productBox = document.createElement("div");
      productBox.className = "product-box";
      productBox.setAttribute("data-size", element.size);
      productBox.setAttribute("data-product-name", element.name);
      productBox.setAttribute("data-variant-id", element.variantId);
      
      // Markiere bestimmte Elemente als feste Elemente
      const fixedElements = [
        "FI-/Leitungsschutzschalter",
        "Hauptleitungsklemme",
        "Hauptschalter",
        "Unterzähler",
        "Überspannungsschutz"
      ];
      
      if (fixedElements.includes(element.name)) {
        productBox.classList.add('fixed-product');
        productBox.style.cursor = "not-allowed";
      } else {
        productBox.style.cursor = "move";
      }
      
      productBox.style.position = "relative";

      // Füge Dropdowns basierend auf dem Produkttyp hinzu
      if (element.name === "FI-/Leitungsschutzschalter") {
        addFiDropdowns(productBox, element);
      } else if (element.name === "Leitungsschutzschalter 1 polig") {
        addLss1pDropdowns(productBox, element);
      } else if (element.name === "Leitungsschutzschalter 3 polig") {
        addLss3pDropdowns(productBox, element);
      } else if (element.name === "Sicherungssockel") {
        addSicherungssockelDropdowns(productBox, element);
      }

      // Drag-&-Drop-Handle (nur für nicht-feste Produkte)
      if (!productBox.classList.contains('fixed-product')) {
        const dragHandle = document.createElement('button');
        dragHandle.className = 'action-icon move-icon';
        dragHandle.innerHTML = '<i class="fas fa-up-down-left-right"></i>';
        dragHandle.title = 'Verschieben';
        dragHandle.style.position = 'absolute';
        dragHandle.style.top = '0';
        dragHandle.style.right = '0';
        dragHandle.style.background = 'none';
        dragHandle.style.border = 'none';
        dragHandle.style.cursor = 'move';
        dragHandle.style.padding = '4px';
        dragHandle.style.zIndex = '1000';
        dragHandle.addEventListener('mousedown', startDragging.bind(productBox));
        dragHandle.addEventListener('touchstart', startDragging.bind(productBox));
        productBox.appendChild(dragHandle);
      }

      // Lösche-Button (nur für nicht-feste Produkte)
      if (!productBox.classList.contains('fixed-product')) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-icon delete-icon';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Entfernen';
        deleteBtn.style.position = 'absolute';
        deleteBtn.style.top = '0';
        deleteBtn.style.left = '0';
        deleteBtn.style.background = 'none';
        deleteBtn.style.border = 'none';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.padding = '4px';
        deleteBtn.style.zIndex = '1000';
        deleteBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          let parent = productBox.parentNode;
          while (parent && !parent.classList.contains('row-content')) {
            parent = parent.parentNode;
          }
          if (parent) {
            const rowId = parent.id;
            const rowNumber = parseInt(rowId.replace(/\D/g, ''));
            removeProductFromRow(rowNumber, productBox);
          }
        });
        productBox.appendChild(deleteBtn);
      }

      const productContent = document.createElement("div");
      productContent.className = "product-content";

      const img = document.createElement("img");
      img.src = element.img;
      img.alt = element.name;
      img.loading = 'lazy';
      img.decoding = 'async';

      productContent.appendChild(img);
      productBox.appendChild(productContent);

      return productBox;
    }

    // ... existing code ...
    function removeElement(variantId) {
      
      
      // Suche in row1Content
      const row1Content = document.getElementById('row1Content');
      if (row1Content) {
        const element = row1Content.querySelector(`[data-variant-id="${variantId}"]`);
        if (element) {
          
          const size = parseFloat(element.dataset.size) || 0;
          element.remove();
          totalUnits -= size;
          updateInfoBox();
          manageRow1Content2();
          return;
        }
      }
      
      // Suche in row1Content_2
      const row1Content2 = document.getElementById('row1Content_2');
      if (row1Content2) {
        const element = row1Content2.querySelector(`[data-variant-id="${variantId}"]`);
        if (element) {
          
          const size = parseFloat(element.dataset.size) || 0;
          element.remove();
          totalUnits -= size;
          updateInfoBox();
          
          
          // Überprüfe, ob row1Content_2 jetzt leer ist
          if (row1Content2.children.length === 0) {
            const row1_2 = document.getElementById('row1_2');
            if (row1_2) {
              
              row1_2.remove();
            }
          }
          return;
        }
      }
      
      
    }

    // ... existing code ...
    // Funktion zum Überprüfen und Verwalten der row1Content_2
    function manageRow1Content2() {
      const row1Content = document.getElementById('row1Content');
      const row1Content2 = document.getElementById('row1Content_2');
      const row1_2 = document.getElementById('row1_2');
      
      if (!row1Content) return;
      
      // Berechne den belegten Platz in row1Content
      let occupiedSpace = 0;
      Array.from(row1Content.children).forEach(box => {
        occupiedSpace += parseFloat(box.dataset.size) || 0;
      });

      // Wenn row1Content voll ist und row1Content_2 noch nicht existiert
      if (occupiedSpace >= 12 && !row1Content2) {
        // Erstelle den Container für die zweite Reihe
        const rowContainer = document.createElement('div');
        rowContainer.id = 'row1_2';
        rowContainer.className = 'row-container';
        rowContainer.style.display = 'block';
        
        // Erstelle die neue Reihe
        const newRowContent = document.createElement('div');
        newRowContent.id = 'row1Content_2';
        newRowContent.className = 'row-content';
        newRowContent.style.display = 'block';
        
        // Füge row1Content_2 in den Container ein
        rowContainer.appendChild(newRowContent);
        
        // Füge den Container direkt nach row1 ein
        const row1 = document.getElementById('row1');
        if (row1) {
          row1.parentNode.insertBefore(rowContainer, row1.nextSibling);
          
        }
        // Variable nach dem Einfügen neu setzen
        row1Content2 = document.getElementById('row1Content_2');
      }

      // Wenn row1Content_2 existiert, prüfe ob sie leer ist
      if (row1Content2 && row1Content2.children.length === 0) {
        
        if (row1_2) {
          row1_2.remove();
        }
      }
    }

    // Aktualisiere die checkAndMoveElements Funktion
    function checkAndMoveElements() {
      const row1Content = document.getElementById('row1Content');
      const row1Content2 = document.getElementById('row1Content_2');
      
      if (!row1Content) {
        return;
      }
      
      if (!row1Content2) {
        return;
      }
      
      // Berechne den verfügbaren Platz in row1Content
      let occupiedSpace = 0;
      Array.from(row1Content.children).forEach(box => {
        const boxSize = parseFloat(box.dataset.size) || 0;
          occupiedSpace += boxSize;
      });
      
      const availableSpace = 12 - occupiedSpace;

      if (availableSpace <= 0) {
        return;
      }

      // Sammle alle Elemente aus row1Content_2
      const elementsToCheck = Array.from(row1Content2.children);

      // Prüfe jedes Element in row1Content_2
      elementsToCheck.forEach(box => {
        const boxSize = parseFloat(box.dataset.size) || 0;
        
        // Prüfe, ob das Element in den verfügbaren Platz passt
        if (boxSize <= availableSpace && (occupiedSpace + boxSize) <= 12) {
          row1Content.appendChild(box);
          occupiedSpace += boxSize;
        }
      });

      // Überprüfe, ob row1Content_2 jetzt leer ist
      if (row1Content2.children.length === 0) {
        const row1_2 = document.getElementById('row1_2');
        if (row1_2) {
          row1_2.remove();
        }
      }
    }

    // Aktualisiere removeProductFromRow
    function removeProductFromRow(rowNumber, productBox) {
      try {
        const rowContent = document.getElementById("row" + rowNumber + "Content");
        if (!rowContent) {
          throw new Error("Reihe nicht gefunden");
        }

        const size = parseFloat(productBox.dataset.size) || 0;
        
        // Berechne den belegten Platz vor dem Entfernen
        let beforeSpace = 0;
        Array.from(rowContent.children).forEach(box => {
          beforeSpace += parseFloat(box.dataset.size) || 0;
        });
        
        productBox.remove();
        totalUnits -= size;
        updateInfoBox();
        updateSummary();

        // Berechne den belegten Platz nach dem Entfernen
        let afterSpace = 0;
        Array.from(rowContent.children).forEach(box => {
          afterSpace += parseFloat(box.dataset.size) || 0;
        });

        // Wenn ein Element aus row1Content entfernt wurde, prüfe ob Elemente verschoben werden können
        if (rowNumber === 1 && rowContent.id === "row1Content") {
          checkAndMoveElements();
        }
      } catch (error) {
        console.error("Fehler beim Entfernen des Produkts:", error.message);
      }
    }

    // Aktualisiere addElementToSectionA
    function addElementToSectionA(element) {
      const row1Content = document.getElementById('row1Content');
      if (!row1Content) return;

      // Prüfe, ob das Element schon existiert
      let row1Content2 = document.getElementById('row1Content_2');
      if (
        Array.from(row1Content.children).some(box => box.querySelector('img')?.alt === element.name) ||
        (row1Content2 && Array.from(row1Content2.children).some(box => box.querySelector('img')?.alt === element.name))
      ) {
        return;
      }

      // Erstelle das Produkt-Box-Element
      const productBox = document.createElement('div');
      productBox.className = 'product-box';
      productBox.dataset.size = element.size;
      productBox.dataset.variantId = element.variantId;

      const productContent = document.createElement('div');
      productContent.className = 'product-content';

      const img = document.createElement('img');
      img.src = element.img;
      img.alt = element.name;
      img.onload = function() {
        productBox.classList.add('loaded');
      };
      img.loading = 'lazy';
      img.decoding = 'async';

      productContent.appendChild(img);
      productBox.appendChild(productContent);

      // Berechne belegten Platz in row1Content
      let occupiedSpace = 0;
      Array.from(row1Content.children).forEach(box => {
        occupiedSpace += parseFloat(box.dataset.size) || 0;
      });

      if (occupiedSpace + parseFloat(element.size) <= 12) {
        row1Content.appendChild(productBox);
        totalUnits += parseFloat(element.size);
        updateInfoBox();
        updateSummary();
        return;
      }

      // --- HIER: row1Content_2 und Container erstellen, falls nicht vorhanden ---
      row1Content2 = document.getElementById('row1Content_2');
        if (!row1Content2) {
        const rowContainer = document.createElement('div');
        rowContainer.id = 'row1_2';
        rowContainer.className = 'row-container';
        rowContainer.style.display = 'block';

          row1Content2 = document.createElement('div');
          row1Content2.id = 'row1Content_2';
          row1Content2.className = 'row-content';
          row1Content2.style.display = 'block';
          
        rowContainer.appendChild(row1Content2);

        const row1 = document.getElementById('row1');
        if (row1) {
          if (isFirstRowAtBottom) {
            // Wenn Position "Unten" ist, füge row1_2 VOR row1 ein
            row1.parentNode.insertBefore(rowContainer, row1);
          } else {
            // Wenn Position "Oben" ist, füge row1_2 NACH row1 ein
            row1.parentNode.insertBefore(rowContainer, row1.nextSibling);
          }
        }
        // Variable nach dem Einfügen neu setzen
        row1Content2 = document.getElementById('row1Content_2');
      }

      // Berechne belegten Platz in row1Content_2
        let occupiedSpace2 = 0;
        Array.from(row1Content2.children).forEach(box => {
          occupiedSpace2 += parseFloat(box.dataset.size) || 0;
        });
        
        if (occupiedSpace2 + parseFloat(element.size) <= 12) {
          row1Content2.appendChild(productBox);
        totalUnits += parseFloat(element.size);
        updateInfoBox();
        updateSummary();
        return;
        } else {
        showWarning('Kein Platz mehr verfügbar!', 'Bereich voll');
          return;
        }
    }

    // Funktion zum Entfernen der zweiten Reihe, wenn sie leer ist
    function removeEmptyRow1_2() {
      const row1Content2 = document.getElementById('row1Content_2');
      const row1_2 = document.getElementById('row1_2');
      
      if (row1Content2 && row1Content2.children.length === 0) {
        if (row1_2) row1_2.remove();
      }
    }

    function addLss1pDropdowns(productBox, element) {
      const dropdownsContainer = document.createElement("div");
      dropdownsContainer.className = "lss-1p-dropdowns";
      
      const dropdown = document.createElement("div");
      dropdown.className = "lss-1p-dropdown";
      dropdown.innerHTML = `
        <select id="nennstrom-${Date.now()}">
          <option value="6">6A</option>
          <option value="10">10A</option>
          <option value="13">13A</option>
          <option value="16" selected>16A</option>
          <option value="20">20A</option>
          <option value="25">25A</option>
          <option value="32">32A</option>
        </select>
        <select id="charakteristik-${Date.now()}">
          <option value="B" selected>B-Charakteristik</option>
          <option value="C">C-Charakteristik</option>
        </select>
      `;
      
      dropdownsContainer.appendChild(dropdown);
      productBox.insertBefore(dropdownsContainer, productBox.firstChild);
      
      const nennstromSelect = dropdown.querySelector('select[id^="nennstrom-"]');
      const charakteristikSelect = dropdown.querySelector('select[id^="charakteristik-"]');
      
      function updateVariantIdAndConfig() {
        const nennstrom = nennstromSelect.value;
        const charakteristik = charakteristikSelect.value;
        const variantMap = {
          '6-B': '55629002014985',
          '10-B': '55629002047753',
          '13-B': '55629002080521',
          '16-B': '55629002113289',
          '20-B': '55629002146057',
          '25-B': '55629002178825',
          '32-B': '55629002211593',
          '6-C': '55629002244361',
          '10-C': '55629002277129',
          '13-C': '55629002309897',
          '16-C': '55629002342665',
          '20-C': '55629002375433',
          '25-C': '55629002408201',
          '32-C': '55629002440969'
        };
        const variantId = variantMap[`${nennstrom}-${charakteristik}`];
        if (variantId) {
          productBox.setAttribute('data-variant-id', variantId);
        }
        if (currentPage === 5) {
          updateSummary();
        }
        updateInfoBox();
      }
      
      nennstromSelect.addEventListener('change', updateVariantIdAndConfig);
      charakteristikSelect.addEventListener('change', updateVariantIdAndConfig);
      updateVariantIdAndConfig();
    }

    function addLss3pDropdowns(productBox, element) {
      const dropdownsContainer = document.createElement("div");
      dropdownsContainer.className = "lss-3p-dropdowns";
      
      const dropdown = document.createElement("div");
      dropdown.className = "lss-3p-dropdown";
      dropdown.innerHTML = `
        <select id="nennstrom-${Date.now()}">
          <option value="6">6A</option>
          <option value="10">10A</option>
          <option value="13">13A</option>
          <option value="16" selected>16A</option>
          <option value="20">20A</option>
          <option value="25">25A</option>
          <option value="32">32A</option>
          <option value="40">40A</option>
          <option value="50">50A</option>
          <option value="63">63A</option>
        </select>
        <select id="charakteristik-${Date.now()}">
          <option value="B" selected>B-Charakteristik</option>
          <option value="C">C-Charakteristik</option>
        </select>
      `;
      
      dropdownsContainer.appendChild(dropdown);
      productBox.insertBefore(dropdownsContainer, productBox.firstChild);
      
      const nennstromSelect = dropdown.querySelector('select[id^="nennstrom-"]');
      const charakteristikSelect = dropdown.querySelector('select[id^="charakteristik-"]');
      
      function updateVariantIdAndConfig() {
        const nennstrom = nennstromSelect.value;
        const charakteristik = charakteristikSelect.value;
        const variantMap = {
          '6-B': '55629034455305',
          '10-B': '55629034488073',
          '13-B': '55629034520841',
          '16-B': '55629034553609',
          '20-B': '55629034586377',
          '25-B': '55629034619145',
          '32-B': '55629034651913',
          '40-B': '55629034684681',
          '50-B': '55629034717449',
          '63-B': '55629034750217',
          '6-C': '55629034782985',
          '10-C': '55629034815753',
          '13-C': '55629034848521',
          '16-C': '55629034881289',
          '20-C': '55629034914057',
          '25-C': '55629034946825',
          '32-C': '55629034979593',
          '40-C': '55629035012361',
          '50-C': '55629035045129',
          '63-C': '55629035077897'
        };
        const variantId = variantMap[`${nennstrom}-${charakteristik}`];
        if (variantId) {
          productBox.setAttribute('data-variant-id', variantId);
        }
        if (currentPage === 5) {
          updateSummary();
        }
        updateInfoBox();
      }
      
      nennstromSelect.addEventListener('change', updateVariantIdAndConfig);
      charakteristikSelect.addEventListener('change', updateVariantIdAndConfig);
      updateVariantIdAndConfig();
    }

    function addSicherungssockelDropdowns(productBox, element) {
      const dropdownsContainer = document.createElement("div");
      dropdownsContainer.className = "lss-1p-dropdowns";

      const dropdown = document.createElement("div");
      dropdown.className = "lss-1p-dropdown";
      const uid = Date.now();
      dropdown.innerHTML = `
        <label for="nennstrom-${uid}" style="width:100px;text-align:left;margin:0 0 0 0;font-size:13px;">Nennstrom</label>
        <select id="nennstrom-${uid}">
          <option value="20">20A</option>
          <option value="25">25A</option>
          <option value="35">35A</option>
          <option value="40" selected>40A</option>
          <option value="50">50A</option>
          <option value="63">63A</option>
        </select>
      `;
      // Stelle sicher, dass Label und Select nebeneinander stehen
      dropdown.style.flexDirection = 'row';
      dropdown.style.alignItems = 'center';
      dropdown.style.gap = '0px';
      dropdown.style.marginTop = '25px';
      // Breite analog FI-Dropdowns
      dropdownsContainer.style.width = 'auto';
      dropdownsContainer.style.minWidth = '200px';
      // 5px nach unten verschieben (kompatibel zur bestehenden translate-Zentrierung)
      dropdownsContainer.style.top = '50%';
      dropdownsContainer.style.transform = 'translate(-50%, calc(-50% + 5px))';

      dropdownsContainer.appendChild(dropdown);
      productBox.insertBefore(dropdownsContainer, productBox.firstChild);

      const nennstromSelect = dropdown.querySelector('select[id^="nennstrom-"]');
      // Select-Style analog FI
      if (nennstromSelect) {
        nennstromSelect.style.height = '28px';
        nennstromSelect.style.fontSize = '13px';
        nennstromSelect.style.minWidth = '80px';
        nennstromSelect.style.flex = '1';
      }

      function updateVariantIdAndConfig() {
        const nennstrom = nennstromSelect.value;
        // Platzhalter-Mapping: vorerst alle Werte auf die Standard-Variante,
        // bis echte Variant-IDs vorliegen
        const variantMap = {
          '20': '56075256660233',
          '25': '56075256693001',
          '35': '56075256725769',
          '40': '56075256758537',
          '50': '56075256791305',
          '63': '56075256824073'
        };
        const variantId = variantMap[nennstrom];
        if (variantId) {
          productBox.setAttribute('data-variant-id', variantId);
        }
        productBox.setAttribute('data-nennstrom', nennstrom);
        if (typeof currentPage !== 'undefined' && currentPage === 5) {
          updateSummary();
        }
        updateInfoBox();
      }

      nennstromSelect.addEventListener('change', updateVariantIdAndConfig);
      updateVariantIdAndConfig();
    }

    // ... existing code ...
    function removeElement(variantId) {
      
      // Suche in row1Content
      const row1Content = document.getElementById('row1Content');
      if (row1Content) {
        const element = row1Content.querySelector(`[data-variant-id="${variantId}"]`);
        if (element) {
          const size = parseFloat(element.dataset.size) || 0;
          element.remove();
          totalUnits -= size;
          updateInfoBox();
          manageRow1Content2();
          return;
        }
      }
      
      // Suche in row1Content_2
      const row1Content2 = document.getElementById('row1Content_2');
      if (row1Content2) {
        const element = row1Content2.querySelector(`[data-variant-id="${variantId}"]`);
        if (element) {
          const size = parseFloat(element.dataset.size) || 0;
          element.remove();
          totalUnits -= size;
          updateInfoBox();
          
          
          // Überprüfe, ob row1Content_2 jetzt leer ist
          if (row1Content2.children.length === 0) {
            const row1_2 = document.getElementById('row1_2');
            if (row1_2) {
              row1_2.remove();
            }
          }
          return;
        }
      }
      
    }

    // ... existing code ...
    // Funktion zum Überprüfen und Verwalten der row1Content_2
    function manageRow1Content2() {
      const row1Content = document.getElementById('row1Content');
      const row1Content2 = document.getElementById('row1Content_2');
      const row1_2 = document.getElementById('row1_2');

      if (!row1Content) return;

      // Berechne den belegten Platz in row1Content
      let occupiedSpace = 0;
      Array.from(row1Content.children).forEach(box => {
        occupiedSpace += parseFloat(box.dataset.size) || 0;
      });

      // Wenn row1Content voll ist und row1Content_2 noch nicht existiert
      if (occupiedSpace >= 12 && !row1Content2) {
        // Erstelle den Container für die zweite Reihe
        const rowContainer = document.createElement('div');
        rowContainer.id = 'row1_2';
        rowContainer.className = 'row-container';
        rowContainer.style.display = 'block';
        
        // Erstelle die neue Reihe
        const newRowContent = document.createElement('div');
        newRowContent.id = 'row1Content_2';
        newRowContent.className = 'row-content';
        newRowContent.style.display = 'block';
        
        // Füge row1Content_2 in den Container ein
        rowContainer.appendChild(newRowContent);
        
        // Füge den Container an der richtigen Position ein (berücksichtige "Unten" Position)
        const row1 = document.getElementById('row1');
        if (row1) {
          if (isFirstRowAtBottom) {
            // Wenn Position "Unten" ist, füge row1_2 VOR row1 ein
            row1.parentNode.insertBefore(rowContainer, row1);
          } else {
            // Wenn Position "Oben" ist, füge row1_2 NACH row1 ein
            row1.parentNode.insertBefore(rowContainer, row1.nextSibling);
          }
        }
        // Variable nach dem Einfügen neu setzen
        row1Content2 = document.getElementById('row1Content_2');
      }

      // Wenn row1Content_2 existiert, prüfe ob sie leer ist
      if (row1Content2 && row1Content2.children.length === 0) {
        if (row1_2) {
          row1_2.remove();
        }
      }
    }

    // Aktualisiere die checkAndMoveElements Funktion
    function checkAndMoveElements() {
      const row1Content = document.getElementById('row1Content');
      const row1Content2 = document.getElementById('row1Content_2');
      
      if (!row1Content || !row1Content2) {
        return;
      }

      // Berechne den verfügbaren Platz in row1Content
      let occupiedSpace = 0;
      Array.from(row1Content.children).forEach(box => {
        const boxSize = parseFloat(box.dataset.size) || 0;
        occupiedSpace += boxSize;
      });
      
      const availableSpace = 12 - occupiedSpace;

      if (availableSpace <= 0) {
        return;
      }

      // Sammle alle Elemente aus row1Content_2
      const elementsToCheck = Array.from(row1Content2.children);

      // Prüfe jedes Element in row1Content_2
      elementsToCheck.forEach(box => {
        const boxSize = parseFloat(box.dataset.size) || 0;
        
        // Prüfe, ob das Element in den verfügbaren Platz passt
        if (boxSize <= availableSpace && (occupiedSpace + boxSize) <= 12) {
          row1Content.appendChild(box);
          occupiedSpace += boxSize;
        } else {
        }
      });

      // Überprüfe, ob row1Content_2 jetzt leer ist
      if (row1Content2.children.length === 0) {
        const row1_2 = document.getElementById('row1_2');
        if (row1_2) {
          row1_2.remove();
        }
      }
    }

    // Aktualisiere addElementToSectionA
    function addElementToSectionA(element) {
      const row1Content = document.getElementById('row1Content');
      if (!row1Content) {
        return;
      }

      // Berechne den belegten Platz in row1Content
      let occupiedSpace = 0;
      Array.from(row1Content.children).forEach(box => {
        const boxSize = parseFloat(box.dataset.size) || 0;
        occupiedSpace += boxSize;
      });


      // Erstelle das Produkt-Box-Element
      const productBox = document.createElement('div');
      productBox.className = 'product-box';
      productBox.dataset.size = element.size;
      productBox.dataset.variantId = element.variantId;

      const productContent = document.createElement('div');
      productContent.className = 'product-content';

      const img = document.createElement('img');
      img.src = element.img;
      img.alt = element.name;
      img.onload = function() {
        productBox.classList.add('loaded');
      };
      img.loading = 'lazy';
      img.decoding = 'async';

      productContent.appendChild(img);
      productBox.appendChild(productContent);

      // Wenn es sich um die Hauptleitungsklemme handelt
      if (element.name === "Hauptleitungsklemme") {
        // Entferne zuerst die alte Hauptleitungsklemme, falls vorhanden
        Array.from(row1Content.children).forEach(box => {
          if (box.querySelector('img')?.alt === "Hauptleitungsklemme") {
            console.log('Alte Hauptleitungsklemme gefunden und wird entfernt');
            box.remove();
            occupiedSpace -= parseFloat(box.dataset.size) || 0;
          }
        });

        // Prüfe, ob die Hauptleitungsklemme in row1Content passt
        if (occupiedSpace + parseFloat(element.size) <= 12) {
          console.log('Hauptleitungsklemme passt in row1Content');
          row1Content.insertBefore(productBox, row1Content.firstChild);
          totalUnits += parseFloat(element.size);
          updateInfoBox();
          updateSummary();
          checkAndMoveElements();
        } else {
          console.log('Kein Platz für Hauptleitungsklemme in row1Content');
          showWarning('Kein Platz mehr verfügbar!', 'Bereich voll');
          return;
        }
        return;
      }

      // Prüfe, ob das neue Element in row1Content passt
      if (occupiedSpace + parseFloat(element.size) <= 12) {
        console.log('Element passt in row1Content');
        row1Content.appendChild(productBox);
        totalUnits += parseFloat(element.size);
        updateInfoBox();
        updateSummary();
        checkAndMoveElements();
      } else {
        console.log('Element passt nicht in row1Content, prüfe row1Content_2');
        manageRow1Content2();
        const row1Content2 = document.getElementById('row1Content_2');
        
        if (row1Content2) {
          // Berechne den belegten Platz in row1Content_2
          let occupiedSpace2 = 0;
          Array.from(row1Content2.children).forEach(box => {
            occupiedSpace2 += parseFloat(box.dataset.size) || 0;
          });
          console.log('Aktuell belegter Platz in row1Content_2:', occupiedSpace2, 'von 12 Einheiten');

          // Prüfe, ob das Element in row1Content_2 passt
          if (occupiedSpace2 + parseFloat(element.size) <= 12) {
            console.log('Element passt in row1Content_2');
            row1Content2.appendChild(productBox);
            totalUnits += parseFloat(element.size);
            updateInfoBox();
            updateSummary();
          } else {
            console.log('Kein Platz mehr in beiden Reihen verfügbar');
            showWarning('Kein Platz mehr verfügbar!', 'Bereich voll');
            return;
          }
        }
      }
    }

    // Globale Variablen für Sektion A und B
    let sectionAElements = {
      hauptleitungsklemme: true,
      unterzaehler: false,
      ueberspannungsschutz: false,
      hauptschalter: false
    };

    // Funktion zum Überprüfen und Verwalten der row1Content_2
    function manageRow1Content2() {
      const row1Content = document.getElementById('row1Content');
      const row1Content2 = document.getElementById('row1Content_2');
      const row1_2 = document.getElementById('row1_2');

      if (!row1Content) return;

      // Berechne den belegten Platz in row1Content
      let occupiedSpace = 0;
      Array.from(row1Content.children).forEach(box => {
        occupiedSpace += parseFloat(box.dataset.size) || 0;
      });

      // Wenn row1Content voll ist und row1Content_2 noch nicht existiert
      if (occupiedSpace >= 12 && !row1Content2) {
        // Erstelle den Container für die zweite Reihe
        const rowContainer = document.createElement('div');
        rowContainer.id = 'row1_2';
        rowContainer.className = 'row-container';
        rowContainer.style.display = 'block';
        
        // Erstelle die neue Reihe
        const newRowContent = document.createElement('div');
        newRowContent.id = 'row1Content_2';
        newRowContent.className = 'row-content';
        newRowContent.style.display = 'block';
        
        // Füge row1Content_2 in den Container ein
        rowContainer.appendChild(newRowContent);
        
        // Füge den Container an der richtigen Position ein (berücksichtige "Unten" Position)
        const row1 = document.getElementById('row1');
        if (row1) {
          if (isFirstRowAtBottom) {
            // Wenn Position "Unten" ist, füge row1_2 VOR row1 ein
            row1.parentNode.insertBefore(rowContainer, row1);
          } else {
            // Wenn Position "Oben" ist, füge row1_2 NACH row1 ein
            row1.parentNode.insertBefore(rowContainer, row1.nextSibling);
          }
        }
        // Variable nach dem Einfügen neu setzen
        row1Content2 = document.getElementById('row1Content_2');
      }

      // Wenn row1Content_2 existiert, prüfe ob sie leer ist
      if (row1Content2 && row1Content2.children.length === 0) {
        if (row1_2) {
          row1_2.remove();
        }
      }
    }

    function removeElementFromSectionA(elementName) { 
      // In row1Content suchen und entfernen
      const row1Content = document.getElementById("row1Content");
      if (row1Content) {
        Array.from(row1Content.children).forEach(box => {
          if (box.querySelector('img')?.alt === elementName) {
            box.remove();
            totalUnits -= parseFloat(box.dataset.size) || 0;
            updateInfoBox();
            updateSummary();
          }
        });
      }
      // In row1Content_2 suchen und entfernen
      const row1Content2 = document.getElementById("row1Content_2");
      if (row1Content2) {
        Array.from(row1Content2.children).forEach(box => {
          if (box.querySelector('img')?.alt === elementName) {
            box.remove();
            totalUnits -= parseFloat(box.dataset.size) || 0;
            updateInfoBox();
            updateSummary();
          }
        });
        // Prüfe, ob row1Content_2 jetzt leer ist und entferne ggf. den Container
        if (row1Content2.children.length === 0) {
          const row1_2 = document.getElementById('row1_2');
          if (row1_2) row1_2.remove();
        }
      }
    }

    // Toggle-Funktionen für Sektion A Elemente
    function toggleHauptleitungsklemme(withKlemme) {
      const mitBtn = document.getElementById('hlk-mit-btn');
      const ohneBtn = document.getElementById('hlk-ohne-btn');
      if (withKlemme) {
        mitBtn.classList.add('active');
        ohneBtn.classList.remove('active');
        mitBtn.style.background = '#22c55e';
        mitBtn.style.color = '#fff';
        ohneBtn.style.background = '#eee';
        ohneBtn.style.color = '#111827';
      } else {
        mitBtn.classList.remove('active');
        ohneBtn.classList.add('active');
        mitBtn.style.background = '#eee';
        mitBtn.style.color = '#111827';
        ohneBtn.style.background = '#ef4444';
        ohneBtn.style.color = '#fff';
      }
      sectionAElements.hauptleitungsklemme = withKlemme;
      updateSectionARows();
    }

    function toggleUnterzaehler(withZaehler) {
      const mitBtn = document.getElementById('uez-mit-btn');
      const ohneBtn = document.getElementById('uez-ohne-btn');
      if (withZaehler) {
        mitBtn.classList.add('active');
        ohneBtn.classList.remove('active');
        mitBtn.style.background = '#22c55e';
        mitBtn.style.color = '#fff';
        ohneBtn.style.background = '#eee';
        ohneBtn.style.color = '#111827';
      } else {
        mitBtn.classList.remove('active');
        ohneBtn.classList.add('active');
        mitBtn.style.background = '#eee';
        mitBtn.style.color = '#111827';
        ohneBtn.style.background = '#ef4444';
        ohneBtn.style.color = '#fff';
      }
      sectionAElements.unterzaehler = withZaehler;
      updateSectionARows();
    }

    function toggleUeberspannungsschutz(withSchutz) {
      const mitBtn = document.getElementById('ues-mit-btn');
      const ohneBtn = document.getElementById('ues-ohne-btn');
  
      if (withSchutz) {
        mitBtn.classList.add('active');
        ohneBtn.classList.remove('active');
        mitBtn.style.background = '#22c55e';
        mitBtn.style.color = '#fff';
        ohneBtn.style.background = '#eee';
        ohneBtn.style.color = '#111827';
      } else {
        mitBtn.classList.remove('active');
        ohneBtn.classList.add('active');
        mitBtn.style.background = '#eee';
        mitBtn.style.color = '#111827';
        ohneBtn.style.background = '#ef4444';
        ohneBtn.style.color = '#fff';
      }
      sectionAElements.ueberspannungsschutz = withSchutz;
      updateSectionARows();
    }

    function toggleHauptschalter(withSchalter) {
      const mitBtn = document.getElementById('hs-mit-btn');
      const ohneBtn = document.getElementById('hs-ohne-btn');
      if (withSchalter) {
        mitBtn.classList.add('active');
        ohneBtn.classList.remove('active');
        mitBtn.style.background = '#22c55e';
        mitBtn.style.color = '#fff';
        ohneBtn.style.background = '#eee';
        ohneBtn.style.color = '#111827';
      } else {
        mitBtn.classList.remove('active');
        ohneBtn.classList.add('active');
        mitBtn.style.background = '#eee';
        mitBtn.style.color = '#111827';
        ohneBtn.style.background = '#ef4444';
        ohneBtn.style.color = '#fff';
      }
      sectionAElements.hauptschalter = withSchalter;
      updateSectionARows();
    }

    // ... existing code ...
    function updateSectionARows() {
      const row1Content = document.getElementById('row1Content');
      let row1Content2 = document.getElementById('row1Content_2');
      let row1_2 = document.getElementById('row1_2');

      // Alle Elemente mit Metadaten
      const allElements = [
        { key: 'hauptleitungsklemme', name: 'Hauptleitungsklemme', size: 5, img: 'https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Hauptabzweigklemme.png?v=1748178901', variantId: '56051869876489' },
        { key: 'unterzaehler', name: 'Unterzähler', size: 4.5, img: 'https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Unterzaehler_99c6ffde-7041-40e7-b11f-c31a5cb1e77d.png?v=1756321308', variantId: '56050139267337' },
        { key: 'ueberspannungsschutz', name: 'Überspannungsschutz', size: 4, img: 'https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Ueberspannungsschutz_b02f7f9b-e3f6-4e26-ac1a-96ce9e681993.png?v=1756321309', variantId: '56050140021001' },
        { key: 'hauptschalter', name: 'Hauptschalter', size: 2.5, img: 'https://cdn.shopify.com/s/files/1/0944/8711/8089/files/Hauptschalter_9db5d20e-8e22-4fb8-9f83-4b1909e10c77.png?v=1756321561', variantId: '56050140479753' }
      ];

      // Entferne deaktivierte Elemente aus der FIFO-Liste
      sectionAOrder = sectionAOrder.filter(key => sectionAElements[key]);
      // Füge neu aktivierte Elemente am Ende hinzu
      allElements.forEach(el => {
        if (sectionAElements[el.key] && !sectionAOrder.includes(el.key)) {
          sectionAOrder.push(el.key);
        }
      });

      // Sonderfall: Hauptleitungsklemme immer an erster Stelle
      if (sectionAOrder.includes('hauptleitungsklemme')) {
        sectionAOrder = ['hauptleitungsklemme', ...sectionAOrder.filter(key => key !== 'hauptleitungsklemme')];
      }

      // Reihen leeren: feste Elemente (fixed-product) behalten
      Array.from(row1Content.children).forEach(child => {
        if (!child.classList.contains('fixed-product')) {
          child.remove();
        }
      });
      if (row1Content2) row1Content2.innerHTML = "";
      if (row1_2 && row1Content2 && row1Content2.children.length === 0) {
        row1_2.remove();
        row1Content2 = null;
        updateInfoBox();
        updateSummary();
      }

      // Berücksichtige bereits vorhandene feste Elemente in row1 (z. B. Hauptleitungsklemme)
      let occupiedSpaceRow1 = Array.from(row1Content.children).reduce((sum, box) => sum + (parseFloat(box.dataset.size) || 0), 0);
      let occupiedSpaceRow2 = 0;
      let row1Boxes = [];
      let row2Boxes = [];
      let row2Keys = [];
      let row2Started = false;

      // Skip Hauptleitungsklemme hier, sie ist bereits als fixed-product in row1 vorhanden
      sectionAOrder.filter(key => key !== 'hauptleitungsklemme').forEach(key => {
        const el = allElements.find(e => e.key === key);
        if (!el) return;
        const productBox = document.createElement('div');
        productBox.className = 'product-box';
        productBox.dataset.size = el.size;
        productBox.dataset.variantId = el.variantId;

        const productContent = document.createElement('div');
        productContent.className = 'product-content';

        const img = document.createElement('img');
        img.src = el.img;
        img.alt = el.name;
        img.onload = function() {
          productBox.classList.add('loaded');
        };

        productContent.appendChild(img);
        productBox.appendChild(productContent);

        const elementSize = parseFloat(el.size);

        // FIFO-Prinzip: Sobald ein Element auf row1_2 ist, kommen alle weiteren nur noch auf row1_2
        if (!row2Started && occupiedSpaceRow1 + elementSize <= 12) {
          row1Boxes.push(productBox);
          occupiedSpaceRow1 += elementSize;
        } else {
          row2Started = true;
          row2Boxes.push(productBox);
          occupiedSpaceRow2 += elementSize;
          row2Keys.push(el.key);
        }
      });

      // Füge die Boxen in der richtigen Reihenfolge ein
      row1Boxes.forEach(box => row1Content.appendChild(box));
      if (row2Boxes.length > 0) {
        // Prüfe, ob das Anlegen der Zusatzreihe (row1Content_2) die maximale Reihenanzahl überschreiten würde
        const currentRowContainers = document.querySelectorAll('.row-container').length; // zählt row1_2 mit
        const willCreateNewRow = !row1Content2; // neue Zusatzreihe wird erzeugt
        if (willCreateNewRow && currentRowContainers >= maxRows) {
          // Nur das gewählte Element zurücksetzen, das die neue Reihe verursachen würde
          const offendingKey = row2Keys[0];
          const resetToggle = (mitId, ohneId, stateKey) => {
            const mitBtn = document.getElementById(mitId);
            const ohneBtn = document.getElementById(ohneId);
            if (mitBtn && ohneBtn) {
              mitBtn.classList.remove('active');
              ohneBtn.classList.add('active');
              mitBtn.style.background = '#eee';
              mitBtn.style.color = '#111827';
              ohneBtn.style.background = '#ef4444';
              ohneBtn.style.color = '#fff';
            }
            if (sectionAElements && Object.prototype.hasOwnProperty.call(sectionAElements, stateKey)) {
              sectionAElements[stateKey] = false;
            }
          };
          if (offendingKey === 'unterzaehler') {
            resetToggle('uez-mit-btn','uez-ohne-btn','unterzaehler');
          } else if (offendingKey === 'ueberspannungsschutz') {
            resetToggle('ues-mit-btn','ues-ohne-btn','ueberspannungsschutz');
          } else if (offendingKey === 'hauptschalter') {
            resetToggle('hs-mit-btn','hs-ohne-btn','hauptschalter');
          } else if (offendingKey === 'hauptleitungsklemme') {
            resetToggle('hlk-mit-btn','hlk-ohne-btn','hauptleitungsklemme');
          }
          
          // Einheitliche Meldung wie beim Reihen-Button
          showNiceDialog('Maximale Anzahl an Reihen erreicht!', 'Es werden nur maximal 5 Reihen unterstüzt. Wenn du mehr Platz brauchst, <a href="/#contact" style="color: #005A9C; text-decoration: underline;">kontaktiere uns</a> – wir finden eine passende Lösung');
          updateSectionARows();
          updateInfoBox();
          updateSummary();
          return; // keine weitere Verarbeitung, um 6. Reihe zu verhindern
        }
        if (!row1Content2) {
          const rowContainer = document.createElement('div');
          rowContainer.id = 'row1_2';
          rowContainer.className = 'row-container';
          rowContainer.style.display = 'flex';
          rowContainer.style.alignItems = 'center';
          rowContainer.style.minHeight = '80px';

          row1Content2 = document.createElement('div');
          row1Content2.id = 'row1Content_2';
          row1Content2.className = 'row-content';
          row1Content2.style.display = 'flex';
          row1Content2.style.alignItems = 'center';
          row1Content2.style.width = '100%';

          rowContainer.appendChild(row1Content2);

          const row1 = document.getElementById('row1');
          if (row1) {
            if (isFirstRowAtBottom) {
              // Wenn Position "Unten" ist, füge row1_2 VOR row1 ein
              row1.parentNode.insertBefore(rowContainer, row1);
            } else {
              // Wenn Position "Oben" ist, füge row1_2 NACH row1 ein
              row1.parentNode.insertBefore(rowContainer, row1.nextSibling);
            }
          }
        }
        row2Boxes.forEach(box => row1Content2.appendChild(box));
      }
      updateInfoBox();
      updateSummary();
    }

    // Initialisiere die Buttons beim Laden der Seite
    document.addEventListener('DOMContentLoaded', function() {
      // Setze den Hauptleitungsklemme-Button auf "mit"
      const hlkMitBtn = document.getElementById('hlk-mit-btn');
      const hlkOhneBtn = document.getElementById('hlk-ohne-btn');
      if (hlkMitBtn && hlkOhneBtn) {
        hlkMitBtn.classList.add('active');
        hlkOhneBtn.classList.remove('active');
        hlkMitBtn.style.background = '#22c55e';
        hlkMitBtn.style.color = '#fff';
        hlkOhneBtn.style.background = '#eee';
        hlkOhneBtn.style.color = '#111827';
      }
      
      // Reihenklemmen entfernt
      
      // Initialisiere die Reihen
      updateSectionARows();
    });

    // Variable für den Warnmeldungs-Status
    let warningShown = false;

    // Funktion zum Überprüfen der Leitungsschutzschalter-Einheiten
    function checkLeitungsschutzschalterUnits(rowContent) {
      // Prüfe zuerst, ob es sich um einen FI-Bereich handelt
      const fiSchalter = rowContent.querySelector('.product-box img[alt="FI-/Leitungsschutzschalter"]');
      if (!fiSchalter) {
        return; // Kein FI-Bereich, keine Prüfung notwendig
      }

      // Prüfe, ob es sich um einen freien Bereich handelt
      const row = rowContent.closest('.row');
      if (row && row.classList.contains('free-area')) {
        return; // Freier Bereich, keine Prüfung notwendig
      }

      let totalLSUnits = 0;
      const leitungsschutzschalterElements = rowContent.querySelectorAll('.product-box');
      leitungsschutzschalterElements.forEach(element => {
        const img = element.querySelector('img');
        if (img && (img.alt === 'Leitungsschutzschalter 1 polig' || img.alt === 'Leitungsschutzschalter 3 polig')) {
          const size = parseFloat(element.dataset.size) || 0;
          totalLSUnits += size;
        }
      });

      if (totalLSUnits >= 6 && !warningShown) {
        warningShown = true; // Markiere, dass die Warnmeldung angezeigt wurde
        showWarning('Laut DIN VDE 0100-530:2018-6 sind nur noch sechs LS-Schalter (dreiphasig verteilt) hinter einem Gruppen-FI-Schutzschalter zulässig!', 'Hinweis');
      }
    }

    // Modifiziere die addProductToRow Funktion
    const originalAddProductToRow = window.addProductToRow;
    window.addProductToRow = function(rowNumber, product) {
      originalAddProductToRow(rowNumber, product);
      const rowContent = document.getElementById(`row${rowNumber}Content`);
      if (rowContent) {
        checkLeitungsschutzschalterUnits(rowContent);
      }
      const newImage = document.querySelector(`#row${rowNumber}Content .product-box:last-child img`);
      if (newImage) {
        if (newImage.complete) {
          handleImageLoad(newImage);
        } else {
          newImage.addEventListener('load', function() {
            handleImageLoad(this);
          });
        }
      }
    };

    // ... existing code ...
      function validatePage(currentPage) {
        // Pflichtauswahl auf Seite 3 (Verteilerschrank)
        if (currentPage === 3) {
          const btn = document.getElementById('montageart-btn');
          const btnText = btn ? btn.textContent.trim() : '';
          const montageartText = selectedMontageart || btnText;
          let errorBox = document.getElementById("verteiler-error");
          if (!montageartText || montageartText === 'Bitte wählen Sie die Montageart') {
            if (!errorBox) {
              errorBox = document.createElement("div");
              errorBox.id = "verteiler-error";
              errorBox.style.background = "#ffeaea";
              errorBox.style.color = "#D93025";
              errorBox.style.padding = "12px 20px";
              errorBox.style.borderRadius = "5px";
              errorBox.style.margin = "20px auto";
              errorBox.style.maxWidth = "600px";
              errorBox.style.textAlign = "center";
              errorBox.textContent = "Bitte wählen Sie eine Montageart aus.";
              // Füge die Fehlermeldung unterhalb der Dropdowns ein
              const dropdowns = document.querySelectorAll('#page3 .dropdown-container');
              if (dropdowns.length > 0 && dropdowns[0].parentNode) {
                dropdowns[0].parentNode.insertBefore(errorBox, dropdowns[0].nextSibling);
              }
            }
            return false;
          } else {
            if (errorBox) errorBox.remove();
            return true;
          }
        }
        return true;
      }

    // ... existing code ...
    function createRowStrip(rowNumber) {
      const newRowStrip = document.createElement("div");
      newRowStrip.id = `row${rowNumber}-strip`;
      newRowStrip.className = "row-strip";
      
      // Erstelle den Buttons-Container für die obere Leiste
      const buttonsContainerTop = document.createElement("div");
      buttonsContainerTop.className = "buttons-container-top";
      buttonsContainerTop.id = `buttonsRow${rowNumber}`;
      
      // Füge die Buttons zum Container hinzu (ohne onclick-Attribute)
      buttonsContainerTop.innerHTML = `
        <button class="button button--outline move-up-btn">
          <i class="fas fa-arrow-up"></i>
        </button>
        <button class="button button--outline move-down-btn">
          <i class="fas fa-arrow-down"></i>
        </button>
        <button class="button button--outline remove-row-btn">
          <i class="fas fa-trash"></i>
        </button>
      `;
      
      // Setze die Event-Handler per JavaScript
      const moveUpBtn = buttonsContainerTop.querySelector('.move-up-btn');
      if (moveUpBtn) moveUpBtn.onclick = function() { moveRowUp(rowNumber); };
      const moveDownBtn = buttonsContainerTop.querySelector('.move-down-btn');
      if (moveDownBtn) moveDownBtn.onclick = function() { moveRowDown(rowNumber); };
      const removeBtn = buttonsContainerTop.querySelector('.remove-row-btn');
      if (removeBtn) removeBtn.onclick = function() { removeRow(rowNumber); };
      
      newRowStrip.appendChild(buttonsContainerTop);
      return newRowStrip;
    }

    function addRow(isFiRow = false) {
      if (getActualRowCount() >= maxRows) {
        alert("Maximale Anzahl an Reihen erreicht!");
        return;
      }

      rowCounter++;
      const configurator = document.getElementById("configurator");
      const buttonContainer = document.getElementById("addFiRowButton").parentNode;

      // Erstelle die neue Reihe
      const newRow = document.createElement("div");
      newRow.id = "row" + rowCounter;
      newRow.className = "row-container";
      if (isFiRow) {
        newRow.classList.add("fi-row");
      }

      // Erstelle den Inhalt der Reihe
      const newRowContent = document.createElement("div");
      newRowContent.id = "row" + rowCounter + "Content";
      newRowContent.className = "row-content";
      newRow.appendChild(newRowContent);

      // Erstelle den Strip für die neue Reihe
      const newRowStrip = createRowStrip(rowCounter);

      // Füge die Elemente in der richtigen Reihenfolge ein
      configurator.insertBefore(newRowStrip, buttonContainer);
      configurator.insertBefore(newRow, newRowStrip.nextSibling);

      // Aktualisiere die Info-Box
      updateInfoBox();
      updateSummary();
    }

    function removeRow(rowNumber) {
      try {
        if (rowNumber === 1) {
          return;
        }

        const row = document.getElementById("row" + rowNumber);
        const rowStrip = document.getElementById("row" + rowNumber + "-strip");

        // Wenn die Reihe oder der Strip nicht existiert, beende die Funktion ohne Fehler
        if (!row || !rowStrip) {
          console.error("Reihe oder Strip nicht gefunden (evtl. schon gelöscht)");
          return;
        }

        // Berechne die zu entfernenden Einheiten
        const rowContent = row.querySelector(".row-content");
        if (rowContent) {
          const unitsToRemove = Array.from(rowContent.children).reduce((total, productBox) => {
            try {
              return total + parseFloat(productBox.dataset.size);
            } catch (e) {
              console.warn("Fehler beim Berechnen der Einheiten eines Produkts");
              return total;
            }
          }, 0);
          totalUnits -= unitsToRemove;
        }

        row.remove();
        rowStrip.remove();

        // IDs und Event-Handler der nachfolgenden Reihen anpassen
        let i = rowNumber + 1;
        while (true) {
          const currentRow = document.getElementById("row" + i);
          const currentStrip = document.getElementById("row" + i + "-strip");
          if (!currentRow || !currentStrip) break;
          currentRow.id = "row" + (i - 1);
          const rowContent = currentRow.querySelector('.row-content');
          if (rowContent) rowContent.id = "row" + (i - 1) + "Content";
          currentStrip.id = "row" + (i - 1) + "-strip";

          // Entferne alle alten Buttons-Container in der Reihe (außer der ersten)
          if ((i - 1) > 1) {
            const oldBtns = currentRow.querySelectorAll('.buttons-container-top');
            oldBtns.forEach(btn => btn.remove());
          }
          // Entferne auch im Strip, falls vorhanden
          const oldBtnsStrip = currentStrip.querySelectorAll('.buttons-container-top');
          oldBtnsStrip.forEach(btn => btn.remove());

          // Erzeuge die Buttons für die neue Nummer neu
          setupRow(i - 1);

          i++;
        }

        rowCounter--;
        updateInfoBox();
        updateSummary();
      } catch (error) {
        console.error("Fehler beim Entfernen der Reihe:", error.message);
        showError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      }
    }
// End of Konfigurator JavaScript
