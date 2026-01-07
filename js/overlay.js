document.addEventListener('DOMContentLoaded', () => {
  // torna grupos de <details> "exclusivos" (quando um abre, os outros fecham)
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

  [
    '.abaservicos .card details',
    '.empresas .container details',
    '.abasegmentos .card details'
  ].forEach(setupExclusiveDetails);

  document.querySelectorAll('.abaservicos .card').forEach(card => {
    const img = card.querySelector('.slideimg');
    const overlay = card.querySelector('.overlay');

    // ao clicar na imagem, abre o modal
    if (img) {
      img.addEventListener('click', e => {
        e.stopPropagation();
        card.classList.add('open');
      });
    }

    // ao clicar no overlay, fecha
    if (overlay) {
      overlay.addEventListener('click', e => {
        card.classList.remove('open');
      });
    }

    // ao clicar em qualquer outro lugar da página, fecha também
    document.addEventListener('click', e => {
      if (card.classList.contains('open')) {
        card.classList.remove('open');
      }
    });

    // evita que clique dentro do popup (slidetxt) feche imediatamente
    const slidetxt = card.querySelector('.slidetxt');
    if (slidetxt) slidetxt.addEventListener('click', e => e.stopPropagation());
  });

  // mesmo comportamento para os cards de abasegmentos
  document.querySelectorAll('.abasegmentos .card').forEach(card => {
    const img = card.querySelector('.slideimg');
    const overlay = card.querySelector('.overlay');

    if (img) {
      img.addEventListener('click', e => {
        e.stopPropagation();
        card.classList.add('open');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', e => {
        card.classList.remove('open');
      });
    }

    // fecha ao clicar fora
    document.addEventListener('click', e => {
      if (card.classList.contains('open')) {
        card.classList.remove('open');
      }
    });

    const slidetxt = card.querySelector('.slidetxt');
    if (slidetxt) slidetxt.addEventListener('click', e => e.stopPropagation());
  });
});
