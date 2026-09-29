const fs = require("node:fs");
const path = require("node:path");
const cases = require("./case-meta.json");

const ORIGIN = "https://almanzatech.com";
const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]));

const replaceTag = (html, pattern, replacement) => {
  if (!pattern.test(html)) throw new Error(`Missing metadata tag: ${pattern}`);
  return html.replace(pattern, () => replacement);
};

// CRA can remove attribute quotes when minifying the base HTML.
const tagPattern = (tag, attribute, value) => new RegExp(
  `<${tag}\\b[^>]*\\b${attribute}\\s*=\\s*(?:"${value}"|'${value}'|${value}(?=[\\s/>]))[^>]*>`,
  "i"
);

const generateSite = (buildDir = path.join(__dirname, "..", "build")) => {
  const base = fs.readFileSync(path.join(buildDir, "index.html"), "utf8");
  const urls = [`${ORIGIN}/`];

  for (const project of cases) {
    const title = escapeHtml(`${project.name} case study · AlmanzaTech`);
    const description = escapeHtml(project.outcome);
    const url = `${ORIGIN}/work/${project.slug}/`;
    let html = replaceTag(base, /<title>[^<]*<\/title>/i, `<title>${title}</title>`);
    html = replaceTag(html, tagPattern("link", "rel", "canonical"),
      `<link rel="canonical" href="${url}" />`);
    for (const [attribute, name, content] of [
      ["name", "description", description],
      ["property", "og:url", url],
      ["property", "og:title", title],
      ["property", "og:description", description],
      ["name", "twitter:title", title],
      ["name", "twitter:description", description],
    ]) {
      html = replaceTag(html, tagPattern("meta", attribute, name),
        `<meta ${attribute}="${name}" content="${content}" />`);
    }
    const directory = path.join(buildDir, "work", project.slug);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, "index.html"), html);
    urls.push(url);
  }

  fs.writeFileSync(path.join(buildDir, "sitemap.xml"), [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${url}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n"));

  const robotsPath = path.join(buildDir, "robots.txt");
  const robots = fs.readFileSync(robotsPath, "utf8");
  const sitemap = `Sitemap: ${ORIGIN}/sitemap.xml`;
  if (!robots.split(/\r?\n/).includes(sitemap)) {
    fs.appendFileSync(robotsPath, `${robots.endsWith("\n") ? "" : "\n"}${sitemap}\n`);
  }
};

if (require.main === module) {
  generateSite();
  console.log(`Generated ${cases.length} case pages, sitemap.xml (6 URLs), and robots.txt Sitemap line.`);
}

module.exports = { generateSite };
