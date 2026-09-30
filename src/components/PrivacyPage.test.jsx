import { render, screen, within } from "@testing-library/react";
import PrivacyPage from "./PrivacyPage";
import { SITE } from "../data/site";

test("renders the privacy title, date and all ten sections in order", () => {
  render(<PrivacyPage />);
  const article = screen.getByRole("article", { name: "Privacy policy" });
  expect(within(article).getByRole("heading", { level: 1 }).textContent).toBe("Privacy policy");
  expect(within(article).getByText("Effective September 30, 2026")).toBeTruthy();
  expect(document.title).toBe("Privacy policy · AlmanzaTech");
  expect(within(article).getByText(
    "This policy explains what information AlmanzaTech LLC collects through almanzatech.com, how we use it and the choices you have. We keep it short because we don't collect much."
  )).toBeTruthy();
  expect(within(article).getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent))
    .toEqual([
      "What you send us",
      "What's collected automatically",
      "Cookies",
      "Who we share it with",
      "Do Not Track and tracking across sites",
      "How long we keep it",
      "Your choices",
      "Children",
      "Changes to this policy",
      "Contact us",
    ]);
  expect(article.querySelectorAll("section")).toHaveLength(10);
  expect(within(article).getByText(
    "Our site doesn't respond differently to a browser's Do Not Track signal. We don't run ads or advertising trackers, and we don't let other companies use our site to track you across other websites for advertising. The Google services listed above receive information when you use our site, as described in this policy."
  )).toBeTruthy();
});

test("uses the exact policy references, home link and shared contact details in the same tab", () => {
  render(<PrivacyPage />);
  for (const [label, href] of [
    ["← Home", "/"],
    ["How Google uses information from sites or apps that use our services", "https://policies.google.com/technologies/partner-sites"],
    ["opt-out browser add-on", "https://tools.google.com/dlpage/gaoptout"],
    [SITE.phoneDisplay, SITE.phoneHref],
  ]) {
    const link = screen.getByRole("link", { name: label });
    expect(link.getAttribute("href")).toBe(href);
    expect(link.hasAttribute("target")).toBe(false);
  }
  const emails = screen.getAllByRole("link", { name: SITE.email });
  expect(emails).toHaveLength(2);
  emails.forEach((link) => {
    expect(link.getAttribute("href")).toBe(`mailto:${SITE.email}`);
    expect(link.hasAttribute("target")).toBe(false);
  });
  expect(emails[0].parentElement.textContent).toBe(
    `To see, correct or delete what you sent us through the contact form, email ${SITE.email} and we'll take care of it.`
  );
  const contact = screen.getByRole("heading", { name: "Contact us" }).nextElementSibling;
  expect(contact.tagName).toBe("ADDRESS");
  expect(Array.from(contact.childNodes).filter((node) => node.nodeName !== "BR")
    .map((node) => node.textContent)).toEqual([
    SITE.name, SITE.location, SITE.email, SITE.phoneDisplay,
  ]);
  expect(contact.querySelectorAll("br")).toHaveLength(3);
});
