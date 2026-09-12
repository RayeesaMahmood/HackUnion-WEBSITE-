export const initFooterWordmark = () => {
  const root = document.querySelector('[data-footer-wordmark]');

  if (!root) {
    return;
  }

  const svg = root.querySelector('svg');
  const radial = root.querySelector('[data-footer-wordmark-radial]');

  if (!svg || !radial) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const resetPosition = () => {
    radial.setAttribute('cx', '0.5');
    radial.setAttribute('cy', '-0.2');
  };

  if (prefersReducedMotion || !supportsHover) {
    root.classList.add('is-static');
    resetPosition();
    return;
  }

  let frame = null;
  let lastX = 0;
  let lastY = 0;

  const applyUpdate = () => {
    const rect = svg.getBoundingClientRect();

    if (rect.width && rect.height) {
      const x = (lastX - rect.left) / rect.width;
      const y = (lastY - rect.top) / rect.height;
      radial.setAttribute('cx', String(Math.min(1, Math.max(0, x))));
      radial.setAttribute('cy', String(Math.min(1, Math.max(0, y))));
    }

    frame = null;
  };

  root.addEventListener('pointermove', (event) => {
    lastX = event.clientX;
    lastY = event.clientY;

    if (frame === null) {
      frame = requestAnimationFrame(applyUpdate);
    }
  });

  root.addEventListener('pointerleave', resetPosition);

  resetPosition();
};
