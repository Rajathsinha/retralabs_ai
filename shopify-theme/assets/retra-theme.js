/* RetraLabs theme JS — header state, reveals, carousel, AJAX cart.
   Transform/opacity-only animations; all listeners passive. */
(function () {
  'use strict';

  /* Sticky header: transparent at top → white after scroll */
  var header = document.querySelector('.retra-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var toggle = header.querySelector('.retra-header__toggle');
    var drawer = header.querySelector('.retra-drawer');
    if (toggle && drawer) {
      toggle.addEventListener('click', function () {
        var open = drawer.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
  }

  /* Scroll reveal */
  var reveals = document.querySelectorAll('.retra-reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Best-sellers carousel arrow */
  document.querySelectorAll('.retra-carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.retra-products');
    var next = carousel.querySelector('.retra-carousel__arrow');
    if (!track || !next) return;
    var update = function () {
      var end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      next.toggleAttribute('disabled', end);
    };
    next.addEventListener('click', function () {
      var card = track.querySelector('.retra-card');
      var step = card ? card.getBoundingClientRect().width + 20 : 300;
      track.scrollBy({ left: step, behavior: 'smooth' });
    });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  });

  /* AJAX add to cart */
  document.querySelectorAll('form[data-retra-atc]').forEach(function (form) {
    form.addEventListener('submit', function (evt) {
      evt.preventDefault();
      var btn = form.querySelector('.retra-card__add');
      var original = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = btn.dataset.addingText || 'Adding…'; }

      fetch(window.Shopify && window.Shopify.routes ? window.Shopify.routes.root + 'cart/add.js' : '/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          items: [{ id: Number(form.querySelector('[name="id"]').value), quantity: 1 }]
        })
      })
        .then(function (r) {
          if (!r.ok) throw new Error('add failed');
          return fetch('/cart.js').then(function (c) { return c.json(); });
        })
        .then(function (cart) {
          document.querySelectorAll('[data-retra-cart-count]').forEach(function (el) {
            el.textContent = cart.item_count;
          });
          if (btn) {
            btn.textContent = btn.dataset.addedText || 'Added ✓';
            btn.classList.add('is-added');
            setTimeout(function () {
              btn.disabled = false;
              btn.textContent = original;
              btn.classList.remove('is-added');
            }, 1600);
          }
        })
        .catch(function () {
          /* fall back to native form submission (does not re-fire the submit event) */
          if (btn) { btn.disabled = false; btn.textContent = original; }
          form.submit();
        });
    });
  });
})();
