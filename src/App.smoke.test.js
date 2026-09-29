import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import App from "./App";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Work from "./components/Work";
import Services from "./components/Services";
import Process from "./components/Process";
import About from "./components/About";
import Faq from "./components/Faq";
import ContactUs from "./components/ContactUs";
import CallBar from "./components/CallBar";
import { SITE } from "./data/site";
import {
  CASE_STUDIES,
  WEBSITES,
  TESTIMONIALS,
  SERVICES,
  PAGE_COPY,
} from "./data/work";
import { track } from "./lib/analytics";
import { navigate } from "./lib/router";

let mockObserverSupported = false;

jest.mock("./lib/motion", () => ({
  ...jest.requireActual("./lib/motion"),
  get supportsObserver() {
    return mockObserverSupported;
  },
}));

jest.mock("./lib/analytics", () => ({ track: jest.fn() }));
jest.mock("./lib/leads", () => ({
  submitLead: jest.fn(),
  prepareLeadClient: jest.fn(() => Promise.resolve()),
}));

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  Element.prototype.scrollIntoView = jest.fn();
});

afterEach(() => {
  window.history.replaceState(null, "", "/");
  delete Element.prototype.scrollIntoView;
  mockObserverSupported = false;
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("renders the whole page without crashing", () => {
  render(<App />);

  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
    "Custom websites, apps and IT support for small businesses and founders."
  );
  expect(document.title).toBe(
    "AlmanzaTech — Custom Websites, Apps & IT Support · Northern New Jersey"
  );
  expect(document.querySelector(".hero-strip")).toBeNull();
  const servicesSection = document.getElementById("services");
  // The shared header logo is outside the homepage content.
  screen.getByRole("main").querySelectorAll("img").forEach((image) => {
    expect(servicesSection.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_FOLLOWING)
      .toBeTruthy();
  });
  expect(document.querySelectorAll("h2")).toHaveLength(6);
  for (const id of ["services", "work", "process", "about", "faq", "contact"]) {
    expect(document.getElementById(id)?.tagName).toBe("SECTION");
  }
  document.querySelectorAll('a[href^="/#"], a[href^="#"]').forEach((link) => {
    const target = document.getElementById(new URL(link.href).hash.slice(1));
    expect(target).not.toBeNull();
  });
  expect(document.querySelector('a[href^="#"]')).toBeNull();
  const pageText = document.body.textContent.replace(/\s+/g, " ");
  expect(pageText).not.toMatch(/guaran[t]ee|one[-]year/i);
  for (const phrase of [
    "Scroll sideways",
    "Built in New Jersey",
    "Design is not decoration",
    "No black box",
  ]) {
    expect(pageText).not.toContain(phrase);
  }
  expect(
    screen.getByRole("heading", { level: 2, name: "Selected work" })
  ).toBeTruthy();
  expect(
    screen.getByRole("heading", { level: 2, name: "What we do" })
  ).toBeTruthy();
  expect(
    screen.getByRole("heading", { level: 2, name: "How working with us works" })
  ).toBeTruthy();
  expect(
    screen.getByRole("heading", { level: 2, name: "About us" })
  ).toBeTruthy();
  expect(
    screen.getByRole("heading", { level: 2, name: "Questions people ask" })
  ).toBeTruthy();
  expect(
    screen.getByRole("heading", { level: 2, name: "Tell us about your project." })
  ).toBeTruthy();
  const form = screen.getByRole("form", { name: "Tell us about your project." });
  for (const label of [
    "Your name",
    "Email address",
    "What would you like to build?",
  ]) {
    expect(within(form).getByLabelText(label, { exact: true })).toBeTruthy();
  }
  const needs = within(form).getByRole("group", { name: "What do you need? (optional)" });
  expect(within(needs).getAllByRole("radio")).toHaveLength(4);
  expect(within(form).getByRole("button", { name: "Send message" })).toBeTruthy();

  const footer = screen.getByRole("contentinfo");
  expect(footer.textContent).not.toContain("New Jersey");
  expect(footer.querySelector('a[href^="tel:"], a[href^="mailto:"]')).toBeNull();
  expect(within(footer).getByText(PAGE_COPY.footer.tagline)).toBeTruthy();
  expect(within(footer).getByText(`© ${new Date().getFullYear()} AlmanzaTech LLC`))
    .toBeTruthy();
  expect(within(footer).getByRole("link", { name: SITE.shortName })
    .getAttribute("href")).toBe("/#top");
  const footerNav = within(footer).getByRole("navigation", { name: "Footer" });
  expect(within(footerNav).getAllByRole("link").map((link) => [
    link.textContent,
    link.getAttribute("href"),
  ])).toEqual([
    ["Services", "/#services"],
    ["Work", "/#work"],
    ["About", "/#about"],
    ["FAQ", "/#faq"],
    ["Contact", "/#contact"],
  ]);
  expect(within(footer).queryByRole("link", { name: /back to top/i })).toBeNull();
  TESTIMONIALS.forEach(({ quote }) => {
    expect(within(document.getElementById("about")).getByText(quote, { exact: true }))
      .toBeTruthy();
  });

  const work = document.getElementById("work");
  const caseLinks = [...work.querySelectorAll('a[href^="/work/"]')];
  expect(caseLinks.map((link) => link.getAttribute("href"))).toEqual([
    "/work/nextplay/", "/work/ambe/", "/work/curzonrelo/", "/work/persyst/", "/work/chinesepod/",
  ]);
  caseLinks.forEach((link, index) => {
    expect(link.textContent).toContain(CASE_STUDIES[index].name);
    expect(link.textContent).toContain("View project");
  });

  const services = screen.getByRole("region", { name: "What we do" });
  expect(within(services).getAllByRole("link").map((link) => link.getAttribute("href")))
    .toEqual(["/#contact"]);
  document.querySelectorAll('a[href^="/work/"]').forEach((link) => {
    expect(CASE_STUDIES.map(({ slug }) => `/work/${slug}/`))
      .toContain(link.getAttribute("href"));
  });

  expect(
    Array.from(screen.getByRole("main").children, (section) => section.id)
  ).toEqual(["top", "services", "work", "process", "about", "faq", "contact"]);

  // Key conversion paths are present and tappable.
  expect(screen.getAllByRole("link", { name: /201/ }).length).toBeGreaterThan(0);
  expect(screen.getByRole("button", { name: /send message/i })).toBeTruthy();
  expect(screen.getByText("Menu", { selector: "summary" })).toBeTruthy();
});

test.each(CASE_STUDIES)("deep-links to $slug with the supplied copy and next project", (project) => {
  window.history.pushState(null, "", `/work/${project.slug}/`);
  render(<App />);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(project.name);
  expect(document.title).toBe(`${project.name} case study · AlmanzaTech`);
  expect(document.body.textContent).not.toMatch(/guaran[t]ee|one[-]year/i);
  document.querySelectorAll('a[href^="/work/"]').forEach((link) => {
    expect(CASE_STUDIES.map(({ slug }) => `/work/${slug}/`))
      .toContain(link.getAttribute("href"));
  });
  const article = screen.getByRole("article", { name: project.name });
  expect(within(article).getByText(project.kicker, { exact: true })).toBeTruthy();
  expect(within(article).getByText(project.roleLine, { exact: true })).toBeTruthy();
  expect(within(article).getByText(project.outcome, { exact: true })).toBeTruthy();
  for (const paragraph of project.paragraphs) expect(article.textContent).toContain(paragraph);
  expect(document.querySelector(".hero")).toBeNull();
  expect(document.getElementById("contact")).toBeNull();
  expect(document.querySelector('a[href^="#"]')).toBeNull();
  expect(screen.getByRole("link", { name: "← All work" }).getAttribute("href")).toBe("/#work");
  if (project.img) {
    const image = within(article).getAllByRole("img")[0];
    expect(image.getAttribute("loading")).toBe("eager");
    expect(image.getAttribute("srcset"))
      .toBe(`${project.img.small} 700w, ${project.img.large} 1400w`);
    expect(image.getAttribute("sizes")).toContain("1312px");
    expect(image.getAttribute("width")).toBe(String(project.img.width));
    expect(image.getAttribute("height")).toBe(String(project.img.height));
    expect(within(article).getByText(project.caption, { exact: true })).toBeTruthy();
  } else {
    expect(within(article).queryByRole("img")).toBeNull();
    expect(article.querySelector(".case-details").textContent).toContain(project.context);
  }
  const quote = TESTIMONIALS.find(({ projectId }) => projectId === project.testimonialId);
  if (quote) {
    expect(within(article).getByText(quote.quote, { exact: true })).toBeTruthy();
    expect(within(article).getByText(quote.attribution, { exact: true })).toBeTruthy();
  } else {
    expect(article.querySelector("blockquote")).toBeNull();
  }
  const next = CASE_STUDIES[(CASE_STUDIES.indexOf(project) + 1) % CASE_STUDIES.length];
  expect(within(screen.getByRole("navigation", { name: "Next project" }))
    .getByRole("link", { name: next.name }).getAttribute("href")).toBe(`/work/${next.slug}/`);
});

test("NextPlay keeps the summary, build note, context and stack", () => {
  window.history.pushState(null, "", "/work/nextplay/");
  render(<App />);
  const project = CASE_STUDIES[0];
  expect(screen.getByText(project.summary, { exact: true })).toBeTruthy();
  expect(screen.getByRole("heading", { level: 2, name: project.buildNote.heading })).toBeTruthy();
  expect(document.querySelector(".case-copy").textContent).toContain(project.buildNote.text);
  expect(screen.getByText("sign-in").classList.contains("keep-together")).toBe(true);
  expect(screen.getByText(project.context, { exact: true })).toBeTruthy();
  expect(screen.getByText(project.stack, { exact: true })).toBeTruthy();
});

test("case links track external, next-project and contact events and navigate home", () => {
  window.history.pushState(null, "", "/work/ambe/");
  render(<App />);
  for (const link of CASE_STUDIES[1].links) {
    const anchor = screen.getByRole("link", { name: `${link.label} (opens in a new tab)` });
    expect(anchor.getAttribute("href")).toBe(link.href);
    expect(anchor.getAttribute("target")).toBe("_blank");
    expect(anchor.getAttribute("rel")).toBe("noopener noreferrer");
    fireEvent.click(anchor);
    expect(track).toHaveBeenLastCalledWith("cta_click", {
      label: `Ambé Wellness: ${link.label}`, location: "case_study",
    });
  }
  fireEvent.click(screen.getByRole("link", { name: "CurzonRelo" }));
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("CurzonRelo");
  expect(document.title).toBe("CurzonRelo case study · AlmanzaTech");
  expect(track).toHaveBeenLastCalledWith("cta_click", {
    label: "Next: CurzonRelo", location: "case_study",
  });
  fireEvent.click(screen.getByRole("link", { name: "Tell us about your project" }));
  expect(window.location.pathname + window.location.hash).toBe("/#contact");
  expect(document.title).toBe(PAGE_COPY.homeTitle);
  expect(document.activeElement.id).toBe("contact");
  expect(track).toHaveBeenLastCalledWith("cta_click", {
    label: "Tell us about your project", location: "case_study",
  });
  expect(track.mock.calls.some(([event]) => event === "page_view")).toBe(false);
});

test.each([
  [".hdr-logo", "top"], [".hdr-nav .hdr-link", "services"],
  ['.hdr-nav a[href="/#contact"]', "contact"], [".case-back", "work"],
  [".foot-logo", "top"], [".foot-links a", "services"],
  ['.foot-links a[href="/#faq"]', "faq"],
  ['.hdr-panel a[href="/#process"]', "process"],
  ['.hdr-panel a[href="/#faq"]', "faq"],
  [".callbar-start", "contact"],
])("case-page %s returns to the homepage's %s section", (selector, id) => {
  window.history.pushState(null, "", "/work/ambe/");
  render(<App />);
  fireEvent.click(document.querySelector(selector));
  expect(window.location.pathname + window.location.hash).toBe(`/#${id}`);
  expect(document.activeElement).toBe(document.getElementById(id));
  expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
});

test("section views track the six homepage sections in document order", () => {
  mockObserverSupported = true;
  const observers = [];
  const originalObserver = window.IntersectionObserver;
  window.IntersectionObserver = jest.fn((callback, options) => {
    const observer = {
      callback,
      options,
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };
    observers.push(observer);
    return observer;
  });

  try {
    const { unmount } = render(<App />);
    const sectionObserver = observers.find(
      ({ options }) => options.rootMargin === "-40% 0px -40% 0px"
    );
    const sections = sectionObserver.observe.mock.calls.map(([target]) => target);
    expect(sections.map(({ id }) => id)).toEqual([
      "services", "work", "process", "about", "faq", "contact",
    ]);
    act(() => sectionObserver.callback(
      sections.map((target) => ({ target, isIntersecting: false }))
    ));
    expect(track).not.toHaveBeenCalled();

    act(() => sectionObserver.callback(
      sections.map((target) => ({ target, isIntersecting: true }))
    ));
    expect(track.mock.calls).toEqual([
      ["section_view", { section_id: "services" }],
      ["section_view", { section_id: "work" }],
      ["section_view", { section_id: "process" }],
      ["section_view", { section_id: "about" }],
      ["section_view", { section_id: "faq" }],
      ["section_view", { section_id: "contact" }],
    ]);
    expect(sectionObserver.unobserve.mock.calls).toEqual(
      sections.map((target) => [target])
    );
    unmount();
    expect(sectionObserver.disconnect).toHaveBeenCalledTimes(1);
  } finally {
    if (originalObserver === undefined) delete window.IntersectionObserver;
    else window.IntersectionObserver = originalObserver;
  }
});

describe("contact form", () => {
  const { submitLead, prepareLeadClient } = require("./lib/leads");
  const values = {
    name: "Jane Rivera",
    email: "jane@example.com",
    message: "I would like to build a website for my business.",
  };

  beforeEach(() => {
    submitLead.mockReset();
    prepareLeadClient.mockReset().mockResolvedValue();
  });

  const fillForm = () => {
    const form = screen.getByRole("form", { name: PAGE_COPY.contact.heading });
    Object.entries(values).forEach(([name, value]) => {
      fireEvent.change(form.elements.namedItem(name), { target: { value } });
    });
    return form;
  };

  const renderContact = () =>
    render(
      <div onClick={(event) => {
        if (event.target.closest("a")) event.preventDefault();
      }}>
        <ContactUs />
      </div>
    );

  test("fields expose validation and hint, and contact links send analytics", () => {
    renderContact();
    const form = screen.getByRole("form", { name: PAGE_COPY.contact.heading });
    expect(form.noValidate).toBe(false);
    expect(form.checkValidity()).toBe(false);
    for (const [name, limit] of [["name", 100], ["email", 254], ["message", 5000]]) {
      expect(form.elements.namedItem(name).required).toBe(true);
      expect(form.elements.namedItem(name).maxLength).toBe(limit);
    }
    expect(form.elements.namedItem("subject")).toBeNull();
    const needs = screen.getByRole("group", { name: "What do you need? (optional)" });
    expect(needs.tagName).toBe("FIELDSET");
    expect(needs.querySelector("legend span").textContent).toBe("(optional)");
    expect(within(needs).getAllByRole("radio")).toHaveLength(4);
    for (const [value, label] of [
      ["website", "Website"], ["app", "App"],
      ["it-support", "IT support"], ["not-sure", "Not sure"],
    ]) {
      const radio = within(needs).getByRole("radio", { name: label });
      expect(radio.name).toBe("need");
      expect(radio.value).toBe(value);
      expect(radio.checked).toBe(false);
      expect(radio.required).toBe(false);
    }
    for (const name of ["name", "email"]) {
      expect(form.elements.namedItem(name).getAttribute("autocomplete")).toBe(name);
    }
    const message = form.elements.namedItem("message");
    expect(document.getElementById(message.getAttribute("aria-describedby"))
      .textContent).toBe("Rough ideas are fine.");
    const honeypot = form.elements.namedItem("company_website");
    expect(honeypot.getAttribute("aria-hidden")).toBe("true");
    expect(honeypot.tabIndex).toBe(-1);
    expect(honeypot.getAttribute("autocomplete")).toBe("off");

    fillForm();
    expect(form.checkValidity()).toBe(true);
    fireEvent.change(form.elements.namedItem("email"), { target: { value: "invalid" } });
    expect(form.checkValidity()).toBe(false);
    expect(within(form).getByRole("button", { name: "Send message" }).textContent)
      .not.toContain("↗");
    expect(screen.getByText(PAGE_COPY.contact.intro, { exact: true })).toBeTruthy();
    PAGE_COPY.contact.hours.forEach((hours) => {
      expect(screen.getByText(hours, { exact: true })).toBeTruthy();
    });

    for (const [name, href] of [
      [SITE.phoneDisplay, SITE.phoneHref],
      [SITE.email, `mailto:${SITE.email}`],
    ]) {
      const link = screen.getByRole("link", { name });
      expect(link.getAttribute("href")).toBe(href);
      fireEvent.click(link);
    }
    expect(track.mock.calls).toEqual([
      ["contact_click", { channel: "phone", location: "contact" }],
      ["contact_click", { channel: "email", location: "contact" }],
    ]);
  });

  test.each([null, "website", "app", "it-support", "not-sure"])(
    "submits once with need %s, then tracks success and resets", async (need) => {
      let completeRequest;
      submitLead.mockImplementation(() => new Promise((resolve) => {
        completeRequest = resolve;
      }));
      renderContact();
      const form = fillForm();
      if (need) fireEvent.click(form.querySelector(`input[value="${need}"]`));
      const reset = jest.spyOn(form, "reset");
      fireEvent.submit(form);
      expect(screen.getByRole("button", { name: "Sending" }).disabled).toBe(true);
      fireEvent.submit(form);
      await waitFor(() => expect(submitLead).toHaveBeenCalledTimes(1));
      expect(submitLead).toHaveBeenCalledWith({ ...values, need });
      expect(track).not.toHaveBeenCalled();

      await act(async () => completeRequest({ ok: true }));
      const success = screen.getByRole("status");
      expect(within(success).getByRole("heading", { name: "Message sent" }))
        .toBeTruthy();
      const phone = within(success).getByRole("link", { name: SITE.phoneDisplay });
      expect(phone.parentElement.textContent).toBe(PAGE_COPY.contact.success.message);
      expect(phone.getAttribute("href")).toBe(SITE.phoneHref);
      expect(reset).toHaveBeenCalledTimes(1);
      expect(track.mock.calls).toEqual([["contact_submit", { need: need || "unspecified" }]]);
      expect(screen.queryByRole("form")).toBeNull();

      fireEvent.click(phone);
      expect(track).toHaveBeenLastCalledWith("contact_click", {
        channel: "phone", location: "contact",
      });
      fireEvent.click(within(success).getByRole("button", { name: "Send another" }));
      Object.values(PAGE_COPY.contact.fields).forEach((label) => {
        expect(screen.getByLabelText(label).value).toBe("");
      });
      screen.getAllByRole("radio").forEach((radio) => expect(radio.checked).toBe(false));
    }
  );

  test.each(["callable", "network"])("%s failure preserves values and allows retry", async (failure) => {
    submitLead.mockRejectedValueOnce(new Error(`${failure} failure`));
    submitLead.mockResolvedValueOnce({ ok: true });
    renderContact();
    const form = fillForm();
    fireEvent.click(screen.getByRole("radio", { name: "IT support" }));
    const reset = jest.spyOn(form, "reset");
    fireEvent.submit(form);
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBe(PAGE_COPY.contact.error);
    expect(reset).not.toHaveBeenCalled();
    expect(track).not.toHaveBeenCalled();
    Object.entries(values).forEach(([name, value]) => {
      expect(form.elements.namedItem(name).value).toBe(value);
    });
    expect(screen.getByRole("radio", { name: "IT support" }).checked).toBe(true);
    expect(screen.getByRole("button", { name: "Send message" }).disabled).toBe(false);
    const email = within(alert).getByRole("link", { name: SITE.email });
    expect(email.getAttribute("href")).toBe(`mailto:${SITE.email}`);
    fireEvent.click(email);
    expect(track.mock.calls).toEqual([
      ["contact_click", { channel: "email", location: "contact" }],
    ]);

    fireEvent.submit(form);
    await screen.findByRole("status");
    expect(submitLead).toHaveBeenCalledTimes(2);
    expect(submitLead).toHaveBeenNthCalledWith(2, { ...values, need: "it-support" });
    expect(reset).toHaveBeenCalledTimes(1);
    expect(track.mock.calls.filter(([event]) => event === "contact_submit"))
      .toEqual([["contact_submit", { need: "it-support" }]]);
  });

  test("a filled honeypot shows success without a request or submit analytics", () => {
    renderContact();
    const form = fillForm();
    fireEvent.change(form.elements.namedItem("company_website"), {
      target: { value: "https://example.com" },
    });
    fireEvent.submit(form);
    expect(screen.getByRole("status")).toBeTruthy();
    expect(submitLead).not.toHaveBeenCalled();
    expect(track).not.toHaveBeenCalled();
  });

  test("focus prepares the client once per mount, including after a warm-up failure", async () => {
    prepareLeadClient.mockRejectedValueOnce(new Error("Chunk failed"));
    submitLead.mockResolvedValueOnce({ ok: true });
    const { unmount } = renderContact();
    expect(prepareLeadClient).not.toHaveBeenCalled();
    fireEvent.focus(screen.getByLabelText("Your name"));
    fireEvent.focus(screen.getByLabelText("Email address"));
    await waitFor(() => expect(prepareLeadClient).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("alert")).toBeNull();
    fireEvent.submit(fillForm());
    await screen.findByRole("status");
    fireEvent.click(screen.getByRole("button", { name: "Send another" }));
    await act(async () => fireEvent.focus(screen.getByLabelText("Your name")));
    expect(prepareLeadClient).toHaveBeenCalledTimes(1);
    unmount();
    renderContact();
    fireEvent.focus(screen.getByLabelText("Your name"));
    await waitFor(() => expect(prepareLeadClient).toHaveBeenCalledTimes(2));
  });

  test("the reCAPTCHA notice has the policy text and safe external links", () => {
    renderContact();
    const form = screen.getByRole("form", { name: PAGE_COPY.contact.heading });
    const notice = form.querySelector(".contact-legal");
    expect(notice.tagName).toBe("P");
    expect(form.lastElementChild).toBe(notice);
    expect(notice.textContent).toBe(
      "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply."
    );
    for (const [name, href] of [
      ["Privacy Policy", "https://policies.google.com/privacy"],
      ["Terms of Service", "https://policies.google.com/terms"],
    ]) {
      const link = within(notice).getByRole("link", { name });
      expect(link.getAttribute("href")).toBe(href);
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });
});

test("services render four rows with comma-separated links only where supplied", () => {
  render(<Services />);
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
  expect(screen.getByText(PAGE_COPY.services.intro, { exact: true })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Tell us about your project" })
    .classList.contains("btn")).toBe(true);

  const cards = document.querySelectorAll(".svc-card");
  expect(cards).toHaveLength(4);
  SERVICES.forEach((service, index) => {
    const card = cards[index];
    expect(within(card).getByRole("heading", { level: 3 }).textContent).toBe(service.name);
    expect(within(card).getByText(service.summary, { exact: true })).toBeTruthy();
    expect(within(card).getAllByRole("listitem").map((item) => item.textContent))
      .toEqual(service.points);
    expect(within(card).queryAllByRole("link")).toHaveLength(0);
  });
});

test("about is a plain heading, two lines of copy and three review cards; services keeps its CTA", () => {
  render(
    <div onClick={(event) => event.preventDefault()}>
      <Services />
      <About />
    </div>
  );
  const about = screen.getByRole("region", { name: "About us" });
  expect(within(about).queryByRole("complementary")).toBeNull();
  expect(within(about).getAllByRole("heading").map((h) => h.textContent))
    .toEqual(["About us", "What clients say"]);
  expect(within(about).getByText(PAGE_COPY.about.lead, { exact: true })).toBeTruthy();
  expect(within(about).getByText(PAGE_COPY.about.body, { exact: true })).toBeTruthy();
  expect(about.textContent).not.toMatch(/Nothing outsourced|You own everything|Software studio|Get in touch/);
  expect(about.querySelectorAll(".about-quote")).toHaveLength(3);

  const link = screen.getByRole("link", { name: "Tell us about your project", exact: true });
  expect(link.getAttribute("href")).toBe("/#contact");
  fireEvent.click(link);
  expect(track.mock.calls).toEqual([
    ["cta_click", { label: "Tell us about your project", location: "services" }],
  ]);
});

test("work-card links and website links send the specified analytics", () => {
  const { container } = render(
    <div onClick={(event) => event.preventDefault()}>
      <Work />
    </div>
  );
  const expected = [];
  for (const project of CASE_STUDIES) {
    const anchor = container.querySelector(`a[href="/work/${project.slug}/"]`);
    expect(anchor.classList.contains("work-card")).toBe(true);
    expect(anchor.querySelectorAll("a")).toHaveLength(0);
    expect(anchor.hasAttribute("target")).toBe(false);
    expect(anchor.querySelector(".ext")).toBeNull();
    fireEvent.click(anchor);
    expected.push(["cta_click", { label: `${project.name} case study`, location: "work" }]);
  }

  for (const site of WEBSITES) {
    const link = site.links[0];
    const anchor = screen.getByRole("link", {
      name: `${site.name} (opens in a new tab)`, exact: true,
    });
    expect(anchor.getAttribute("href")).toBe(link.href);
    expect(anchor.getAttribute("target")).toBe("_blank");
    expect(anchor.getAttribute("rel")).toBe("noopener noreferrer");
    expect(within(anchor).getByText("↗").getAttribute("aria-hidden")).toBe("true");
    fireEvent.click(anchor);
    expected.push(["cta_click", { label: `${site.name}: ${link.label}`, location: "work" }]);
  }
  expect(track.mock.calls).toEqual(expected);
});

test("work shows six equal cards with tags, one line each and lazy decorative images", () => {
  const { container } = render(<Work />);
  const cards = container.querySelectorAll(".work-grid > li");
  expect(cards).toHaveLength(6);
  expect(container.querySelectorAll("img")).toHaveLength(6);
  expect(container.querySelector("blockquote, .work-outro, .work-card--featured")).toBeNull();
  expect(screen.getByText(PAGE_COPY.work.intro, { exact: true })).toBeTruthy();
  CASE_STUDIES.forEach((project, index) => {
    const card = cards[index];
    expect(within(card).getByRole("heading", { level: 3 }).textContent).toBe(project.name);
    expect(within(card).getByText(project.cardText, { exact: true })).toBeTruthy();
    expect(within(card).getByText(project.tags.join(" · "), { exact: true })).toBeTruthy();
    for (const paragraph of project.paragraphs) expect(card.textContent).not.toContain(paragraph);
    const image = card.querySelector("img");
    expect(image.getAttribute("alt")).toBe("");
    expect(image.getAttribute("loading")).toBe("lazy");
    expect(image.getAttribute("srcset"))
      .toBe(`${project.img.small} 700w, ${project.img.large} 1400w`);
    expect(image.getAttribute("sizes")).toBeTruthy();
    expect(image.getAttribute("width")).toBe(String(project.img.width));
    expect(image.getAttribute("height")).toBe(String(project.img.height));
  });
  const websites = cards[5];
  expect(websites.id).toBe("websites");
  expect(within(websites).getByRole("heading", { level: 3 }).textContent)
    .toBe(PAGE_COPY.work.websitesCard.name);
  expect(within(websites).getAllByRole("link")).toHaveLength(2);
  for (const site of WEBSITES) {
    expect(within(websites).getByText(site.short, { exact: true })).toBeTruthy();
  }
});

test.each(CASE_STUDIES)("the $slug card opens its case study", (project) => {
  render(<App />);
  fireEvent.click(document.querySelector(`#work a[href="/work/${project.slug}/"]`));
  expect(window.location.pathname).toBe(`/work/${project.slug}/`);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(project.name);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: "smooth" });
});

test("About renders the verbatim reviews with untracked case links", () => {
  render(<App />);
  const about = document.getElementById("about");
  expect(about.querySelectorAll("blockquote")).toHaveLength(3);
  TESTIMONIALS.forEach(({ quote, attribution }, index) => {
    const figure = within(about).getByText(quote, { exact: true }).closest("figure");
    expect(figure.querySelector("figcaption").textContent).toBe(attribution);
    if (index === 2) expect(figure.querySelector("a")).toBeNull();
  });
  for (const [name, slug] of [["Ambé Wellness", "ambe"], ["PerSyst Fitness Trainer", "persyst"]]) {
    const link = within(document.getElementById("about")).getByRole("link", { name });
    expect(link.getAttribute("href")).toBe(`/work/${slug}/`);
    fireEvent.click(link);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(name);
    expect(track).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("link", { name: "← All work" }));
  }
});

test("process presents four ordered steps with the verbatim copy", () => {
  render(<Process />);
  const section = screen.getByRole("region", { name: "How working with us works" });
  expect(section.id).toBe("process");
  expect(within(section).getByText(
    "No big agency process. You talk to the person building it, from the first call to launch.",
    { exact: true }
  )).toBeTruthy();
  const list = within(section).getByRole("list");
  expect(list.tagName).toBe("OL");
  const steps = within(list).getAllByRole("listitem");
  expect(steps).toHaveLength(4);
  const expected = [
    ["Tell us what you need", "Call or send the form. You'll talk directly with the person building it, not a salesperson."],
    ["Work out the plan together", "We figure out what to build, what it will take and what fits your budget."],
    ["Built in-house", "Every design and every line of code is done by us. Nothing is outsourced."],
    ["Launch and hand-over", "We put it live, or through App Store review, and you own all of it: the code and the design."],
  ];
  steps.forEach((step, index) => {
    expect(within(step).getByRole("heading", { level: 3 }).textContent).toBe(expected[index][0]);
    expect(step.querySelector("p").textContent).toBe(expected[index][1]);
    expect(within(step).getByText(String(index + 1), { exact: true })).toBeTruthy();
  });
  expect(section.querySelector("img, svg")).toBeNull();
});

test("FAQ exposes six verbatim question and answer pairs, with linked project names", () => {
  render(<Faq />);
  const section = screen.getByRole("region", { name: "Questions people ask" });
  expect(section.id).toBe("faq");
  expect(section.querySelector("details, button, [hidden]")).toBeNull();
  const list = section.querySelector("dl");
  const questions = within(list).getAllByRole("term");
  const answers = within(list).getAllByRole("definition");
  expect(questions.map((question) => question.textContent)).toEqual([
    "What does a project cost?",
    "How long does it take?",
    "Who owns the code and design?",
    "Do you work with clients outside New Jersey?",
    "Can you take over an existing app or website?",
    "What do you need from me to get started?",
  ]);
  expect(answers.map((answer) => answer.textContent)).toEqual([
    "It depends on the scope. Tell us your budget up front and we'll work out what makes sense.",
    "It ranges with the project. A marketing site and a full app platform are very different builds, so we'll talk timing once we know what you need.",
    "You do. Everything we build for you is yours at the end.",
    "Yes. We're based in Northern New Jersey and work with clients wherever they are.",
    "Yes. ChinesePod and PerSyst were already live products when we started on them, and CurzonRelo's app was rebuilt from the ground up.",
    "Just a rough idea of what your business does and what you want built. Rough ideas are fine. We'll work out the details together.",
  ]);
  questions.forEach((question, index) => {
    expect(question.tagName).toBe("DT");
    expect(question.nextElementSibling).toBe(answers[index]);
    expect(answers[index].tagName).toBe("DD");
  });
  expect(within(answers[4]).getAllByRole("link").map((link) => [
    link.textContent, link.getAttribute("href"),
  ])).toEqual([
    ["ChinesePod", "/work/chinesepod/"],
    ["PerSyst", "/work/persyst/"],
    ["CurzonRelo", "/work/curzonrelo/"],
  ]);
  expect(within(section).getAllByRole("link")).toHaveLength(3);
});

test.each([
  ["ChinesePod", "chinesepod", "ChinesePod"],
  ["PerSyst", "persyst", "PerSyst Fitness Trainer"],
  ["CurzonRelo", "curzonrelo", "CurzonRelo"],
])("FAQ link %s opens its case study", (label, slug, name) => {
  render(<App />);
  const faq = screen.getByRole("region", { name: "Questions people ask" });
  fireEvent.click(within(faq).getByRole("link", { name: label }));
  expect(window.location.pathname).toBe(`/work/${slug}/`);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(name);
  expect(track).not.toHaveBeenCalled();
});

test("desktop and phone navigation use the specified root-relative links in order", () => {
  render(<Navbar />);
  const desktop = screen.getByRole("navigation", { name: "Primary" });
  expect(within(desktop).getAllByRole("link").map((link) => [
    link.textContent, link.getAttribute("href"),
  ])).toEqual([
    ["Services", "/#services"],
    ["Work", "/#work"],
    ["About", "/#about"],
    ["Contact", "/#contact"],
  ]);
  expect(desktop.querySelector('a[href^="tel:"]')).toBeNull();
  expect(desktop.querySelector(".btn")).toBeNull();
  const menu = screen.getByText("Menu", { selector: "summary" }).parentElement;
  const panel = within(menu).getByRole("navigation", { hidden: true });
  expect(within(panel).getAllByRole("link", { hidden: true }).map((link) => [
    link.textContent, link.getAttribute("href"),
  ])).toEqual([
    ["Services", "/#services"],
    ["Work", "/#work"],
    ["How we work", "/#process"],
    ["About", "/#about"],
    ["FAQ", "/#faq"],
    ["Contact", "/#contact"],
  ]);
});

test("the native menu closes on every panel link and Escape restores focus", async () => {
  render(<Navbar />);
  const summary = screen.getByText("Menu", { selector: "summary" });
  const menu = summary.parentElement;
  const panel = within(menu).getByRole("navigation", { hidden: true });

  for (const label of ["Services", "Work", "How we work", "About", "FAQ", "Contact"]) {
    fireEvent.click(summary);
    await waitFor(() => expect(menu.open).toBe(true));
    // Wait for the native toggle event to synchronize React's controlled state.
    await act(async () => new Promise((resolve) => setTimeout(resolve, 0)));
    fireEvent.click(within(panel).getByRole("link", { name: label }));
    await waitFor(() => expect(menu.open).toBe(false));
  }

  fireEvent.click(summary);
  await waitFor(() => expect(menu.open).toBe(true));
  await act(async () => new Promise((resolve) => setTimeout(resolve, 0)));
  within(panel).getByRole("link", { name: "Work" }).focus();
  fireEvent.keyDown(document.activeElement, { key: "Escape" });
  expect(menu.open).toBe(false);
  expect(document.activeElement).toBe(summary);
});

test("call bar hides for hero actions or at least 15% of contact", () => {
  mockObserverSupported = true;
  const observers = [];
  const originalObserver = window.IntersectionObserver;
  window.IntersectionObserver = jest.fn((callback, options) => {
    const observer = {
      callback,
      options,
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
    observers.push(observer);
    return observer;
  });

  try {
    const { container, unmount } = render(
      <>
        <div className="hero-actions" />
        <section id="contact" />
        <CallBar />
      </>
    );
    const bar = container.querySelector(".callbar");
    const links = within(bar).getAllByRole("link", { hidden: true });
    const checkVisibility = (visible) => {
      expect(bar.getAttribute("aria-hidden")).toBe(String(!visible));
      expect(bar.classList.contains("callbar--hidden")).toBe(!visible);
      links.forEach((link) => {
        expect(link.getAttribute("tabindex")).toBe(visible ? null : "-1");
      });
    };
    const intersect = (observer, isIntersecting, intersectionRatio) => {
      act(() => observer.callback([{ isIntersecting, intersectionRatio }]));
    };

    expect(observers).toHaveLength(2);
    const [hero, contact] = observers;
    expect(hero.options.threshold).toBe(0);
    expect(contact.options.threshold).toEqual([0, 0.15]);
    expect(hero.observe).toHaveBeenCalledWith(
      container.querySelector(".hero-actions")
    );
    expect(contact.observe).toHaveBeenCalledWith(
      container.querySelector("#contact")
    );

    intersect(hero, true, 1);
    intersect(contact, false, 0);
    checkVisibility(false);
    intersect(hero, false, 0);
    checkVisibility(true);
    intersect(contact, true, 0.149);
    checkVisibility(true);
    intersect(contact, true, 0.15);
    checkVisibility(false);
    intersect(contact, true, 0.8);
    checkVisibility(false);
    intersect(contact, true, 0.1);
    checkVisibility(true);
    intersect(hero, true, 0.01);
    checkVisibility(false);

    unmount();
    observers.forEach((observer) =>
      expect(observer.disconnect).toHaveBeenCalledTimes(1)
    );
  } finally {
    if (originalObserver === undefined) delete window.IntersectionObserver;
    else window.IntersectionObserver = originalObserver;
  }
});

test("case routes skip section tracking and reattach call-bar observers when returning home", () => {
  mockObserverSupported = true;
  const observers = [];
  const originalObserver = window.IntersectionObserver;
  window.IntersectionObserver = jest.fn((callback, options) => {
    const observer = {
      callback, options, observe: jest.fn(), unobserve: jest.fn(), disconnect: jest.fn(),
    };
    observers.push(observer);
    return observer;
  });

  try {
    window.history.pushState(null, "", "/work/ambe/");
    const { unmount } = render(<App />);
    expect(observers.some(({ options }) => options.rootMargin)).toBe(false);
    expect(document.querySelector(".callbar").getAttribute("aria-hidden")).toBe("false");
    fireEvent.click(screen.getByRole("link", { name: "← All work" }));
    const sectionObserver = observers.find(({ options }) => options.rootMargin);
    expect(sectionObserver.observe.mock.calls.map(([target]) => target.id))
      .toEqual(["services", "work", "process", "about", "faq", "contact"]);
    const hero = observers.find((observer) =>
      observer.observe.mock.calls.some(([target]) => target.classList.contains("hero-actions"))
    );
    act(() => hero.callback([{ isIntersecting: true }]));
    expect(document.querySelector(".callbar").getAttribute("aria-hidden")).toBe("true");
    const contact = observers.find((observer) => !observer.options.rootMargin &&
      observer.observe.mock.calls.some(([target]) => target.id === "contact")
    );
    act(() => contact.callback([{ intersectionRatio: 0.8 }]));
    act(() => navigate("/work/persyst/"));
    expect(document.querySelector(".callbar").getAttribute("aria-hidden")).toBe("false");
    expect(sectionObserver.disconnect).toHaveBeenCalledTimes(1);
    expect(track).not.toHaveBeenCalled();
    unmount();
    observers.forEach((observer) => expect(observer.disconnect).toHaveBeenCalledTimes(1));
  } finally {
    if (originalObserver === undefined) delete window.IntersectionObserver;
    else window.IntersectionObserver = originalObserver;
  }
});

test("call bar stays accessible when IntersectionObserver is unsupported", () => {
  render(<CallBar />);
  const bar = screen.getByRole("navigation", { name: "Quick contact" });
  expect(bar.getAttribute("aria-hidden")).toBe("false");
  expect(bar.classList.contains("callbar--hidden")).toBe(false);
  within(bar)
    .getAllByRole("link")
    .forEach((link) => {
      expect(link.hasAttribute("tabindex")).toBe(false);
    });
});

test("header, hero and call bar send the specified analytics events", () => {
  render(
    <div onClick={(event) => event.preventDefault()}>
      <Navbar />
      <Hero />
      <CallBar />
    </div>
  );
  const header = screen.getByRole("navigation", { name: "Primary" });
  const hero = screen.getByRole("region", { name: PAGE_COPY.hero.heading });
  const bar = screen.getByRole("navigation", { name: "Quick contact" });
  const expected = [];

  expect(within(header).queryByRole("link", { name: /201/ })).toBeNull();
  for (const [scope, location] of [
    [hero, "hero"],
    [bar, "mobile_bar"],
  ]) {
    const label = location === "hero" ? "Tell us about your project" : "Start a project";
    fireEvent.click(within(scope).getByRole("link", { name: label }));
    expected.push(["cta_click", { label, location }]);
    fireEvent.click(
      within(scope).getByRole("link", {
        name: location === "mobile_bar" ? "Call us" : "(201) 467-1007",
      })
    );
    expected.push(["contact_click", { channel: "phone", location }]);
  }

  expect(track.mock.calls).toEqual(expected);
});


test("hero is only the offer, the proof line and one contact action", () => {
  const { container } = render(<Hero />);
  expect(container.textContent).not.toMatch(/New Jersey|Bryant|Monday|Saturday|Since 2019/);
  expect(container.querySelectorAll(".btn")).toHaveLength(1);
  expect(container.querySelector(".hero-proof").textContent).toBe("Built in-house. Live in the App Store.");
  expect(screen.getByText("in-house.").classList.contains("keep-together")).toBe(true);
  const button = within(container.querySelector(".hero-actions"))
    .getByRole("link", { name: "Tell us about your project" });
  expect(button.getAttribute("href")).toBe("/#contact");
  expect(button.classList.contains("btn")).toBe(true);
  expect(container.querySelector("img")).toBeNull();
});

test("Bryant's name appears only inside the verbatim client reviews", () => {
  render(<App />);
  const text = document.body.textContent;
  const withoutReviews = TESTIMONIALS.reduce((acc, { quote }) => acc.replace(quote, ""), text);
  expect(withoutReviews).not.toMatch(/Bryant/);
});

test("the ChinesePod case page shows the website first and the app screens second", () => {
  window.history.pushState(null, "", "/work/chinesepod/");
  render(<App />);
  const figures = [...document.querySelectorAll(".case-page figure.case-figure")];
  expect(figures.map((figure) => figure.querySelector("figcaption").textContent)).toEqual([
    "ChinesePod's website.",
    "The ChinesePod app, shown in its App Store screenshots.",
  ]);
  expect(figures[0].querySelector("img").getAttribute("loading")).toBe("eager");
  expect(figures[1].querySelector("img").getAttribute("loading")).toBe("lazy");
});
