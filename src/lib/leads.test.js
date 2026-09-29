const mockApp = {};
const mockFunctions = {};
const mockCallable = jest.fn();
const mockGetFirebaseApp = jest.fn();
const mockInitializeAppCheck = jest.fn();
const mockProvider = jest.fn();
const mockGetFunctions = jest.fn();
const mockConnectFunctionsEmulator = jest.fn();
const mockHttpsCallable = jest.fn();
const mockLoadAppCheck = jest.fn();
const mockLoadFunctions = jest.fn();
let mockSiteKey = "test-site-key";

jest.mock("./firebase", () => ({
  getFirebaseApp: mockGetFirebaseApp,
  get RECAPTCHA_SITE_KEY() { return mockSiteKey; },
  FUNCTIONS_REGION: "us-east1",
}));

jest.mock("firebase/app-check", () => {
  mockLoadAppCheck();
  return {
    initializeAppCheck: mockInitializeAppCheck,
    ReCaptchaEnterpriseProvider: mockProvider,
  };
});

jest.mock("firebase/functions", () => {
  mockLoadFunctions();
  return {
    getFunctions: mockGetFunctions,
    connectFunctionsEmulator: mockConnectFunctionsEmulator,
    httpsCallable: mockHttpsCallable,
  };
});

const originalEnv = process.env;
const originalDebugToken = globalThis.self.FIREBASE_APPCHECK_DEBUG_TOKEN;
const fields = {
  name: "Jane Rivera",
  email: "jane@example.com",
  need: "website",
  message: "I would like to build a website for my business.",
};

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  mockGetFirebaseApp.mockReturnValue(mockApp);
  mockGetFunctions.mockReturnValue(mockFunctions);
  mockHttpsCallable.mockReturnValue(mockCallable);
  mockCallable.mockReset().mockResolvedValue({ data: { ok: true, id: "lead-id" } });
  mockInitializeAppCheck.mockReset();
  mockLoadFunctions.mockReset();
  mockSiteKey = "test-site-key";
  process.env = { ...originalEnv, NODE_ENV: "test" };
  delete process.env.REACT_APP_APPCHECK_DEBUG_TOKEN;
  delete process.env.REACT_APP_FUNCTIONS_EMULATOR;
  delete globalThis.self.FIREBASE_APPCHECK_DEBUG_TOKEN;
});

afterEach(() => {
  process.env = originalEnv;
  if (originalDebugToken === undefined) delete globalThis.self.FIREBASE_APPCHECK_DEBUG_TOKEN;
  else globalThis.self.FIREBASE_APPCHECK_DEBUG_TOKEN = originalDebugToken;
});

test("loads lazily once and shares preparation across concurrent calls", async () => {
  const { prepareLeadClient, submitLead } = require("./leads");
  expect(mockLoadAppCheck).not.toHaveBeenCalled();
  expect(mockLoadFunctions).not.toHaveBeenCalled();
  const prepared = prepareLeadClient();
  expect(prepareLeadClient()).toBe(prepared);
  await Promise.all([submitLead(fields), submitLead(fields)]);
  expect(await prepared).toBe(mockCallable);
  expect(mockLoadAppCheck).toHaveBeenCalledTimes(1);
  expect(mockLoadFunctions).toHaveBeenCalledTimes(1);
  expect(mockGetFirebaseApp).toHaveBeenCalledTimes(1);
  expect(mockInitializeAppCheck).toHaveBeenCalledTimes(1);
  expect(mockHttpsCallable).toHaveBeenCalledTimes(1);
  expect(mockCallable).toHaveBeenCalledTimes(2);
});

test("uses the Enterprise provider, region and limited-use tokens without refreshing", async () => {
  const { prepareLeadClient } = require("./leads");
  await prepareLeadClient();
  expect(mockProvider).toHaveBeenCalledWith("test-site-key");
  expect(mockInitializeAppCheck).toHaveBeenCalledWith(mockApp, {
    provider: mockProvider.mock.instances[0],
    isTokenAutoRefreshEnabled: false,
  });
  expect(mockGetFunctions).toHaveBeenCalledWith(mockApp, "us-east1");
  expect(mockHttpsCallable).toHaveBeenCalledWith(mockFunctions, "submitLead", {
    limitedUseAppCheckTokens: true,
    timeout: 20000,
  });
  expect(mockConnectFunctionsEmulator).not.toHaveBeenCalled();
});

test.each(["website", "app", "it-support", "not-sure", "", null, undefined])(
  "sends only the lead fields and site with need %s and returns data", async (need) => {
    const { LEAD_SITE, submitLead } = require("./leads");
    expect(LEAD_SITE).toBe("almanzatech");
    await expect(submitLead({ ...fields, need, extra: "ignored" }))
      .resolves.toEqual({ ok: true, id: "lead-id" });
    expect(mockCallable).toHaveBeenCalledWith({
      ...fields, site: "almanzatech", need: need || null,
    });
  }
);

test.each([{ data: { ok: false } }, {}, { data: null }, { data: { ok: "true" } }])(
  "rejects an unsuccessful or missing acknowledgement (%j)", async (response) => {
    mockCallable.mockResolvedValueOnce(response);
    const { submitLead } = require("./leads");
    await expect(submitLead(fields)).rejects.toThrow("Could not save the message.");
  }
);

test("retries a rejected module load on the next call", async () => {
  const error = new Error("Chunk failed");
  mockLoadFunctions.mockImplementationOnce(() => { throw error; });
  const { prepareLeadClient, submitLead } = require("./leads");
  const failed = prepareLeadClient();
  await expect(failed).rejects.toBe(error);
  expect(mockCallable).not.toHaveBeenCalled();
  const retry = prepareLeadClient();
  expect(retry).not.toBe(failed);
  await retry;
  await expect(submitLead(fields)).resolves.toEqual({ ok: true, id: "lead-id" });
  expect(mockLoadFunctions).toHaveBeenCalledTimes(2);
  expect(mockInitializeAppCheck).toHaveBeenCalledTimes(1);
});

test("a missing site key fails before initialization or any callable request", async () => {
  mockSiteKey = "";
  const { prepareLeadClient, submitLead } = require("./leads");
  const failed = prepareLeadClient();
  await expect(failed).rejects.toThrow("App Check site key missing");
  await expect(submitLead(fields)).rejects.toThrow("App Check site key missing");
  expect(mockGetFirebaseApp).not.toHaveBeenCalled();
  expect(mockInitializeAppCheck).not.toHaveBeenCalled();
  expect(mockProvider).not.toHaveBeenCalled();
  expect(mockGetFunctions).not.toHaveBeenCalled();
  expect(mockHttpsCallable).not.toHaveBeenCalled();
  expect(mockCallable).not.toHaveBeenCalled();
  mockSiteKey = "test-site-key";
  await expect(submitLead(fields)).resolves.toEqual({ ok: true, id: "lead-id" });
});

test("a callable rejection propagates and allows another submission", async () => {
  const error = new Error("Service unavailable");
  mockCallable.mockRejectedValueOnce(error);
  const { submitLead } = require("./leads");
  await expect(submitLead(fields)).rejects.toBe(error);
  await expect(submitLead(fields)).resolves.toEqual({ ok: true, id: "lead-id" });
  expect(mockInitializeAppCheck).toHaveBeenCalledTimes(1);
});

test.each([undefined, "debug-token"])("sets the development debug token %s before init", async (token) => {
  process.env.NODE_ENV = "development";
  if (token) process.env.REACT_APP_APPCHECK_DEBUG_TOKEN = token;
  mockInitializeAppCheck.mockImplementation(() => {
    expect(globalThis.self.FIREBASE_APPCHECK_DEBUG_TOKEN).toBe(token || true);
  });
  const { prepareLeadClient } = require("./leads");
  await prepareLeadClient();
  expect(mockInitializeAppCheck).toHaveBeenCalledTimes(1);
});

test("connects the emulator only when configured outside production", async () => {
  process.env.NODE_ENV = "development";
  process.env.REACT_APP_FUNCTIONS_EMULATOR = "127.0.0.1:5001";
  const { prepareLeadClient } = require("./leads");
  await prepareLeadClient();
  expect(mockConnectFunctionsEmulator).toHaveBeenCalledWith(mockFunctions, "127.0.0.1", 5001);
  expect(mockConnectFunctionsEmulator.mock.invocationCallOrder[0])
    .toBeLessThan(mockHttpsCallable.mock.invocationCallOrder[0]);
});

test("production ignores debug and emulator environment settings", async () => {
  process.env.NODE_ENV = "production";
  process.env.REACT_APP_APPCHECK_DEBUG_TOKEN = "debug-token";
  process.env.REACT_APP_FUNCTIONS_EMULATOR = "127.0.0.1:5001";
  const { prepareLeadClient } = require("./leads");
  await prepareLeadClient();
  expect(globalThis.self.FIREBASE_APPCHECK_DEBUG_TOKEN).toBeUndefined();
  expect(mockConnectFunctionsEmulator).not.toHaveBeenCalled();
  expect(mockInitializeAppCheck).toHaveBeenCalledTimes(1);
});
