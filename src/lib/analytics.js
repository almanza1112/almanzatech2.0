import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { getFirebaseApp } from "./firebase";

let analytics = null;

// Keep development sessions and jsdom tests out of production analytics.
if (process.env.NODE_ENV === "production") {
  try {
    isSupported()
      .then((supported) => {
        if (!supported) return;

        const app = getFirebaseApp();
        analytics = getAnalytics(app);
      })
      .catch(() => {
        // Analytics must never affect page behavior.
      });
  } catch {
    // Analytics must never affect page behavior.
  }
}

export function track(eventName, params) {
  if (!analytics) return;

  try {
    logEvent(analytics, eventName, params);
  } catch {
    // Analytics must never affect page behavior.
  }
}
