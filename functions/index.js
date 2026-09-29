const { onCall } = require("firebase-functions/https");
const { defineSecret, defineString, defineInt } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const nodemailer = require("nodemailer");
const { SITES } = require("./sites");
const { createSubmitLead } = require("./lib/submitLead");

initializeApp();
const db = getFirestore();

const SMTP_USER = defineSecret("SMTP_USER");
const SMTP_PASS = defineSecret("SMTP_PASS");
const SMTP_HOST = defineString("SMTP_HOST", { default: "smtp.gmail.com" });
const SMTP_PORT = defineInt("SMTP_PORT", { default: 465 });

let transport;
function sendMail(message) {
  if (!transport) {
    const port = SMTP_PORT.value();
    transport = nodemailer.createTransport({
      host: SMTP_HOST.value(),
      port,
      secure: port === 465,
      auth: { user: SMTP_USER.value(), pass: SMTP_PASS.value() },
    });
  }
  return transport.sendMail(message);
}

exports.submitLead = onCall({
  region: "us-east1",
  cors: [
    ...Object.values(SITES).flatMap((site) => site.origins),
    /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
  ],
  secrets: [SMTP_USER, SMTP_PASS],
  enforceAppCheck: true,
  consumeAppCheckToken: true,
  // Cap instances to set a cost ceiling.
  maxInstances: 5,
  timeoutSeconds: 30,
  memory: "256MiB",
}, createSubmitLead({
  db,
  sendMail,
  serverTimestamp: () => FieldValue.serverTimestamp(),
  sites: SITES,
  logger,
}));
