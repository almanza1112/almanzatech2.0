const test = require("node:test");
const assert = require("node:assert/strict");
const { buildNotification } = require("../lib/email");
const { SITES } = require("../sites");

const lead = {
  site: "almanzatech",
  siteConfig: SITES.almanzatech,
  name: "Ada Example",
  email: "Ada@Example.com",
  need: "it-support",
  message: "Please help with our computers.\nWe have five.",
};

test("builds the exact plain-text message, addresses, subject and lead id", () => {
  assert.deepEqual(buildNotification(lead, "lead-123"), {
    from: { name: "AlmanzaTech website", address: "bryant@almanzatech.com" },
    to: "bryant@almanzatech.com",
    replyTo: { name: "Ada Example", address: "Ada@Example.com" },
    subject: "New inquiry from Ada Example — IT support",
    text: "Name: Ada Example\nEmail: Ada@Example.com\nNeed: IT support\nSite: almanzatech\n\nPlease help with our computers.\nWe have five.\n\nLead ID: lead-123",
  });
});

test("omits the subject suffix and uses Not specified when need is null", () => {
  const notification = buildNotification({ ...lead, need: null }, "lead-123");
  assert.equal(notification.subject, "New inquiry from Ada Example");
  assert.equal(notification.text, "Name: Ada Example\nEmail: Ada@Example.com\nNeed: Not specified\nSite: almanzatech\n\nPlease help with our computers.\nWe have five.\n\nLead ID: lead-123");
  assert.equal(Object.hasOwn(notification, "html"), false);
});

test("an omitted or empty need also has no subject suffix", () => {
  for (const need of [undefined, ""]) {
    const notification = buildNotification({ ...lead, need }, "lead-123");
    assert.equal(notification.subject, "New inquiry from Ada Example");
    assert.match(notification.text, /\nNeed: Not specified\n/);
  }
});

test("subject preserves 150 characters and truncates anything beyond them", () => {
  const prefix = "New inquiry from ";
  for (const length of [149, 150, 151, 200]) {
    const name = "x".repeat(length - prefix.length);
    const { subject } = buildNotification({ ...lead, name, need: null }, "lead-123");
    assert.equal(subject, `${prefix}${name}`.slice(0, 150));
    assert.equal(subject.length, Math.min(length, 150));
  }
});

test("subject cap also applies to need labels", () => {
  const siteConfig = { ...lead.siteConfig, needs: { website: "Website ".repeat(30) } };
  const { subject } = buildNotification({ ...lead, siteConfig, need: "website" }, "lead-123");
  assert.equal(subject, `New inquiry from Ada Example — ${siteConfig.needs.website}`.slice(0, 150));
  assert.equal(subject.length, 150);
});

test("subject removes CR and LF from both name and need label", () => {
  const siteConfig = { ...lead.siteConfig, needs: { website: "Web\r\nsite\rhelp\nplease" } };
  const { subject } = buildNotification({ ...lead, siteConfig, name: "Ada\r\nExample", need: "website" }, "lead-123");
  assert.equal(subject, "New inquiry from Ada Example — Web site help please");
  assert.doesNotMatch(subject, /[\r\n]/);
});
