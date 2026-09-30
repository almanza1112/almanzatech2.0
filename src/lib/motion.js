import { useEffect, useState, useSyncExternalStore } from "react";

export const supportsObserver =
  typeof window !== "undefined" && "IntersectionObserver" in window;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  Boolean(window.matchMedia?.(REDUCED_MOTION_QUERY).matches);

export const useReducedMotion = () => {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const media = window.matchMedia?.(REDUCED_MOTION_QUERY);
    if (!media) return undefined;

    const onChange = () => setReduced(media.matches);
    onChange();
    if (media.addEventListener) {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener?.(onChange);
    return () => media.removeListener?.(onChange);
  }, []);

  return reduced;
};

let paused = false;
const listeners = new Set();
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = () => paused;
const getServerSnapshot = () => false;
const setPaused = (value) => {
  paused = typeof value === "function" ? Boolean(value(paused)) : Boolean(value);
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("motion-paused", paused);
  }
  listeners.forEach((listener) => listener());
};

export const usePausedMotion = () => [
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot),
  setPaused,
];
