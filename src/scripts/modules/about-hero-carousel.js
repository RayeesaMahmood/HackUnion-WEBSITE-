const AUTOPLAY_INTERVAL = 5200;

export const initAboutHeroCarousel = () => {
  const root = document.querySelector('[data-about-hero-carousel]');

  if (!root) {
    return;
  }

  const bgImages = Array.from(root.querySelectorAll('[data-carousel-bg] img'));
  const cards = Array.from(root.querySelectorAll('[data-carousel-card]'));
  const captionLabel = root.querySelector('[data-carousel-caption-label]');
  const captionNote = root.querySelector('[data-carousel-caption-note]');
  const railCurrent = root.querySelector('[data-carousel-current]');
  const railFill = root.querySelector('[data-carousel-rail-fill]');

  if (!cards.length) {
    return;
  }

  const total = cards.length;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let activeIndex = 0;
  let autoplayTimer = null;

  const pad = (index) => String(index + 1).padStart(2, '0');

  const setActive = (index, { focusCard = false } = {}) => {
    const nextIndex = ((index % total) + total) % total;
    activeIndex = nextIndex;

    const card = cards[nextIndex];
    const accent = card.dataset.accent || '#2f63e4';
    const label = card.dataset.label || '';
    const note = card.dataset.note || '';

    cards.forEach((item, itemIndex) => {
      const isActive = itemIndex === nextIndex;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });

    bgImages.forEach((img, imgIndex) => {
      img.classList.toggle('is-active', imgIndex === nextIndex);
    });

    root.style.setProperty('--about-carousel-accent', accent);

    if (captionLabel && captionNote) {
      captionLabel.classList.remove('is-in');
      captionNote.classList.remove('is-in');
      captionLabel.textContent = label;
      captionNote.textContent = note;

      requestAnimationFrame(() => {
        captionLabel.classList.add('is-in');
        captionNote.classList.add('is-in');
      });
    }

    if (railCurrent) {
      railCurrent.textContent = pad(nextIndex);
    }

    if (railFill) {
      railFill.style.left = `${(nextIndex / total) * 100}%`;
    }

    if (focusCard) {
      card.focus();
    }
  };

  const goNext = () => setActive(activeIndex + 1);
  const goPrev = () => setActive(activeIndex - 1);

  const stopAutoplay = () => {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const startAutoplay = () => {
    if (prefersReducedMotion || autoplayTimer) {
      return;
    }

    autoplayTimer = window.setInterval(goNext, AUTOPLAY_INTERVAL);
  };

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      stopAutoplay();
      setActive(index);
      startAutoplay();
    });
  });

  root.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }

    event.preventDefault();
    stopAutoplay();

    if (event.key === 'ArrowRight') {
      goNext();
    } else {
      goPrev();
    }

    setActive(activeIndex, { focusCard: true });
    startAutoplay();
  });

  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget)) {
      startAutoplay();
    }
  });

  setActive(0);
  startAutoplay();
};
