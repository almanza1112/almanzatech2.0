import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import Work from "./Work";
import { usePausedMotion } from "../lib/motion";

let mockObserverSupported = false;
jest.mock("../lib/motion", () => ({
  ...jest.requireActual("../lib/motion"),
  get supportsObserver() { return mockObserverSupported; },
}));
jest.mock("../lib/analytics", () => ({ track: jest.fn() }));

const originalMatchMedia = window.matchMedia;
const originalObserver = window.IntersectionObserver;
let setSharedPaused;
const PauseControl = () => {
  const [, setPaused] = usePausedMotion();
  setSharedPaused = setPaused;
  return null;
};
const card = (slug = "nextplay") => document.querySelector(`a[href="/work/${slug}/"]`);
const activeShot = (target = card()) => target.querySelector(".work-shot--active").getAttribute("src");
const advance = (ms = 1300) => act(() => jest.advanceTimersByTime(ms));
const mockMedia = ({ reduced = false, touch = false } = {}) => {
  const preference = (matches) => ({
    matches,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  });
  const motion = preference(reduced);
  const hover = preference(touch);
  window.matchMedia = jest.fn((query) => query === "(prefers-reduced-motion: reduce)" ? motion : hover);
  return { motion, hover };
};

beforeEach(() => {
  jest.useFakeTimers();
  mockMedia();
});

afterEach(() => {
  cleanup();
  if (setSharedPaused) act(() => setSharedPaused(false));
  setSharedPaused = undefined;
  window.matchMedia = originalMatchMedia;
  window.IntersectionObserver = originalObserver;
  mockObserverSupported = false;
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test("each card uses the specified shots, responsive web sources and phone overlays", () => {
  const { container } = render(<Work />);
  const expected = {
    nextplay: ["nextplay-web-1-1400.webp", "nextplay-web-2-1400.webp", "nextplay-web-3-1400.webp"],
    ambe: ["ambe-web-1-1400.webp", "ambe-web-3-1400.webp", "ambe-web-4-1400.webp"],
    curzonrelo: ["curzonrelo-ss-1400.webp"],
    persyst: ["persyst-app-1-1200.webp", "persyst-app-2-1200.webp", "persyst-app-4-1200.webp"],
    chinesepod: ["chinesepod-app-1400.webp"],
  };
  Object.entries(expected).forEach(([slug, sources]) => {
    const target = card(slug);
    const shots = [...target.querySelectorAll(".work-shot")];
    expect(shots.map((img) => img.getAttribute("src"))).toEqual(sources);
    expect(activeShot(target)).toBe(sources[0]);
    shots.forEach((img) => {
      if (slug === "persyst") return;
      const large = img.getAttribute("src");
      expect(img.getAttribute("srcset")).toBe(`${large.replace("1400", "700")} 700w, ${large} 1400w`);
      expect(img.getAttribute("sizes")).toContain("(min-width: 1000px)");
      expect(img.getAttribute("sizes")).toContain("(min-width: 600px)");
    });
    const phone = target.querySelector(".work-phone");
    if (slug === "nextplay" || slug === "ambe") {
      expect(phone.getAttribute("src")).toBe(`${slug}-app-1-600.webp`);
    } else expect(phone).toBeNull();
  });
  expect(container.querySelector("#websites .work-shot").getAttribute("src"))
    .toBe("djohwoww-ss-1400.webp");
});

test("pointer entry advances every 1300ms, wraps, holds on leave and resumes from that shot", () => {
  render(<Work />);
  advance(5000);
  expect(activeShot()).toBe("nextplay-web-1-1400.webp");
  fireEvent.pointerEnter(card());
  advance(1299);
  expect(activeShot()).toBe("nextplay-web-1-1400.webp");
  advance(1);
  expect(activeShot()).toBe("nextplay-web-2-1400.webp");
  fireEvent.pointerLeave(card());
  advance(5000);
  expect(activeShot()).toBe("nextplay-web-2-1400.webp");
  fireEvent.pointerEnter(card());
  advance();
  expect(activeShot()).toBe("nextplay-web-3-1400.webp");
  advance();
  expect(activeShot()).toBe("nextplay-web-1-1400.webp");
  fireEvent.pointerCancel(card());
  expect(jest.getTimerCount()).toBe(0);
});

test("keyboard focus cycles independently of pointer leave and stops on blur", () => {
  render(<Work />);
  fireEvent.focus(card("ambe"));
  fireEvent.pointerEnter(card("ambe"));
  fireEvent.pointerLeave(card("ambe"));
  advance();
  expect(activeShot(card("ambe"))).toBe("ambe-web-3-1400.webp");
  fireEvent.blur(card("ambe"));
  advance(5000);
  expect(activeShot(card("ambe"))).toBe("ambe-web-3-1400.webp");
  expect(jest.getTimerCount()).toBe(0);
});

test("the shared pause store prevents cycling and holds the current shot until resumed", () => {
  render(<><Work /><PauseControl /></>);
  act(() => setSharedPaused(true));
  fireEvent.pointerEnter(card());
  advance(3900);
  expect(activeShot()).toBe("nextplay-web-1-1400.webp");
  expect(jest.getTimerCount()).toBe(0);
  act(() => setSharedPaused(false));
  advance();
  expect(activeShot()).toBe("nextplay-web-2-1400.webp");
  act(() => setSharedPaused(true));
  advance(3900);
  expect(activeShot()).toBe("nextplay-web-2-1400.webp");
  act(() => setSharedPaused(false));
  advance();
  expect(activeShot()).toBe("nextplay-web-3-1400.webp");
});

test("reduced motion prevents cycling and changes to the preference stop an active timer", () => {
  const { motion } = mockMedia({ reduced: true });
  render(<Work />);
  fireEvent.pointerEnter(card());
  fireEvent.focus(card("persyst"));
  advance(3900);
  expect(activeShot()).toBe("nextplay-web-1-1400.webp");
  expect(activeShot(card("persyst"))).toBe("persyst-app-1-1200.webp");
  expect(jest.getTimerCount()).toBe(0);
  const change = motion.addEventListener.mock.calls[0][1];
  act(() => { motion.matches = false; change(); });
  advance();
  expect(activeShot()).toBe("nextplay-web-2-1400.webp");
  expect(activeShot(card("persyst"))).toBe("persyst-app-2-1200.webp");
  act(() => { motion.matches = true; change(); });
  advance(3900);
  expect(activeShot()).toBe("nextplay-web-2-1400.webp");
  expect(jest.getTimerCount()).toBe(0);
});

test("touch cards cycle only at 60% visibility, respect pause/reduced motion and disconnect", () => {
  const { motion, hover } = mockMedia({ touch: true });
  mockObserverSupported = true;
  const observers = [];
  window.IntersectionObserver = jest.fn((callback, options) => {
    const observer = { callback, options, observe: jest.fn(), disconnect: jest.fn() };
    observers.push(observer);
    return observer;
  });
  const { unmount } = render(<><Work /><PauseControl /></>);
  const observer = observers.find((item) => item.observe.mock.calls[0][0] === card());
  expect(observer.options).toEqual({ threshold: 0.6 });
  const visible = (ratio) => act(() => observer.callback([{ isIntersecting: ratio > 0, intersectionRatio: ratio }]));
  visible(0.59);
  advance(3900);
  expect(activeShot()).toBe("nextplay-web-1-1400.webp");
  visible(0.6);
  advance();
  expect(activeShot()).toBe("nextplay-web-2-1400.webp");
  act(() => setSharedPaused(true));
  advance(3900);
  expect(activeShot()).toBe("nextplay-web-2-1400.webp");
  act(() => setSharedPaused(false));
  const change = motion.addEventListener.mock.calls[0][1];
  act(() => { motion.matches = true; change(); });
  advance(3900);
  expect(activeShot()).toBe("nextplay-web-2-1400.webp");
  act(() => { motion.matches = false; change(); });
  advance();
  expect(activeShot()).toBe("nextplay-web-3-1400.webp");
  visible(0.59);
  advance(3900);
  expect(activeShot()).toBe("nextplay-web-3-1400.webp");
  visible(1);
  act(() => {
    hover.matches = false;
    hover.addEventListener.mock.calls.forEach(([, listener]) => listener());
  });
  expect(jest.getTimerCount()).toBe(0);
  unmount();
  observers.forEach((item) => expect(item.disconnect).toHaveBeenCalled());
  expect(hover.removeEventListener).toHaveBeenCalledTimes(5);
});

test("single-shot cards stay still, absent browser APIs are safe and unmount clears timers", () => {
  window.matchMedia = undefined;
  window.IntersectionObserver = undefined;
  const { unmount } = render(<Work />);
  fireEvent.pointerEnter(card("curzonrelo"));
  fireEvent.focus(card("chinesepod"));
  advance(3900);
  expect(activeShot(card("curzonrelo"))).toBe("curzonrelo-ss-1400.webp");
  expect(activeShot(card("chinesepod"))).toBe("chinesepod-app-1400.webp");
  expect(jest.getTimerCount()).toBe(0);
  fireEvent.pointerEnter(card());
  expect(jest.getTimerCount()).toBe(1);
  unmount();
  expect(jest.getTimerCount()).toBe(0);
});

test("hover and keyboard focus place the section glow at the card in its product color", () => {
  render(<Work />);
  const section = screen.getByRole("region", { name: "Selected work" });
  jest.spyOn(section, "getBoundingClientRect").mockReturnValue({ left: 0, top: -400, width: 1000, height: 2000 });
  jest.spyOn(card(), "getBoundingClientRect").mockReturnValue({ left: 50, top: -200, width: 400, height: 600 });
  fireEvent.pointerEnter(card());
  expect(section.style.getPropertyValue("--glow")).toBe("var(--c-nextplay)");
  expect(section.style.getPropertyValue("--gx")).toBe("25%");
  expect(section.style.getPropertyValue("--gy")).toBe("25%");
  fireEvent.focus(card("ambe"));
  expect(section.style.getPropertyValue("--glow")).toBe("var(--c-ambe)");
  fireEvent.focus(screen.getByRole("link", { name: "DJ OhWoww (opens in a new tab)" }));
  expect(section.style.getPropertyValue("--glow")).toBe("var(--c-websites)");
});
