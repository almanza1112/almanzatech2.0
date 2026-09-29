import fs from "fs";
import os from "os";
import path from "path";
import { CASE_STUDIES, PAGE_COPY } from "../data/work";
import caseMeta from "../../scripts/case-meta.json";
import { generateSite } from "../../scripts/postbuild";

test("Node metadata matches the ordered case-study source", () => {
  expect(caseMeta).toEqual(CASE_STUDIES.map(({ slug, name, outcome }) => ({
    slug, name, outcome,
  })));
});

test.each([false, true])("generates all metadata and preserves JSON-LD (minified: %s)", (minified) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "almanzatech-postbuild-"));
  const source = fs.readFileSync(path.join(__dirname, "../../public/index.html"), "utf8");
  const base = minified
    ? source.replace(/\s+(name|property|rel)="([^"\s]+)"/g, " $1=$2").replace(/\n\s*/g, " ")
    : source;
  const parse = (html) => new DOMParser().parseFromString(html, "text/html");
  const baseDocument = parse(base);
  expect(baseDocument.title).toBe(
    "AlmanzaTech — Custom Websites, Apps & IT Support · Northern New Jersey"
  );
  expect(baseDocument.title).toBe(PAGE_COPY.homeTitle);
  for (const selector of [
    'meta[name="description"]',
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
  ]) {
    expect(baseDocument.querySelector(selector).getAttribute("content")).toBe(
      "Custom websites, mobile apps and IT support for small businesses and founders. Designed and built in-house. Northern New Jersey, since 2019."
    );
  }
  fs.writeFileSync(path.join(directory, "index.html"), base);
  fs.writeFileSync(path.join(directory, "robots.txt"), "User-agent: *\nDisallow:");

  try {
    generateSite(directory);
    for (const { slug, name, outcome } of CASE_STUDIES) {
      const html = fs.readFileSync(path.join(directory, "work", slug, "index.html"), "utf8");
      const page = parse(html);
      const title = `${name} case study · AlmanzaTech`;
      const canonical = `https://almanzatech.com/work/${slug}/`;
      expect(page.title).toBe(title);
      expect(page.querySelector('link[rel="canonical"]').getAttribute("href")).toBe(canonical);
      for (const [selector, content] of [
        ['meta[name="description"]', outcome],
        ['meta[property="og:url"]', canonical],
        ['meta[property="og:title"]', title],
        ['meta[property="og:description"]', outcome],
        ['meta[name="twitter:title"]', title],
        ['meta[name="twitter:description"]', outcome],
      ]) {
        expect(page.querySelector(selector).getAttribute("content")).toBe(content);
      }
      expect(page.querySelector('script[type="application/ld+json"]').textContent)
        .toBe(baseDocument.querySelector('script[type="application/ld+json"]').textContent);
      expect(page.body.innerHTML).toBe(baseDocument.body.innerHTML);
    }
    expect(fs.readFileSync(path.join(directory, "index.html"), "utf8")).toBe(base);
    const sitemap = new DOMParser().parseFromString(
      fs.readFileSync(path.join(directory, "sitemap.xml"), "utf8"), "application/xml"
    );
    expect(sitemap.querySelector("parsererror")).toBeNull();
    expect(Array.from(sitemap.querySelectorAll("loc"), (loc) => loc.textContent)).toEqual([
      "https://almanzatech.com/",
      ...CASE_STUDIES.map(({ slug }) => `https://almanzatech.com/work/${slug}/`),
    ]);
    generateSite(directory);
    expect(fs.readFileSync(path.join(directory, "robots.txt"), "utf8"))
      .toBe("User-agent: *\nDisallow:\nSitemap: https://almanzatech.com/sitemap.xml\n");
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
