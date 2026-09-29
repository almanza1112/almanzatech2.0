export const supportsObserver =
  typeof window !== "undefined" && "IntersectionObserver" in window;
