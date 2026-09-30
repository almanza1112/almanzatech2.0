import React, { StrictMode } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { interceptLinkClicks, matchRoute, navigate, useRoute } from "./router";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  window.scrollY = 0;
  jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  Element.prototype.scrollIntoView = jest.fn();
});

afterEach(() => {
  window.history.replaceState(null, "", "/");
  window.scrollY = 0;
  delete Element.prototype.scrollIntoView;
  delete window.matchMedia;
  jest.restoreAllMocks();
});

test.each(["/", "/unknown", "/work/unknown", "/work/ambe/extra", "/work/", "/privacy/extra", "/privacy-policy"])(
  "%s falls back to home", (path) => expect(matchRoute(path)).toEqual({ page: "home" })
);

test.each(["/privacy", "/privacy/"])(
  "%s maps to the privacy page", (path) => expect(matchRoute(path)).toEqual({ page: "privacy" })
);

test.each(["nextplay", "ambe", "curzonrelo", "persyst", "chinesepod"])(
  "matches %s with or without a trailing slash", (slug) => {
    expect(matchRoute(`/work/${slug}`)).toEqual({ page: "case", slug });
    expect(matchRoute(`/work/${slug}/`)).toEqual({ page: "case", slug });
  }
);

const RouteView = () => {
  const route = useRoute();
  return (
    <>
      <output>{route.page === "case" ? route.slug : "home"}</output>
      <a href="/work/ambe/"><span>Open Ambé</span></a>
      <a href="/#work">All work</a>
      {route.page === "home" && <section id="work">Work section</section>}
    </>
  );
};

test("installs one interceptor, handles nested link clicks and cleans up", () => {
  const push = jest.spyOn(window.history, "pushState");
  const { unmount } = render(<StrictMode><RouteView /><RouteView /></StrictMode>);
  fireEvent.click(screen.getAllByText("Open Ambé")[0]);
  expect(push).toHaveBeenCalledTimes(1);
  expect(window.location.pathname).toBe("/work/ambe/");
  expect(screen.getAllByText("ambe")).toHaveLength(2);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: "smooth" });
  unmount();
  const remove = jest.spyOn(document, "removeEventListener");
  const second = render(<RouteView />);
  second.unmount();
  expect(remove).toHaveBeenCalledWith("click", interceptLinkClicks);
});

test("owns scroll restoration only while the router is mounted", () => {
  window.history.scrollRestoration = "auto";
  const first = render(<RouteView />);
  const second = render(<RouteView />);
  expect(window.history.scrollRestoration).toBe("manual");
  first.unmount();
  expect(window.history.scrollRestoration).toBe("manual");
  second.unmount();
  expect(window.history.scrollRestoration).toBe("auto");
});

test("navigate saves the current scrollY and preserves state before pushing a new entry", () => {
  window.history.replaceState({ source: "home", scrollY: 20 }, "", "/");
  window.scrollY = 864;
  const replace = jest.spyOn(window.history, "replaceState");
  const push = jest.spyOn(window.history, "pushState");

  navigate("/work/ambe/");

  expect(replace).toHaveBeenCalledWith({ source: "home", scrollY: 864 }, "");
  expect(push).toHaveBeenCalledWith({ scrollY: 0 }, "", "/work/ambe/");
  expect(replace.mock.invocationCallOrder[0]).toBeLessThan(push.mock.invocationCallOrder[0]);
  expect(window.history.state).toEqual({ scrollY: 0 });
});

test.each([0, 864])("popstate restores scrollY %s after committing, ahead of hash scrolling", (scrollY) => {
  window.history.replaceState(null, "", "/work/ambe/");
  render(<RouteView />);
  window.scrollTo.mockClear();
  window.scrollTo.mockImplementation(() => {
    expect(screen.getByText("home")).toBeTruthy();
    expect(document.getElementById("work")).not.toBeNull();
  });

  act(() => {
    window.history.replaceState({ scrollY }, "", "/#work");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });

  expect(window.scrollTo).toHaveBeenCalledTimes(1);
  expect(window.scrollTo).toHaveBeenCalledWith({ top: scrollY, left: 0, behavior: "instant" });
  expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
});

test.each([null, { scrollY: "864" }])("popstate without a numeric position falls back to its hash (%j)", (state) => {
  window.history.replaceState(null, "", "/work/ambe/");
  render(<RouteView />);
  window.scrollTo.mockClear();

  act(() => {
    window.history.replaceState(state, "", "/#work");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });

  expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  expect(window.scrollTo).not.toHaveBeenCalled();
});

test.each([
  ["https://example.com/", {}, {}],
  ["//example.com/work/ambe/", {}, {}],
  ["/work/ambe/", { target: "_blank" }, {}],
  ["/work/ambe/", { target: "_self" }, {}],
  ["/work/ambe/", { download: "" }, {}],
  ["/work/ambe/", {}, { ctrlKey: true }],
  ["/work/ambe/", {}, { metaKey: true }],
  ["/work/ambe/", {}, { shiftKey: true }],
  ["/work/ambe/", {}, { altKey: true }],
  ["/work/ambe/", {}, { button: 1 }],
  ["/work/ambe/", {}, { button: 2 }],
  ["/work/ambe/", {}, { defaultPrevented: true }],
  ["#work", {}, {}],
  ["mailto:info@example.com", {}, {}],
  ["tel:+12014671007", {}, {}],
])("leaves native navigation for %s (%j, %j)", (href, attributes, modifiers) => {
  const link = document.createElement("a");
  link.href = href;
  Object.entries(attributes).forEach(([name, value]) => link.setAttribute(name, value));
  const event = { target: link, button: 0, preventDefault: jest.fn(), ...modifiers };
  const push = jest.spyOn(window.history, "pushState");
  interceptLinkClicks(event);
  expect(event.preventDefault).not.toHaveBeenCalled();
  expect(push).not.toHaveBeenCalled();
});

test("scrolls to the destination hash after rendering, including repeated links", () => {
  window.history.replaceState(null, "", "/work/ambe/");
  render(<RouteView />);
  fireEvent.click(screen.getByText("All work"));
  expect(screen.getByText("home")).toBeTruthy();
  expect(document.getElementById("work")).toBe(document.activeElement);
  expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({
    behavior: "smooth", block: "start",
  });
  fireEvent.click(screen.getByText("All work"));
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(2);
  act(() => navigate("/#%77ork"));
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(3);
});

test("uses instant scrolling under reduced motion, with safe missing hashes", () => {
  window.matchMedia = jest.fn(() => ({ matches: true }));
  render(<RouteView />);
  act(() => navigate("/#work"));
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
    behavior: "instant", block: "start",
  });
  for (const url of ["/#missing", "/#%E0%A4%A", "/work/nextplay/"]) {
    act(() => navigate(url));
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: "instant" });
  }
});

test("back and forward popstate events restore the route and saved position", async () => {
  render(<RouteView />);
  act(() => navigate("/#work"));
  window.scrollY = 864;
  act(() => navigate("/work/persyst/?source=next"));
  expect(screen.getByText("persyst")).toBeTruthy();
  Element.prototype.scrollIntoView.mockClear();
  act(() => window.history.back());
  await waitFor(() => expect(screen.getByText("home")).toBeTruthy());
  expect(window.location.hash).toBe("#work");
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 864, left: 0, behavior: "instant" });
  expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  act(() => window.history.forward());
  await waitFor(() => expect(screen.getByText("persyst")).toBeTruthy());
  expect(window.location.search).toBe("?source=next");
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: "instant" });
});
