# Contact form backend

**Deploy order:** fill in the reCAPTCHA site key and deploy the function before merging the site to `master`. A push to `master` publishes the site automatically. Without the key and backend setup, the live form shows its error message.

The callable function `submitLead` runs in `us-east1` in the `almanzatech` Firebase project. It validates a message, saves it in Firestore's `leads` collection, then emails a notification from and to bryant@almanzatech.com. Replying to that email addresses the person who submitted the form. The site's id is `almanzatech`.

## Setup

Use Node.js 22, Yarn, the [Firebase CLI](https://firebase.google.com/docs/cli), and the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install). Run every shell command below from the repository root, which contains `firebase.json`.

1. Select the Firebase account that owns this project. The default CLI account does not own it.

   ```sh
   firebase login:use almanza1112@gmail.com
   ```

   If that account is not signed in, run `firebase login:add`, sign in as almanza1112@gmail.com, then repeat the command above.

2. Open the [Firebase console for almanzatech](https://console.firebase.google.com/project/almanzatech/overview). Upgrade to **Blaze** and set a monthly budget alert under **Usage and billing**. Choose an amount you can afford; an alert does not stop spending.

3. In **Firestore Database**, create the `(default)` database. Choose **Standard edition**, **Native mode**, location **us-east1**, and **production mode** rules. The rules in this repository deny all browser reads and writes; the function uses the Admin SDK to save leads.

4. In the Google Cloud console, select `almanzatech` and open **reCAPTCHA**. Enable the reCAPTCHA Enterprise API if prompted. Create a **score-based Web key** for `almanzatech.com` and `www.almanzatech.com`; leave **Use checkbox challenge** off. In Firebase console → **App Check** → **Apps**, register the existing web app with the **reCAPTCHA Enterprise** provider and this key. Set `RECAPTCHA_SITE_KEY` in [src/lib/firebase.js](../src/lib/firebase.js) to the same key. It is public, not a password. See the [App Check setup instructions](https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider).

5. Grant the function permission to consume App Check tokens for replay protection. Sign in to the Google Cloud CLI with the owner account, then grant the **Firebase App Check Token Verifier** role to the runtime service account:

   ```sh
   gcloud auth login almanza1112@gmail.com
   gcloud projects add-iam-policy-binding almanzatech --member=serviceAccount:210339044132-compute@developer.gserviceaccount.com --role=roles/firebaseappcheck.tokenVerifier
   ```

   App Check is enforced in code with `enforceAppCheck: true` from the first deploy. `consumeAppCheckToken: true` enables replay protection. The console's App Check **Enforce** toggles for Firestore and Storage do not control this function and are not needed for this form: Firestore rules deny all client access. See [function enforcement and replay protection](https://firebase.google.com/docs/app-check/cloud-functions).

6. Sign in to bryant@almanzatech.com (Google Workspace), turn on **2-Step Verification**, and create an [app password](https://support.google.com/accounts/answer/185833). If app passwords are unavailable, ask the Workspace administrator to allow them. Store the login and app password through the prompts:

   ```sh
   firebase functions:secrets:set SMTP_USER --project almanzatech
   firebase functions:secrets:set SMTP_PASS --project almanzatech
   ```

   For `SMTP_USER`, enter bryant@almanzatech.com. For `SMTP_PASS`, enter the app password, not the normal account password. To send from a different address later, change `from` in `sites.js`. If that address is an alias rather than the `SMTP_USER` account, add it in Gmail → **Settings** → **Accounts** → **Send mail as**, or Gmail rewrites the From line.

   `SMTP_HOST` (`smtp.gmail.com`) and `SMTP_PORT` (`465`) are set in `functions/.env`, which deploys need because they can't prompt for values. To change them, edit that file and redeploy. It is committed, so keep SMTP credentials in the two secrets above. See [environment configuration](https://firebase.google.com/docs/functions/config-env).

7. Install the pinned function dependencies, run their tests, and deploy the function and Firestore rules:

   ```sh
   npm --prefix functions ci
   npm --prefix functions test
   firebase deploy --only functions,firestore:rules --project almanzatech
   ```

   Confirm that `submitLead` appears in `us-east1` in the Firebase console. If you change either SMTP secret later, repeat the deploy command so the function uses the new value.

   If the form fails and the function's logs show `403 ... The request was not authenticated`, the function isn't open to public calls. Firebase sets that when it first creates the function, but a first deploy that fails partway can skip it. Browsers must be able to call the function; App Check is the gate. Fix it once with:

   ```sh
   gcloud run services add-iam-policy-binding submitlead --region=us-east1 --member=allUsers --role=roles/run.invoker --project=almanzatech
   ```

8. Test locally. In Firebase console → **App Check** → **Apps** → the web app's menu → **Manage debug tokens**, create a token. In the root `.env.development.local`, add `REACT_APP_APPCHECK_DEBUG_TOKEN=` and paste the token after `=`. This file is gitignored; keep the token private. The public `RECAPTCHA_SITE_KEY` must still be filled in. See [debug tokens](https://firebase.google.com/docs/app-check/web/debug-provider).

   ```sh
   yarn start
   ```

   Open http://localhost:3000 and submit the form. Leave `REACT_APP_FUNCTIONS_EMULATOR` unset to call the deployed function; this saves a real lead and sends real email. If you already run a Functions emulator, set `REACT_APP_FUNCTIONS_EMULATOR` to its `host:port`, such as `127.0.0.1:5001`, in the same file. That setting changes only the function address; the emulator's Firestore and SMTP setup determines where it saves data and sends email. Both environment variables are used only outside production. Restart `yarn start` after changing them.

9. After local testing passes, publish the site with the filled-in key through the existing `master` workflow. Send one test message through the live form. Confirm the notification reaches bryant@almanzatech.com and that Firebase console → **Firestore Database** → **Data** → **leads** contains the matching document with `site: "almanzatech"` and `notification.status: "sent"`.

## Reading leads

1. Open Firebase console → **Firestore Database** → **Data** → **leads**. Each document contains `site`, `name`, `email`, `need`, `message`, `appId`, `createdAt`, and `notification`. The optional `need` is `null` or one of `website`, `app`, `it-support`, and `not-sure` for this site.

2. Check `notification.status`:

   | Value | Meaning |
   | --- | --- |
   | `pending` | The lead was saved. Email sending or the status update has not finished. It can stay here if the status update failed. |
   | `sent` | The mail server accepted the notification. `notification.sentAt` records when the function recorded success; check the inbox or spam folder for delivery. |
   | `failed` | Sending failed. `notification.error` contains the error, limited to 500 characters. The lead is still saved. |

   A saved lead returns success to the form even if email or the status update fails. There is no automatic email retry. Follow up from the saved lead and check the function logs when a notification is missing:

   ```sh
   firebase functions:log --only submitLead --project almanzatech
   ```

## Reuse in this Firebase project

1. Add an entry to `SITES` in [sites.js](sites.js), using a unique id such as `second-site`. Copy the `almanzatech` entry and set `name`, `origins`, `notifyTo`, `from`, and `needs`. Each origin needs its scheme and hostname, for example `https://second-site.example`, with no path or trailing slash. Ensure the SMTP account can send from the chosen `from` address.

2. Add that site's web app to the `almanzatech` Firebase project. Create a score-based Web key for its domains and register that app for App Check, as in setup step 4. Initialize its Firebase app and App Check before submitting. You can copy [src/lib/firebase.js](../src/lib/firebase.js) and [src/lib/leads.js](../src/lib/leads.js), fill in the new web app's Firebase configuration and `RECAPTCHA_SITE_KEY`, and change `LEAD_SITE` to the new id.

3. Redeploy the function to load the new site entry and allowed origins:

   ```sh
   firebase deploy --only functions --project almanzatech
   ```

4. Call `submitLead` in `us-east1` with the matching `site` id and limited-use App Check tokens. For example, in the new site's client after Firebase and App Check initialization:

   ```js
   import { getApp } from "firebase/app";
   import { getFunctions, httpsCallable } from "firebase/functions";

   const submitLead = httpsCallable(
     getFunctions(getApp(), "us-east1"),
     "submitLead",
     { limitedUseAppCheckTokens: true, timeout: 20000 }
   );

   const { data } = await submitLead({
     site: "second-site",
     name: "Test Visitor",
     email: "visitor@example.com",
     need: null,
     message: "Test message from the second site.",
   });
   if (data?.ok !== true) throw new Error("Could not save the message.");
   ```

   `name`, `email`, and `message` are required, with limits of 100, 254, and 5000 characters. A supplied `need` must be a key in that site's `needs`. All sites share the `leads` collection; use `site` to tell them apart.

## Reuse in another Firebase project

1. Copy `functions/` into the other repository, excluding `node_modules` and local environment or secret files. Edit `sites.js` for that site. Copy the root `firebase.json`, `firestore.rules`, and `firestore.indexes.json` too. If that repository already has Firebase configuration or rules, combine them with the existing files; these rules deny all client access.

2. Set `.firebaserc` in the new repository to the new project's id. Repeat the setup steps with its owner account and project id in every command. In the IAM command, use its project number from Firebase **Project settings** in place of `210339044132`. Create the SMTP secrets and register the web app for App Check in the new project as well.

3. Use the new web app's Firebase configuration and public reCAPTCHA key in the client, and match its `site` id to `sites.js`. Keep the function name `submitLead` and region `us-east1`. Deploy the backend before publishing that site, then verify a lead and its email as in setup step 9.

## Costs

Blaze is pay-as-you-go. A low-volume form should fit within the free usage quotas for [Functions and Firestore](https://firebase.google.com/pricing). [Secret Manager](https://cloud.google.com/secret-manager/pricing) includes six active secret versions and 10,000 access operations per month at no charge. The reCAPTCHA Enterprise API used by App Check has a free allowance of [10,000 assessments per month](https://cloud.google.com/security/products/recaptcha), shared across the organization.

Free quotas do not guarantee a zero bill: other project usage, stored deployment images, and the Workspace mailbox can add costs. Keep the budget alert from setup step 2 enabled and review usage. [Budget alerts notify you; they do not cap spending](https://firebase.google.com/docs/projects/billing/advanced-billing-alerts-logic).
