import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyDNDGY4hnle3wWoNVaGzC_tr0cWUxZW1pI",
  authDomain: "almanzatech.firebaseapp.com",
  projectId: "almanzatech",
  storageBucket: "almanzatech.firebasestorage.app",
  messagingSenderId: "210339044132",
  appId: "1:210339044132:web:fb47f44f3608e8b53fb1b1",
  measurementId: "G-Z2E4NLHKNW",
};

// Public reCAPTCHA Enterprise site key ("almanzatech.com App Check" in Google Cloud); not a secret.
export const RECAPTCHA_SITE_KEY = "6LclpdUtAAAAAFfc81B2gMjiOZRKM05027nVsLJH";
export const FUNCTIONS_REGION = "us-east1";

let app;

export function getFirebaseApp() {
  if (!app) app = initializeApp(firebaseConfig);
  return app;
}
