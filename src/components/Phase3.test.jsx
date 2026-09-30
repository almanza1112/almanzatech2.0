import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import Process from "./Process";
import About from "./About";
import Faq from "./Faq";
import { CASE_STUDIES, FAQ_ITEMS, PAGE_COPY, PROCESS_STEPS, TESTIMONIALS } from "../data/work";

let mockObserverSupported = false;
jest.mock("../lib/motion", () => ({
  ...jest.requireActual("../lib/motion"),
  get supportsObserver() { return mockObserverSupported; },
}));

const originalMatchMedia = window.matchMedia;
const originalObserver = window.IntersectionObserver;
const originalHeight = window.innerHeight;
let frames;
let media;

beforeEach(() => {
  frames = new Map();
  let frameId = 0;
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    frames.set(++frameId, callback);
    return frameId;
  });
  jest.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => frames.delete(id));
  media = { matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() };
  window.matchMedia = jest.fn(() => media);
  window.innerHeight = 1000;
});

afterEach(() => {
  cleanup();
  window.matchMedia = originalMatchMedia;
  window.IntersectionObserver = originalObserver;
  window.innerHeight = originalHeight;
  mockObserverSupported = false;
  jest.restoreAllMocks();
});

const flushFrames = () => act(() => {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((callback) => callback());
});
const setReduced = (matches) => act(() => {
  media.matches = matches;
  media.addEventListener.mock.calls.forEach(([, listener]) => listener());
});
const steps = () => document.querySelector(".proc-steps");
const lead = () => document.querySelector(".about-lead");
const expectFinished = () => {
  expect(steps().style.getPropertyValue("--p")).toBe("1");
  expect(document.querySelectorAll(".proc-step--lit")).toHaveLength(4);
  expect(document.querySelectorAll(".about-word--dim")).toHaveLength(0);
  expect(lead().textContent).toBe(PAGE_COPY.about.lead);
};

test("process keeps four ordered steps and verbatim copy beside a lazy decorative responsive photo", () => {
  render(<Process />);
  const section = screen.getByRole("region", { name: PAGE_COPY.process.heading });
  expect(within(section).getByText(PAGE_COPY.process.intro).textContent).toBe(PAGE_COPY.process.intro);
  const list = within(section).getByRole("list");
  expect(list.tagName).toBe("OL");
  const items = within(list).getAllByRole("listitem");
  expect(items).toHaveLength(4);
  items.forEach((item, index) => {
    expect(within(item).getByRole("heading", { level: 3 }).textContent).toBe(PROCESS_STEPS[index].heading);
    expect(item.querySelector("p").textContent).toBe(PROCESS_STEPS[index].text);
    expect(item.querySelector('[aria-hidden="true"]').textContent).toBe(String(index + 1));
  });
  const photo = section.querySelector("img");
  expect(section.querySelectorAll("img")).toHaveLength(1);
  expect(photo.getAttribute("alt")).toBe("");
  expect(within(section).queryByRole("img")).toBeNull();
  expect(photo.getAttribute("loading")).toBe("lazy");
  expect(photo.getAttribute("src")).toBe("owner-call-800.webp");
  expect(photo.getAttribute("srcset")).toBe("owner-call-800.webp 800w, owner-call-1600.webp 1600w");
  expect(photo.getAttribute("sizes")).toBe("(min-width: 1000px) 50vw, 100vw");
});

test.each([false, true])("About keeps exact lead, reviews, attributions and project links (reduced: %s)", (reduced) => {
  media.matches = reduced;
  render(<About />);
  const section = screen.getByRole("region", { name: PAGE_COPY.about.heading });
  expect(section.classList.contains("wrap")).toBe(false);
  expect(section.firstElementChild.classList.contains("wrap")).toBe(true);
  expect(lead().textContent).toBe(PAGE_COPY.about.lead);
  expect(lead().querySelectorAll("span")).toHaveLength(reduced ? 0 : PAGE_COPY.about.lead.split(" ").length);
  expect(within(section).getByText(PAGE_COPY.about.body).textContent).toBe(PAGE_COPY.about.body);
  expect(within(section).getByRole("heading", { level: 3 }).textContent).toBe(PAGE_COPY.about.reviewsHeading);
  const reviews = within(section).getAllByRole("listitem");
  expect(reviews).toHaveLength(3);
  reviews.forEach((review, index) => {
    const testimonial = TESTIMONIALS[index];
    expect(review.querySelector("figure > blockquote > p").textContent).toBe(testimonial.quote);
    const attribution = review.querySelector("figure > figcaption");
    expect(attribution.textContent).toBe(testimonial.attribution);
    const project = CASE_STUDIES.find(({ slug }) => slug === testimonial.projectId);
    if (project) {
      const link = within(attribution).getByRole("link", { name: project.name });
      expect(link.getAttribute("href")).toBe(`/work/${project.slug}/`);
    } else expect(within(attribution).queryByRole("link")).toBeNull();
    expect(review.querySelector("figure").style.getPropertyValue("--c"))
      .toBe(`var(--c-${project ? project.slug : "websites"})`);
  });
});

test("FAQ keeps six questions, exact answers and the existing case links inside a full-bleed section", () => {
  render(<Faq />);
  const section = screen.getByRole("region", { name: PAGE_COPY.faq.heading });
  expect(section.classList.contains("wrap")).toBe(false);
  expect(section.firstElementChild.classList.contains("wrap")).toBe(true);
  const items = [...section.querySelector("dl").children];
  expect(items).toHaveLength(6);
  items.forEach((item, index) => {
    const { question, answer } = FAQ_ITEMS[index];
    expect(item.querySelector("dt").textContent).toBe(question);
    expect(item.querySelector("dd").textContent).toBe(answer.map((part) => typeof part === "string" ? part : part.label).join(""));
    expect(within(item).queryAllByRole("link").map((link) => [link.textContent, link.getAttribute("href")]))
      .toEqual(answer.filter((part) => typeof part !== "string").map(({ label, href }) => [label, href]));
  });
});

test("initial render is fully lit; passive scroll updates are batched and clamp at the specified viewport boundaries", () => {
  const add = jest.spyOn(window, "addEventListener");
  render(<><Process /><About /></>);
  expectFinished();
  const processBounds = jest.spyOn(steps(), "getBoundingClientRect");
  const aboutBounds = jest.spyOn(lead(), "getBoundingClientRect");
  const positions = (processTop, aboutTop) => {
    processBounds.mockReturnValue({ top: processTop, height: 400 });
    aboutBounds.mockReturnValue({ top: aboutTop, height: 400 });
  };
  positions(1000, 1000);
  flushFrames();
  expect(steps().style.getPropertyValue("--p")).toBe("0");
  expect(document.querySelectorAll(".proc-step--lit")).toHaveLength(1);
  expect(document.querySelectorAll(".about-word--dim")).toHaveLength(PAGE_COPY.about.lead.split(" ").length);
  expect(lead().textContent).toBe(PAGE_COPY.about.lead);
  expect(add.mock.calls.filter(([type]) => type === "scroll").map(([, , options]) => options))
    .toEqual([{ passive: true }, { passive: true }]);

  positions(800, 900);
  fireEvent.scroll(window);
  flushFrames();
  expect(steps().style.getPropertyValue("--p")).toBe("0");
  positions(375, 475);
  fireEvent.scroll(window);
  fireEvent.scroll(window);
  expect(frames.size).toBe(2);
  expect(steps().style.getPropertyValue("--p")).toBe("0");
  flushFrames();
  expect(steps().style.getPropertyValue("--p")).toBe("0.5");
  expect(document.querySelectorAll(".proc-step--lit")).toHaveLength(2);
  const words = [...lead().querySelectorAll("span")];
  expect(words.filter((word) => !word.classList.contains("about-word--dim")))
    .toHaveLength(Math.round(words.length / 2));
  expect(lead().textContent).toBe(PAGE_COPY.about.lead);

  positions(-50, 50); // The bottom edges reach 35% and 45% of the viewport.
  fireEvent.scroll(window);
  flushFrames();
  expectFinished();
  positions(-1000, -1000);
  fireEvent.scroll(window);
  flushFrames();
  expectFinished();
  positions(800, 900);
  fireEvent.resize(window);
  flushFrames();
  expect(steps().style.getPropertyValue("--p")).toBe("0");
});

test("reduced motion starts complete without word spans, observers, frames or scroll listeners", () => {
  media.matches = true;
  mockObserverSupported = true;
  window.IntersectionObserver = jest.fn();
  const add = jest.spyOn(window, "addEventListener");
  render(<><Process /><About /></>);
  expectFinished();
  expect(lead().children).toHaveLength(0);
  expect(window.IntersectionObserver).not.toHaveBeenCalled();
  expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  expect(add.mock.calls.filter(([type]) => type === "scroll")).toHaveLength(0);
});

test("changing reduced motion restores final states, cancels queued work and removes listeners", () => {
  const remove = jest.spyOn(window, "removeEventListener");
  const { unmount } = render(<><Process /><About /></>);
  jest.spyOn(steps(), "getBoundingClientRect").mockReturnValue({ top: 1000, height: 400 });
  jest.spyOn(lead(), "getBoundingClientRect").mockReturnValue({ top: 1000, height: 400 });
  flushFrames();
  fireEvent.scroll(window);
  expect(frames.size).toBe(2);
  setReduced(true);
  expectFinished();
  expect(lead().children).toHaveLength(0);
  expect(frames.size).toBe(0);
  expect(remove.mock.calls.filter(([type]) => type === "scroll")).toHaveLength(2);
  fireEvent.scroll(window);
  expect(frames.size).toBe(0);
  setReduced(false);
  expectFinished();
  expect(lead().children.length).toBeGreaterThan(0);
  expect(frames.size).toBe(2);
  unmount();
  expect(frames.size).toBe(0);
  expect(remove.mock.calls.filter(([type]) => type === "scroll")).toHaveLength(4);
  expect(remove.mock.calls.filter(([type]) => type === "resize")).toHaveLength(4);
  expect(media.removeEventListener).toHaveBeenCalledTimes(2);
});

test("observers skip offscreen reads, measure reentry and disconnect on unmount", () => {
  mockObserverSupported = true;
  const observers = [];
  window.IntersectionObserver = jest.fn((callback) => {
    const observer = { callback, observe: jest.fn(), disconnect: jest.fn() };
    observers.push(observer);
    return observer;
  });
  const { unmount } = render(<><Process /><About /></>);
  expect(observers.map((observer) => observer.observe.mock.calls[0][0])).toEqual([steps(), lead()]);
  jest.spyOn(steps(), "getBoundingClientRect").mockReturnValue({ top: 1000, height: 400 });
  jest.spyOn(lead(), "getBoundingClientRect").mockReturnValue({ top: 1000, height: 400 });
  act(() => observers.forEach((observer) => observer.callback([{ isIntersecting: false }])));
  flushFrames();
  fireEvent.scroll(window);
  expect(frames.size).toBe(0);
  act(() => observers.forEach((observer) => observer.callback([{ isIntersecting: true }])));
  expect(frames.size).toBe(2);
  flushFrames();
  expect(steps().style.getPropertyValue("--p")).toBe("0");
  fireEvent.scroll(window);
  expect(frames.size).toBe(2);
  unmount();
  expect(frames.size).toBe(0);
  observers.forEach((observer) => expect(observer.disconnect).toHaveBeenCalledTimes(1));
});

test("missing matchMedia and IntersectionObserver are safe, and missing rAF leaves final states", () => {
  window.matchMedia = undefined;
  window.IntersectionObserver = undefined;
  const requestFrame = window.requestAnimationFrame;
  window.requestAnimationFrame = undefined;
  try {
    render(<><Process /><About /></>);
    expectFinished();
    fireEvent.scroll(window);
    expect(frames.size).toBe(0);
  } finally {
    window.requestAnimationFrame = requestFrame;
  }
});
