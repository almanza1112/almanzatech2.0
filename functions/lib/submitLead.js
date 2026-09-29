const { HttpsError } = require("firebase-functions/https");
const { validateLead } = require("./validate");
const { buildNotification } = require("./email");

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function logMessage(error, lead) {
  // Transport errors can echo contact details, so redact them before logging.
  return [lead.name, lead.email, lead.message].reduce(
    (message, value) => message.replaceAll(value, "[redacted]"),
    errorMessage(error)
  );
}

function createSubmitLead({ db, sendMail, serverTimestamp, sites, logger }) {
  return async (request) => {
    const lead = validateLead(request.data, sites);
    if (lead.honeypot) {
      const site = typeof request.data.site === "string" && Object.hasOwn(sites, request.data.site)
        ? request.data.site
        : null;
      logger.info("honeypot", { site });
      return { ok: true };
    }

    let ref;
    try {
      ref = await db.collection("leads").add({
        site: lead.site,
        name: lead.name,
        email: lead.email,
        need: lead.need,
        message: lead.message,
        appId: request.app?.appId ?? null,
        createdAt: serverTimestamp(),
        notification: { status: "pending" },
      });
    } catch (error) {
      logger.error("Could not save lead.", { site: lead.site, error: logMessage(error, lead) });
      throw new HttpsError("internal", "Could not save the message.");
    }

    let notification = { "notification.status": "sent" };
    try {
      await sendMail(buildNotification(lead, ref.id));
    } catch (error) {
      notification = {
        "notification.status": "failed",
        "notification.error": errorMessage(error).slice(0, 500),
      };
      logger.error("Could not send notification.", {
        site: lead.site,
        id: ref.id,
        error: logMessage(error, lead),
      });
    }

    try {
      if (notification["notification.status"] === "sent") {
        notification["notification.sentAt"] = serverTimestamp();
      }
      await ref.update(notification);
    } catch (error) {
      logger.error("Could not update notification status.", {
        site: lead.site,
        id: ref.id,
        error: logMessage(error, lead),
      });
    }

    return { ok: true, id: ref.id };
  };
}

module.exports = { createSubmitLead };
