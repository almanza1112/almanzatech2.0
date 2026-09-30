import React, { useRef, useState } from "react";
import { SITE } from "../data/site";
import { PAGE_COPY } from "../data/work";
import { track } from "../lib/analytics";

// Named so bots fill it in; a filled value shows fake success and sends nothing.
const HONEYPOT = "company_website";
const LIMITS = { name: 100, email: 254, message: 5000 };

const STATUS = {
  IDLE: "idle",
  SENDING: "sending",
  SENT: "sent",
  ERROR: "error",
};

const ContactUs = () => {
  const formRef = useRef(null);
  const preparedRef = useRef(false);
  const [status, setStatus] = useState(STATUS.IDLE);

  const handleFocus = () => {
    if (preparedRef.current) return;
    preparedRef.current = true;
    import("../lib/leads")
      .then(({ prepareLeadClient }) => prepareLeadClient())
      .catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form || status === STATUS.SENDING) return;

    const data = new FormData(form);

    // Anything that filled the hidden field is a bot. Show success, send nothing.
    if (data.get(HONEYPOT)) {
      setStatus(STATUS.SENT);
      return;
    }
    const need = data.get("need");

    setStatus(STATUS.SENDING);

    try {
      const { submitLead } = await import("../lib/leads");
      await submitLead({
        name: data.get("name"),
        email: data.get("email"),
        need,
        message: data.get("message"),
      });
      track("contact_submit", { need: need || "unspecified" });
      setStatus(STATUS.SENT);
      form.reset();
    } catch (error) {
      setStatus(STATUS.ERROR);
    }
  };

  const sending = status === STATUS.SENDING;

  const copy = PAGE_COPY.contact;
  const [needLegend, needOptional] = copy.need.legend.split(/ (?=\()/);
  const [successBeforePhone, successAfterPhone] = copy.success.message.split(
    SITE.phoneDisplay
  );
  const [errorBeforeEmail, errorAfterEmail] = copy.error.split(SITE.email);

  return (
    <section
      id="contact"
      className="contact-section"
      aria-labelledby="contact-title"
    >
      <div className="wrap">
        <div className="contact-head">
          <h2 id="contact-title">{copy.heading}</h2>
          <p>{copy.intro}</p>
        </div>

        <div className="contact-grid">
          <div className="contact-form-wrap">
            {status === STATUS.SENT ? (
              <div className="contact-success" role="status">
                <h3>{copy.success.heading}</h3>
                <p>
                  {successBeforePhone}
                  <a
                    href={SITE.phoneHref}
                    onClick={() =>
                      track("contact_click", {
                        channel: "phone",
                        location: "contact",
                      })
                    }
                    className="contact-link"
                  >
                    {SITE.phoneDisplay}
                  </a>
                  {successAfterPhone}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus(STATUS.IDLE)}
                  className="btn contact-submit"
                >
                  {copy.success.reset}
                </button>
              </div>
            ) : (
              <form
                className="contact-form"
                ref={formRef}
                onFocus={handleFocus}
                onSubmit={handleSubmit}
                noValidate={false}
                aria-labelledby="contact-title"
              >
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label htmlFor="cf-name">{copy.fields.name}</label>
                    <input
                      id="cf-name"
                      className="contact-input"
                      type="text"
                      name="name"
                      autoComplete="name"
                      maxLength={LIMITS.name}
                      required
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="cf-email">{copy.fields.email}</label>
                    <input
                      id="cf-email"
                      className="contact-input"
                      type="email"
                      name="email"
                      autoComplete="email"
                      maxLength={LIMITS.email}
                      required
                    />
                  </div>
                </div>

                <fieldset className="contact-need">
                  <legend>
                    {needLegend} <span>{needOptional}</span>
                  </legend>
                  <div className="contact-need-options">
                    {copy.need.options.map(({ value, label }) => (
                      <label key={value}>
                        <input type="radio" name="need" value={value} />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="contact-field">
                  <label htmlFor="cf-message">{copy.fields.message}</label>
                  <textarea
                    id="cf-message"
                    className="contact-input"
                    name="message"
                    aria-describedby="cf-message-hint"
                    maxLength={LIMITS.message}
                    required
                  />
                  <p className="contact-hint" id="cf-message-hint">
                    {copy.hint}
                  </p>
                </div>

                {/* Honeypot — hidden from people, visible to bots */}
                <input
                  type="text"
                  name={HONEYPOT}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="sr-only"
                />

                <button
                  type="submit"
                  className="btn contact-submit"
                  disabled={sending}
                >
                  {sending ? copy.sending : copy.submit}
                </button>

                {status === STATUS.ERROR ? (
                  <p className="contact-error" role="alert">
                    {errorBeforeEmail}
                    <a
                      href={`mailto:${SITE.email}`}
                      onClick={() =>
                        track("contact_click", {
                          channel: "email",
                          location: "contact",
                        })
                      }
                      className="contact-link"
                    >
                      {SITE.email}
                    </a>
                    {errorAfterEmail}
                  </p>
                ) : null}

                <p className="contact-legal">
                  {copy.recaptcha.text}
                  {copy.recaptcha.privacyBefore}
                  <a href="/privacy/">
                    {copy.recaptcha.privacyLink}
                  </a>
                  {copy.recaptcha.privacyAfter}
                </p>
              </form>
            )}
          </div>

          <div className="contact-details">
            <h3>{copy.phoneHeading}</h3>
            <a
              className="contact-link contact-phone"
              href={SITE.phoneHref}
              onClick={() =>
                track("contact_click", { channel: "phone", location: "contact" })
              }
            >
              {SITE.phoneDisplay}
            </a>
            <a
              className="contact-link contact-email"
              href={`mailto:${SITE.email}`}
              onClick={() =>
                track("contact_click", { channel: "email", location: "contact" })
              }
            >
              {SITE.email}
            </a>
            <div className="contact-hours">
              <h4>{copy.hoursHeading}</h4>
              {copy.hours.map((hours) => (
                <p key={hours}>{hours}</p>
              ))}
            </div>
            <p className="contact-local">
              {copy.company}
              <br />
              {copy.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
