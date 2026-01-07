document.addEventListener('DOMContentLoaded', () => {
  function setupExclusiveDetails(selector) {
    document.querySelectorAll(selector).forEach(detail => {
      detail.addEventListener('toggle', () => {
        if (detail.open) {
          document.querySelectorAll(selector).forEach(other => {
            if (other !== detail) other.open = false;
          });
        }
      });
    });
  }

  function setupOverlay(cardSelector) {
    document.querySelectorAll(cardSelector).forEach(card => {
      const details = card.querySelector('details');
      const slidetxt = card.querySelector('.slidetxt');

      if (details && slidetxt) {
        details.addEventListener('toggle', (e) => {
          if (details.open) {
            // Prevent closing immediately
            e.stopPropagation();

            // Show overlay
            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            card.appendChild(overlay);

            // Position slidetxt
            slidetxt.style.display = 'block';

            // Close when clicking overlay
            overlay.addEventListener('click', () => {
              details.open = false;
              card.removeChild(overlay);
              slidetxt.style.display = 'none';
            });
          } else {
            const overlay = card.querySelector('.overlay');
            if (overlay) {
              card.removeChild(overlay);
            }
            slidetxt.style.display = 'none';
          }
        });
      }
    });
  }

  setupExclusiveDetails('.abaservicos .card details');
  setupExclusiveDetails('.abasegmentos .card details');

  setupOverlay('.abaservicos .card');
  setupOverlay('.abasegmentos .card');
});
