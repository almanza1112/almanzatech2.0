const test = require("node:test");
const assert = require("node:assert/strict");

test("the real callable module loads without credentials", () => {
  const exported = require("../index");
  assert.deepEqual(Object.keys(exported), ["submitLead"]);
  assert.equal(typeof exported.submitLead, "function");
  const endpoint = exported.submitLead.__endpoint;
  assert.deepEqual(endpoint.region, ["us-east1"]);
  assert.equal(endpoint.maxInstances, 5);
  assert.equal(endpoint.timeoutSeconds, 30);
  assert.equal(endpoint.availableMemoryMb, 256);
  assert.deepEqual(endpoint.secretEnvironmentVariables.map(({ key }) => key), ["SMTP_USER", "SMTP_PASS"]);
});
