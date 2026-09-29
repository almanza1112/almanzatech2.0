const test = require("node:test");
const assert = require("node:assert/strict");
const { HttpsError } = require("firebase-functions/https");
const { createSubmitLead } = require("../lib/submitLead");
const { SITES } = require("../sites");

const data = {
  site: "almanzatech",
  name: "Ada Example",
  email: "Ada@Example.com",
  need: "website",
  message: "Please help with my website.",
};

function setup({ writeError, mailError, updateError } = {}) {
  const calls = { collections: [], documents: [], mail: [], updates: [], logs: [], timestamps: [], order: [] };
  const ref = {
    id: "lead-123",
    async update(fields) {
      calls.order.push("update");
      calls.updates.push(fields);
      if (updateError) throw updateError;
    },
  };
  const db = {
    collection(name) {
      calls.collections.push(name);
      return {
        async add(document) {
          calls.order.push("add");
          calls.documents.push(document);
          if (writeError) throw writeError;
          return ref;
        },
      };
    },
  };
  const sendMail = async (message) => {
    calls.order.push("sendMail");
    calls.mail.push(message);
    if (mailError) throw mailError;
  };
  const serverTimestamp = () => {
    const timestamp = { serverTimestamp: calls.timestamps.length + 1 };
    calls.timestamps.push(timestamp);
    return timestamp;
  };
  const logger = {
    info: (...args) => calls.logs.push({ level: "info", args }),
    error: (...args) => calls.logs.push({ level: "error", args }),
  };
  const handler = createSubmitLead({ db, sendMail, serverTimestamp, sites: SITES, logger });
  return { handler, calls };
}

function assertPrivateLogs(logs) {
  const serialized = JSON.stringify(logs);
  for (const value of [data.name, data.email, data.message]) {
    assert.equal(serialized.includes(value), false);
  }
}

test("saves the exact normalized document, sends the notification, and marks it sent", async () => {
  const { handler, calls } = setup();
  const result = await handler({
    data: { ...data, name: " Ada\r\nExample ", email: " Ada@Example.com ", message: " Please help with my website.\r\n ", ignored: "extra" },
    app: { appId: "app-123" },
    rawRequest: { headers: { "user-agent": "unused" } },
  });
  assert.deepEqual(result, { ok: true, id: "lead-123" });
  assert.deepEqual(calls.collections, ["leads"]);
  assert.deepEqual(calls.documents, [{
    ...data,
    appId: "app-123",
    createdAt: { serverTimestamp: 1 },
    notification: { status: "pending" },
  }]);
  assert.deepEqual(calls.mail, [{
    from: { name: "AlmanzaTech website", address: "bryant@almanzatech.com" },
    to: "bryant@almanzatech.com",
    replyTo: { name: "Ada Example", address: "Ada@Example.com" },
    subject: "New inquiry from Ada Example — Website",
    text: "Name: Ada Example\nEmail: Ada@Example.com\nNeed: Website\nSite: almanzatech\n\nPlease help with my website.\n\nLead ID: lead-123",
  }]);
  assert.deepEqual(calls.updates, [{ "notification.status": "sent", "notification.sentAt": { serverTimestamp: 2 } }]);
  assert.deepEqual(calls.order, ["add", "sendMail", "update"]);
  assert.equal(calls.timestamps.length, 2);
  assert.deepEqual(calls.logs, []);
});

test("missing or null App Check app ids are saved as null", async () => {
  for (const app of [undefined, null, {}, { appId: null }]) {
    const { handler, calls } = setup();
    await handler({ data: { ...data, need: "" }, app });
    assert.equal(calls.documents[0].appId, null);
    assert.equal(calls.documents[0].need, null);
    assert.equal(calls.mail[0].subject, "New inquiry from Ada Example");
  }
});

test("honeypot returns ok without writing, sending mail or creating timestamps", async () => {
  const { handler, calls } = setup();
  assert.deepEqual(await handler({ data: { ...data, company_website: "filled" } }), { ok: true });
  assert.deepEqual(calls, {
    collections: [], documents: [], mail: [], updates: [], timestamps: [], order: [],
    logs: [{ level: "info", args: ["honeypot", { site: "almanzatech" }] }],
  });
  assertPrivateLogs(calls.logs);
});

test("honeypot succeeds even if all other fields are missing", async () => {
  const { handler, calls } = setup();
  assert.deepEqual(await handler({ data: { company_website: "filled" } }), { ok: true });
  assert.deepEqual(calls.order, []);
});

test("honeypot logs cannot echo contact details supplied as an invalid site", async () => {
  for (const site of [data.email, { name: data.name, email: data.email, message: data.message }]) {
    const { handler, calls } = setup();
    assert.deepEqual(await handler({ data: { ...data, site, company_website: "filled" } }), { ok: true });
    assert.deepEqual(calls.order, []);
    assert.deepEqual(calls.logs, [{ level: "info", args: ["honeypot", { site: null }] }]);
    assertPrivateLogs(calls.logs);
  }
});

test("invalid input fails before any side effects", async () => {
  const { handler, calls } = setup();
  await assert.rejects(handler({ data: { ...data, email: "invalid" } }), { code: "invalid-argument" });
  assert.deepEqual(calls, { collections: [], documents: [], mail: [], updates: [], logs: [], timestamps: [], order: [] });
});

test("mail failure still returns ok and stores at most 500 error characters", async () => {
  const message = `SMTP unavailable: ${"x".repeat(600)}`;
  const { handler, calls } = setup({ mailError: new Error(message) });
  assert.deepEqual(await handler({ data }), { ok: true, id: "lead-123" });
  assert.deepEqual(calls.updates, [{ "notification.status": "failed", "notification.error": message.slice(0, 500) }]);
  assert.equal(calls.updates[0]["notification.error"].length, 500);
  assert.equal(calls.documents.length, 1);
  assert.equal(calls.mail.length, 1);
  assert.equal(calls.timestamps.length, 1);
  assert.deepEqual(calls.logs, [{ level: "error", args: ["Could not send notification.", { site: "almanzatech", id: "lead-123", error: message }] }]);
  assertPrivateLogs(calls.logs);
});

test("mail failure preserves a short error message", async () => {
  const { handler, calls } = setup({ mailError: new Error("SMTP unavailable") });
  assert.deepEqual(await handler({ data }), { ok: true, id: "lead-123" });
  assert.deepEqual(calls.updates, [{ "notification.status": "failed", "notification.error": "SMTP unavailable" }]);
});

test("status-update failure after sending mail still returns ok without marking mail failed", async () => {
  const { handler, calls } = setup({ updateError: new Error("Update unavailable") });
  assert.deepEqual(await handler({ data }), { ok: true, id: "lead-123" });
  assert.deepEqual(calls.updates, [{ "notification.status": "sent", "notification.sentAt": { serverTimestamp: 2 } }]);
  assert.equal(calls.mail.length, 1);
  assert.deepEqual(calls.logs, [{ level: "error", args: ["Could not update notification status.", { site: "almanzatech", id: "lead-123", error: "Update unavailable" }] }]);
  assertPrivateLogs(calls.logs);
});

test("mail and failed-status update failures together still return ok", async () => {
  const { handler, calls } = setup({ mailError: new Error("SMTP unavailable"), updateError: new Error("Update unavailable") });
  assert.deepEqual(await handler({ data }), { ok: true, id: "lead-123" });
  assert.deepEqual(calls.updates, [{ "notification.status": "failed", "notification.error": "SMTP unavailable" }]);
  assert.equal(calls.logs.length, 2);
  assert.ok(calls.logs.every((log) => log.level === "error"));
  assertPrivateLogs(calls.logs);
});

test("Firestore write failure returns the specified internal error and sends no mail", async () => {
  const { handler, calls } = setup({ writeError: new Error("Firestore unavailable") });
  await assert.rejects(handler({ data }), (error) => {
    assert.ok(error instanceof HttpsError);
    assert.equal(error.code, "internal");
    assert.equal(error.message, "Could not save the message.");
    return true;
  });
  assert.deepEqual(calls.mail, []);
  assert.deepEqual(calls.updates, []);
  assert.deepEqual(calls.order, ["add"]);
  assert.deepEqual(calls.logs, [{ level: "error", args: ["Could not save lead.", { site: "almanzatech", error: "Firestore unavailable" }] }]);
  assertPrivateLogs(calls.logs);
});

test("logs redact contact details echoed by dependency errors", async () => {
  for (const failure of ["writeError", "mailError", "updateError"]) {
    const error = new Error(`Failed for ${data.name}, ${data.email}: ${data.message}`);
    const { handler, calls } = setup({ [failure]: error });
    if (failure === "writeError") {
      await assert.rejects(handler({ data }), { code: "internal" });
    } else {
      assert.deepEqual(await handler({ data }), { ok: true, id: "lead-123" });
    }
    assert.equal(calls.logs.length, 1);
    assert.equal(calls.logs[0].args[1].error, "Failed for [redacted], [redacted]: [redacted]");
    assertPrivateLogs(calls.logs);
  }
});

test("non-Error rejections still preserve a saved lead", async () => {
  const { handler, calls } = setup({ mailError: "SMTP unavailable", updateError: "Update unavailable" });
  assert.deepEqual(await handler({ data }), { ok: true, id: "lead-123" });
  assert.deepEqual(calls.updates, [{ "notification.status": "failed", "notification.error": "SMTP unavailable" }]);
  assertPrivateLogs(calls.logs);
});
