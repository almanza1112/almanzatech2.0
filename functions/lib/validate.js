const { HttpsError } = require("firebase-functions/https");

const LIMITS = { name: 100, email: 254, message: 5000 };

function validateLead(data, sites) {
  if (
    data === null ||
    typeof data !== "object" ||
    (Object.getPrototypeOf(data) !== Object.prototype &&
      Object.getPrototypeOf(data) !== null)
  ) {
    throw new HttpsError("invalid-argument", "Expected a plain object.");
  }

  if (typeof data.company_website === "string" && data.company_website.length > 0) {
    return { honeypot: true };
  }

  if (typeof data.site !== "string" || !Object.hasOwn(sites, data.site)) {
    throw new HttpsError("invalid-argument", "Unknown site.");
  }
  const site = data.site;
  const siteConfig = sites[site];

  if (typeof data.name !== "string") {
    throw new HttpsError("invalid-argument", "Name is required.");
  }
  const name = data.name
    .replace(/[\u0000-\u0008\u000e-\u001f\u007f-\u009f]/g, "")
    .trim()
    .replace(/\s+/g, " ");
  if (name.length < 1 || name.length > LIMITS.name) {
    throw new HttpsError("invalid-argument", "Invalid name length.");
  }

  if (typeof data.email !== "string") {
    throw new HttpsError("invalid-argument", "Email is required.");
  }
  const email = data.email.trim();
  if (
    email.length < 3 ||
    email.length > LIMITS.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    throw new HttpsError("invalid-argument", "Invalid email.");
  }

  const need = data.need === undefined || data.need === null || data.need === ""
    ? null
    : data.need;
  if (need !== null && (typeof need !== "string" || !Object.hasOwn(siteConfig.needs, need))) {
    throw new HttpsError("invalid-argument", "Unknown need.");
  }

  if (typeof data.message !== "string") {
    throw new HttpsError("invalid-argument", "Message is required.");
  }
  const message = data.message
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/g, "")
    .trim();
  if (message.length < 1 || message.length > LIMITS.message) {
    throw new HttpsError("invalid-argument", "Invalid message length.");
  }

  return { site, siteConfig, name, email, need, message };
}

module.exports = { LIMITS, validateLead };
