import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import Hero from "./Hero";
import { CASE_STUDIES, PAGE_COPY, WEBSITES } from "../data/work";
import { prefersReducedMotion, usePausedMotion } from "../lib/motion";

let mockObserverSupported = false;
jest.mock("../lib/motion", () => ({
  ...jest.requireActual("../lib/motion"),
  get supportsObserver() { return mockObserverSupported; },
}));
jest.mock("../lib/analytics", () => ({ track: jest.fn() }));

const originalMatchMedia = window.matchMedia;
const originalObserver = window.IntersectionObserver;
let setSharedPaused;
const MotionConsumer = () => {
  const [paused, setPaused] = usePausedMotion();
  setSharedPaused = setPaused;
  return <output data-testid="shared-pause">{String(paused)}</output>;
};

const mockMedia = ({ reduced = false, desktop = false } = {}) => {
  const media = {
    matches: reduced,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  window.matchMedia = jest.fn((query) => query === "(prefers-reduced-motion: reduce)"
    ? media : { matches: desktop });
  return media;
};

afterEach(() => {
  if (setSharedPaused) act(() => setSharedPaused(false));
  setSharedPaused = undefined;
  cleanup();
  window.matchMedia = originalMatchMedia;
  window.IntersectionObserver = originalObserver;
  mockObserverSupported = false;
  jest.restoreAllMocks();
});

test("heading and proof preserve the exact supplied copy and desktop line breaks", () => {
  const { container } = render(<Hero />);
  const heading = screen.getByRole("heading", { level: 1, name: PAGE_COPY.hero.heading });
  expect(heading.textContent).toBe(PAGE_COPY.hero.heading);
  expect([...heading.querySelectorAll(".hero-line")].map((line) => line.textContent)).toEqual([
    "Custom websites, apps", "and IT support for small", "businesses and founders.",
  ]);
  const proof = container.querySelector(".hero-proof");
  expect(proof.textContent).toBe(PAGE_COPY.hero.proof);
  expect(proof.querySelector(".hero-outline").textContent).toBe("Built in-house.");
  expect(proof.querySelector(".keep-together").textContent).toBe("in-house.");
  expect(within(container.querySelector(".hero-actions")).getByRole("link", {
    name: PAGE_COPY.hero.cta.label,
  }).getAttribute("href")).toBe(PAGE_COPY.hero.cta.href);
});

test("hero contains no phone link or call label", () => {
  render(<Hero />);
  const hero = screen.getByRole("region", { name: PAGE_COPY.hero.heading });
  expect(hero.querySelector('a[href^="tel:"]')).toBeNull();
  expect(hero.textContent).not.toMatch(/or call/i);
});

test("wall has five decorative columns with two identical five-screen sets each", () => {
  const { container } = render(<Hero />);
  const wall = container.querySelector(".hero-wall");
  expect(wall.getAttribute("aria-hidden")).toBe("true");
  const columns = [...wall.children];
  expect(columns).toHaveLength(5);
  const expected = [
    ["01-dashboard", "05-shop", "09-onboard", "03-list", "12-light"],
    ["02-chart", "07-settings", "04-calendar", "11-player", "06-chat"],
    ["08-map", "03-list", "12-light", "01-dashboard", "10-form"],
    ["06-chat", "11-player", "02-chart", "09-onboard", "05-shop"],
    ["04-calendar", "10-form", "07-settings", "08-map", "01-dashboard"],
  ];
  columns.forEach((column, index) => {
    expect(column.querySelectorAll("img")).toHaveLength(10);
    const sets = column.querySelectorAll(".wall-set");
    expect(sets).toHaveLength(2);
    expect(sets[1].innerHTML).toBe(sets[0].innerHTML);
    expect([...sets[0].querySelectorAll("img")].map((img) => img.getAttribute("src")))
      .toEqual(expected[index].map((name) => `screen-${name}.svg`));
  });
  wall.querySelectorAll("img").forEach((image) => {
    expect(image.getAttribute("alt")).toBe("");
    expect(image.getAttribute("decoding")).toBe("async");
  });
  expect(screen.queryByRole("img")).toBeNull();
});

test("ticker derives all seven names and tags in site order and hides its duplicate", () => {
  render(<Hero />);
  const ticker = screen.getByRole("region", { name: "Recent work" });
  const groups = ticker.querySelectorAll(".hero-ticker-group");
  expect(groups).toHaveLength(2);
  expect(groups[0].hasAttribute("aria-hidden")).toBe(false);
  expect(groups[1].getAttribute("aria-hidden")).toBe("true");
  expect(groups[1].innerHTML).toBe(groups[0].innerHTML);
  const items = [...groups[0].querySelectorAll(".hero-ticker-item")];
  expect(items.map((item) => item.querySelector("b").textContent))
    .toEqual([...CASE_STUDIES, ...WEBSITES].map(({ name }) => name));
  expect(items.map((item) => item.querySelector("span").textContent))
    .toEqual([...CASE_STUDIES.map(({ tags }) => tags.join(" · ")), ...WEBSITES.map(() => "Website")]);
});

test("pause toggles its label, pressed state and the shared store, persisting across remounts", () => {
  const view = render(<><Hero /><MotionConsumer /></>);
  const button = screen.getByRole("button", { name: "Pause motion" });
  expect(button.getAttribute("aria-pressed")).toBe("false");
  fireEvent.click(button);
  expect(screen.getByRole("button", { name: "Play motion" }).getAttribute("aria-pressed")).toBe("true");
  expect(document.documentElement.classList.contains("motion-paused")).toBe(true);
  expect(screen.getByTestId("shared-pause").textContent).toBe("true");
  view.unmount();
  render(<><Hero /><MotionConsumer /></>);
  fireEvent.click(screen.getByRole("button", { name: "Play motion" }));
  expect(screen.getByRole("button", { name: "Pause motion" }).getAttribute("aria-pressed")).toBe("false");
  expect(document.documentElement.classList.contains("motion-paused")).toBe(false);
  expect(screen.getByTestId("shared-pause").textContent).toBe("false");
});

test("offscreen and hidden-tab pauses combine without changing the user's pause choice", () => {
  mockObserverSupported = true;
  let intersect;
  const observer = { observe: jest.fn(), disconnect: jest.fn() };
  window.IntersectionObserver = jest.fn((callback) => {
    intersect = callback;
    return observer;
  });
  const hidden = jest.spyOn(document, "hidden", "get").mockReturnValue(false);
  const { container, unmount } = render(<><Hero /><MotionConsumer /></>);
  const hero = container.querySelector(".hero");
  expect(observer.observe).toHaveBeenCalledWith(hero);
  const isPaused = () => hero.classList.contains("hero--paused");
  expect(isPaused()).toBe(false);
  act(() => intersect([{ isIntersecting: false }]));
  expect(isPaused()).toBe(true);
  fireEvent(document, new Event("visibilitychange"));
  expect(isPaused()).toBe(true);
  hidden.mockReturnValue(true);
  fireEvent(document, new Event("visibilitychange"));
  act(() => intersect([{ isIntersecting: true }]));
  expect(isPaused()).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Pause motion" }));
  hidden.mockReturnValue(false);
  fireEvent(document, new Event("visibilitychange"));
  expect(isPaused()).toBe(false);
  expect(document.documentElement.classList.contains("motion-paused")).toBe(true);
  expect(screen.getByRole("button", { name: "Play motion" }).getAttribute("aria-pressed")).toBe("true");
  unmount();
  expect(observer.disconnect).toHaveBeenCalledTimes(1);
});

test("missing matchMedia and IntersectionObserver keep the hero usable", () => {
  window.matchMedia = undefined;
  window.IntersectionObserver = undefined;
  expect(prefersReducedMotion()).toBe(false);
  render(<Hero />);
  expect(screen.getByRole("heading", { name: PAGE_COPY.hero.heading })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Pause motion" })).toBeTruthy();
});

test("reduced motion hides the control, keeps content visible and responds to preference changes", () => {
  const media = mockMedia({ reduced: true, desktop: true });
  const { container, unmount } = render(<Hero />);
  expect(prefersReducedMotion()).toBe(true);
  expect(screen.queryByRole("button")).toBeNull();
  expect(container.querySelector(".hero--entered")).toBeNull();
  expect(screen.getByRole("heading", { name: PAGE_COPY.hero.heading })).toBeTruthy();
  expect(screen.getByRole("link", { name: PAGE_COPY.hero.cta.label })).toBeTruthy();
  const [event, change] = media.addEventListener.mock.calls[0];
  expect(event).toBe("change");
  act(() => { media.matches = false; change(); });
  expect(screen.getByRole("button", { name: "Pause motion" })).toBeTruthy();
  act(() => { media.matches = true; change(); });
  expect(screen.queryByRole("button")).toBeNull();
  expect(container.querySelector(".hero--entered")).toBeNull();
  unmount();
  expect(media.removeEventListener).toHaveBeenCalledWith("change", change);
});

test("desktop entrance runs once after mount and cleans up its animation frame", () => {
  const media = mockMedia({ desktop: true });
  let enter;
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { enter = callback; return 42; });
  const cancel = jest.spyOn(window, "cancelAnimationFrame");
  const { container, unmount } = render(<Hero />);
  expect(container.querySelector(".hero--entered")).toBeNull();
  act(() => enter());
  expect(container.querySelector(".hero--entered")).toBeTruthy();
  fireEvent.animationEnd(container.querySelector(".hero-actions"));
  expect(container.querySelector(".hero--entered")).toBeNull();
  const change = media.addEventListener.mock.calls[0][1];
  act(() => { media.matches = true; change(); });
  act(() => { media.matches = false; change(); });
  expect(container.querySelector(".hero--entered")).toBeNull();
  expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
  unmount();
  expect(cancel).toHaveBeenCalledWith(42);
});

test("small screens do not enable the desktop entrance", () => {
  mockMedia();
  const frame = jest.spyOn(window, "requestAnimationFrame");
  const { container } = render(<Hero />);
  expect(container.querySelector(".hero--entered")).toBeNull();
  expect(frame).not.toHaveBeenCalled();
});
