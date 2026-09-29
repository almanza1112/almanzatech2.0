import { useEffect, useState } from "react";
import { CASE_STUDIES } from "../data/work";

export const matchRoute = (pathname) => {
  const match = /^\/work\/([^/]+)\/?$/.exec(pathname);
  return match && CASE_STUDIES.some(({ slug }) => slug === match[1])
    ? { page: "case", slug: match[1] }
    : { page: "home" };
};

const listeners = new Set();
let previousScrollRestoration;
const notify = (event) => listeners.forEach((listener) => listener(event));
const readLocation = (event) => ({
  pathname: window.location.pathname,
  hash: window.location.hash,
  scrollY: event?.type === "popstate" ? window.history.state?.scrollY : undefined,
});

export const navigate = (url) => {
  window.history.replaceState({ ...window.history.state, scrollY: window.scrollY }, "");
  window.history.pushState({ scrollY: 0 }, "", url);
  notify();
};

export const interceptLinkClicks = (event) => {
  if (
    event.defaultPrevented || event.button !== 0 ||
    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
  ) return;

  const link = event.target.closest?.("a[href]");
  if (
    !link || !link.getAttribute("href").startsWith("/") ||
    link.hasAttribute("target") || link.hasAttribute("download") ||
    link.origin !== window.location.origin
  ) return;

  event.preventDefault();
  navigate(link.pathname + link.search + link.hash);
};

const subscribe = (listener) => {
  if (!listeners.size) {
    // Native restoration would compete with the router's scroll after React commits.
    previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    document.addEventListener("click", interceptLinkClicks);
    window.addEventListener("popstate", notify);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      window.history.scrollRestoration = previousScrollRestoration;
      document.removeEventListener("click", interceptLinkClicks);
      window.removeEventListener("popstate", notify);
    }
  };
};

export const useRoute = () => {
  const [location, setLocation] = useState(readLocation);

  useEffect(() => subscribe((event) => setLocation(readLocation(event))), []);

  // Both saved positions and hash targets need the destination to be committed.
  useEffect(() => {
    if (typeof location.scrollY === "number") {
      window.scrollTo({ top: location.scrollY, left: 0, behavior: "instant" });
      return;
    }
    let id = location.hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      // A malformed fragment still falls back to the top of the page.
    }
    const target = id && document.getElementById(id);
    const behavior = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth";
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior, block: "start" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior });
    }
  }, [location]);

  return matchRoute(location.pathname);
};
