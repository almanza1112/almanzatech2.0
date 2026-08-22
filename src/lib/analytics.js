import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDNDGY4hnle3wWoNVaGzC_tr0cWUxZW1pI",
  authDomain: "almanzatech.firebaseapp.com",
  projectId: "almanzatech",
  storageBucket: "almanzatech.firebasestorage.app",
  messagingSenderId: "210339044132",
  appId: "1:210339044132:web:fb47f44f3608e8b53fb1b1",
  measurementId: "G-Z2E4NLHKNW",
};

let analytics = null;

// Keep development sessions and jsdom tests out of production analytics.
if (process.env.NODE_ENV === "production") {
  try {
    isSupported()
      .then((supported) => {
        if (!supported) return;

        const app = initializeApp(firebaseConfig);
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
