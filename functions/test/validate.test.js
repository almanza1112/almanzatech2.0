const test = require("node:test");
const assert = require("node:assert/strict");
const { HttpsError } = require("firebase-functions/https");
const { LIMITS, validateLead } = require("../lib/validate");
const { SITES } = require("../sites");

const input = {
  site: "almanzatech",
  name: "Ada Example",
  email: "Ada@Example.com",
  need: "website",
  message: "Please help with my website.",
};

function assertInvalid(data) {
  assert.throws(() => validateLead(data, SITES), (error) => {
    assert.ok(error instanceof HttpsError);
    assert.equal(error.code, "invalid-argument");
    assert.ok(error.message.length > 0);
    return true;
  });
}

test("valid input returns exactly the normalized lead and its site config", () => {
  assert.deepEqual(LIMITS, { name: 100, email: 254, message: 5000 });
  assert.deepEqual(validateLead({ ...input, ignored: "extra", honeypot: true }, SITES), {
    ...input,
    siteConfig: SITES.almanzatech,
  });
});

test("a plain object with no prototype is accepted", () => {
  const data = Object.assign(Object.create(null), input);
  assert.equal(validateLead(data, SITES).name, input.name);
});

for (const [label, data] of [
  ["undefined", undefined],
  ["null", null],
  ["string", "data"],
  ["number", 1],
  ["boolean", true],
  ["array", []],
  ["date", new Date(0)],
  ["function", () => {}],
  ["custom prototype", Object.create(input)],
  ["class instance", new (class Lead {})()],
]) {
  test(`rejects non-plain input: ${label}`, () => assertInvalid(data));
}

for (const [field, values] of Object.entries({
  site: [undefined, null, "", "unknown", "toString", "constructor", "__proto__", 1, true, {}, ["almanzatech"]],
  name: [undefined, null, "", " \t\r\n ", "\u0000\u007f\u009f", 1, true, {}, ["Ada"]],
  email: [undefined, null, "", "  ", 1, true, {}, ["a@b.c"], "ab", "a@b", "a@", "@b.c", "a@b.", "a@@b.c", "a b@c.d", "a@b c.d", "a@b.c\nInjected", "a\tb@c.d"],
  need: ["unknown", "toString", "constructor", "__proto__", " Website ", 0, false, {}, ["website"]],
  message: [undefined, null, "", " \t\r\n ", "\u0000\u007f\u009f", 1, true, {}, ["hello"]],
})) {
  for (const [index, value] of values.entries()) {
    test(`rejects invalid ${field} (${index + 1}: ${JSON.stringify(value)})`, () => {
      assertInvalid({ ...input, [field]: value });
    });
  }
}

test("rejects inherited site and need entries", () => {
  const sites = Object.create({ inherited: SITES.almanzatech });
  assert.throws(() => validateLead({ ...input, site: "inherited" }, sites), { code: "invalid-argument" });
  sites.almanzatech = {
    ...SITES.almanzatech,
    needs: Object.create({ inherited: "Inherited" }),
  };
  assert.throws(() => validateLead({ ...input, need: "inherited" }, sites), { code: "invalid-argument" });
});

for (const need of [undefined, null, ""]) {
  test(`optional need ${JSON.stringify(need)} becomes null`, () => {
    assert.equal(validateLead({ ...input, need }, SITES).need, null);
  });
}

for (const need of Object.keys(SITES.almanzatech.needs)) {
  test(`accepts configured need ${need}`, () => {
    assert.equal(validateLead({ ...input, need }, SITES).need, need);
  });
}

test("uses the supplied site's own config", () => {
  const siteConfig = { needs: { consulting: "Consulting" } };
  const lead = validateLead({ ...input, site: "second", need: "consulting" }, { second: siteConfig });
  assert.equal(lead.site, "second");
  assert.equal(lead.siteConfig, siteConfig);
  assert.equal(lead.need, "consulting");
});

test("name collapses CR/LF, tabs and Unicode whitespace and strips other controls", () => {
  const name = " \u0000 Ada\r\n\t Example\r  Person\u00a0Jr\u0007\u007f\u0080\u009f \u0000 ";
  assert.equal(validateLead({ ...input, name }, SITES).name, "Ada Example Person Jr");
});

test("stripped controls cannot leave duplicate spaces in the name", () => {
  const name = "Ada \u0000 \u007f \u009f Example\v\f Jr";
  assert.equal(validateLead({ ...input, name }, SITES).name, "Ada Example Jr");
});

test("email is trimmed and keeps its case", () => {
  assert.equal(validateLead({ ...input, email: " \tAda@EXAMPLE.com\r\n " }, SITES).email, "Ada@EXAMPLE.com");
});

test("message normalizes line endings and preserves internal newlines and tabs only", () => {
  const message = " \r\n First\r\nSecond\rThird\n\tIndented\u0000\u0007\u000b\u000c\u001f\u007f\u0080\u009f \r\n ";
  assert.equal(validateLead({ ...input, message }, SITES).message, "First\nSecond\nThird\n\tIndented");
});

for (const field of ["name", "message"]) {
  test(`${field} accepts one character`, () => {
    assert.equal(validateLead({ ...input, [field]: "x" }, SITES)[field], "x");
  });

  test(`${field} accepts its exact limit after normalization`, () => {
    const value = "x".repeat(LIMITS[field]);
    assert.equal(validateLead({ ...input, [field]: ` \u0000${value}\r\n ` }, SITES)[field], value);
  });

  test(`${field} rejects one character over its limit`, () => {
    assertInvalid({ ...input, [field]: "x".repeat(LIMITS[field] + 1) });
  });
}

test("email accepts the shortest regex match and the exact length limit", () => {
  assert.equal(validateLead({ ...input, email: "a@b.c" }, SITES).email, "a@b.c");
  const email = `${"a".repeat(LIMITS.email - 4)}@b.c`;
  assert.equal(email.length, 254);
  assert.equal(validateLead({ ...input, email: ` ${email} ` }, SITES).email, email);
  assertInvalid({ ...input, email: `a${email}` });
});

test("a non-empty honeypot string short-circuits every field check", () => {
  for (const company_website of ["https://spam.example", " ", "\n"]) {
    assert.deepEqual(validateLead({ company_website }, SITES), { honeypot: true });
    assert.deepEqual(validateLead({ site: "unknown", name: null, company_website }, SITES), { honeypot: true });
  }
});

test("empty and non-string honeypots still validate the lead", () => {
  for (const company_website of [undefined, null, "", 1, true, {}, []]) {
    assert.equal(validateLead({ ...input, company_website }, SITES).name, input.name);
    assertInvalid({ company_website });
  }
});

test("a honeypot cannot bypass the plain-object rule", () => {
  const data = Object.assign([], { company_website: "filled" });
  assertInvalid(data);
});
