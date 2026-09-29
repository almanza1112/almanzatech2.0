import { FUNCTIONS_REGION, getFirebaseApp, RECAPTCHA_SITE_KEY } from "./firebase";

export const LEAD_SITE = "almanzatech";

let clientPromise;

export function prepareLeadClient() {
  if (!clientPromise) {
    clientPromise = Promise.all([
      import("firebase/app-check"),
      import("firebase/functions"),
    ]).then(([appCheck, functions]) => {
      if (!RECAPTCHA_SITE_KEY) throw new Error("App Check site key missing");

      if (process.env.NODE_ENV !== "production") {
        window.self.FIREBASE_APPCHECK_DEBUG_TOKEN =
          process.env.REACT_APP_APPCHECK_DEBUG_TOKEN || true;
      }

      const app = getFirebaseApp();
      appCheck.initializeAppCheck(app, {
        provider: new appCheck.ReCaptchaEnterpriseProvider(RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: false,
      });
      const instance = functions.getFunctions(app, FUNCTIONS_REGION);

      if (process.env.NODE_ENV !== "production" && process.env.REACT_APP_FUNCTIONS_EMULATOR) {
        const [host, port] = process.env.REACT_APP_FUNCTIONS_EMULATOR.split(":");
        functions.connectFunctionsEmulator(instance, host, Number(port));
      }

      return functions.httpsCallable(instance, "submitLead", {
        limitedUseAppCheckTokens: true,
        timeout: 20000,
      });
    }).catch((error) => {
      clientPromise = null;
      throw error;
    });
  }
  return clientPromise;
}

export async function submitLead({ name, email, need, message }) {
  const callable = await prepareLeadClient();
  const { data } = await callable({
    site: LEAD_SITE,
    name,
    email,
    need: need || null,
    message,
  });
  if (data?.ok !== true) throw new Error("Could not save the message.");
  return data;
}
