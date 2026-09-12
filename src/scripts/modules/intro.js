/**
 * Site opener.
 *
 * An ink screen, the HackUnion logo with a glare sweeping across it, then the
 * screen lifts away and the page is there. Runs once per browser session.
 * Tuned to a ~1s hold — quick enough not to hold up returning visitors.
 *
 * The logo asset is never recoloured or redrawn — the glare is a separate
 * layer masked to the logo's own alpha, so the light passes over the artwork
 * rather than changing it.
 *
 * The `hu-intro-armed` class is set by a tiny inline snippet in each page's
 * <head>, which paints the ink screen before this module has even parsed. That
 * snippet also clears the class after a short failsafe delay, so a JS failure
 * can never leave a visitor staring at a blank page.
 */

import { getSiteRootPath, toSiteHref } from '../utils/site-path.js';

const SESSION_KEY = 'hu-intro-seen';
const HOLD = 1000; // ms before the screen lifts
const LIFT = 450; // ms the lift itself takes

export const initIntro = () => {
  const root = document.documentElement;

  const disarm = () => {
    root.classList.remove('hu-intro-armed');
    document.body?.classList.remove('is-intro-locked');
  };

  if (!root.classList.contains('hu-intro-armed')) {
    disarm();
    return;
  }

  let seen = false;
  try {
    seen = window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    seen = false;
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (seen || reduced) {
    disarm();
    return;
  }

  // Resolved relative to the current page depth, so it's correct whether the
  // page lives at the site root or several folders deep.
  const logo = toSiteHref('Images/hackunion-lockup.png', { rootPath: getSiteRootPath() });

  const intro = document.createElement('div');
  intro.className = 'hu-intro';
  intro.setAttribute('role', 'presentation');
  intro.innerHTML = `
    <div class="hu-intro__stage">
      <div class="hu-intro__mark">
        <img class="hu-intro__logo" src="${logo}" alt="" width="760" height="562" />
        <span class="hu-intro__glare" aria-hidden="true" style="--hu-intro-logo: url('${logo}')"></span>
      </div>
      <p class="hu-intro__kicker">Builder-first technology community</p>
    </div>
    <button class="hu-intro__skip" type="button">Skip</button>
  `;

  document.body.prepend(intro);
  document.body.classList.add('is-intro-locked');

  let done = false;

  const finish = () => {
    if (done) return;
    done = true;

    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // A blocked sessionStorage just means the opener plays again. Harmless.
    }

    intro.classList.add('is-leaving');
    disarm();

    window.setTimeout(() => intro.remove(), LIFT);
  };

  intro.querySelector('.hu-intro__skip')?.addEventListener('click', finish);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') finish();
  });

  window.setTimeout(finish, HOLD);
};
