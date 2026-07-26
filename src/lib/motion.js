/**
 * Shared motion utilities.
 *
 * Everything here degrades gracefully: if IntersectionObserver is missing or the
 * visitor has asked for reduced motion, elements are revealed immediately rather
 * than being left invisible.
 */

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export const supportsObserver =
  typeof window !== "undefined" && "IntersectionObserver" in window;

/**
 * One observer shared by every reveal on the page rather than one per element.
 * Elements are unobserved once shown — reveals play a single time.
 */
let revealObserver = null;

export function getRevealObserver() {
  if (revealObserver || !supportsObserver) return revealObserver;

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -64px 0px", threshold: 0 }
  );

  return revealObserver;
}

/** Runs `fn` at most once per animation frame. */
export function rafThrottle(fn) {
  let frame = null;
  return (...args) => {
    if (frame !== null) return;
    frame = window.requestAnimationFrame(() => {
      frame = null;
      fn(...args);
    });
  };
}

export const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Scrolls to a section by id. Sections carry `scroll-margin-top` so they clear
 * the fixed navbar. Used where the default anchor jump has to be deferred
 * (e.g. after the mobile menu releases its scroll lock).
 */
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}
