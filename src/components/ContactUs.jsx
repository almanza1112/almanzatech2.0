import React, { useRef, useState } from "react";
import {
  FiAlertCircle,
  FiCheck,
  FiClock,
  FiLoader,
  FiMail,
  FiPhone,
  FiSend,
} from "react-icons/fi";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";
import { SITE } from "../data/site";
import { track } from "../lib/analytics";

const FORM_ENDPOINT = "https://sheetdb.io/api/v1/i2bbvaqeluzn2";

/** Named so bots fill it in, stripped before submit so the sheet never sees it. */
const HONEYPOT = "company_website";

const STATUS = {
  IDLE: "idle",
  SENDING: "sending",
  SENT: "sent",
  ERROR: "error",
};

const ContactUs = () => {
  const formRef = useRef(null);
  const [status, setStatus] = useState(STATUS.IDLE);

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
    data.delete(HONEYPOT);

    setStatus(STATUS.SENDING);

    try {
      const response = await fetch(FORM_ENDPOINT, { method: "POST", body: data });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      track("contact_submit", {});
      setStatus(STATUS.SENT);
      form.reset();
    } catch (error) {
      setStatus(STATUS.ERROR);
    }
  };

  const sending = status === STATUS.SENDING;

  const channels = [
    {
      icon: FiMail,
      label: "Email",
      value: SITE.email,
      href: `mailto:${SITE.email}`,
    },
    {
      icon: FiPhone,
      label: "Phone",
      value: SITE.phoneDisplay,
      href: SITE.phoneHref,
    },
  ];

  return (
    <section id="contact" className="section section--ruled">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Details */}
          <div>
            <SectionHeading
              index="06"
              label="Contact"
              title="Tell us what you are building."
              lead="Send a message or call us directly. We will get back to you with honest next steps — no obligation, no sales script."
            />

            <div className="mt-10 space-y-3">
              {channels.map((channel, i) => {
                const Icon = channel.icon;
                return (
                  <Reveal key={channel.label} delay={i * 90}>
                    <a
                      href={channel.href}
                      onClick={() =>
                        track("contact_click", {
                          channel: channel.href.startsWith("tel:")
                            ? "phone"
                            : "email",
                          location: "contact",
                        })
                      }
                      className="card card-hover !flex-row items-center gap-5 !py-5"
                    >
                      <span className="icon-chip">
                        <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <span className="flex flex-col">
                        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                          {channel.label}
                        </span>
                        <span className="mt-1 break-all font-display text-base font-semibold sm:text-lg">
                          {channel.value}
                        </span>
                      </span>
                    </a>
                  </Reveal>
                );
              })}

              <Reveal delay={180}>
                <div className="card !flex-row items-start gap-5 !py-5">
                  <span className="icon-chip">
                    <FiClock size={20} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                      Hours
                    </span>
                    {SITE.hours.map((slot) => (
                      <span key={slot.days} className="mt-1 text-sm">
                        <span className="font-semibold">{slot.days}</span>{" "}
                        <span className="text-muted">{slot.time}</span>
                      </span>
                    ))}
                  </span>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Form */}
          <Reveal variant="right" delay={120} className="card !p-6 sm:!p-8 lg:!p-10">
            {status === STATUS.SENT ? (
              <div
                className="flex flex-col items-center justify-center py-12 text-center"
                role="status"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary text-primary">
                  <FiCheck size={30} aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold">Message sent</h3>
                <p className="mt-3 max-w-sm text-muted">
                  Thanks for reaching out — we will get back to you shortly. If it is
                  urgent, give us a call at{" "}
                  <a
                    href={SITE.phoneHref}
                    onClick={() =>
                      track("contact_click", {
                        channel: "phone",
                        location: "contact",
                      })
                    }
                    className="link-underline text-primary"
                  >
                    {SITE.phoneDisplay}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setStatus(STATUS.IDLE)}
                  className="btn btn-ghost mt-8"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate={false}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="cf-name">
                      Name
                    </label>
                    <input
                      id="cf-name"
                      className="field"
                      type="text"
                      name="name"
                      placeholder="Jane Rivera"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div>
                    <label className="field-label" htmlFor="cf-email">
                      Email
                    </label>
                    <input
                      id="cf-email"
                      className="field"
                      type="email"
                      name="email"
                      placeholder="jane@company.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="field-label" htmlFor="cf-subject">
                    Subject <span className="normal-case opacity-60">(optional)</span>
                  </label>
                  <input
                    id="cf-subject"
                    className="field"
                    type="text"
                    name="subject"
                    placeholder="New website for my business"
                  />
                </div>

                <div className="mt-5">
                  <label className="field-label" htmlFor="cf-message">
                    Message
                  </label>
                  <textarea
                    id="cf-message"
                    className="field resize-y"
                    name="message"
                    rows="6"
                    placeholder="A few lines about your business and what you need."
                    required
                  />
                </div>

                {/* Honeypot — hidden from people, visible to bots */}
                <input
                  type="text"
                  name={HONEYPOT}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute h-px w-px overflow-hidden opacity-0"
                  style={{ left: "-9999px" }}
                />

                <button
                  type="submit"
                  className="btn btn-primary btn-block mt-7"
                  disabled={sending}
                >
                  {sending ? "Sending" : "Send message"}
                  {sending ? (
                    <FiLoader className="animate-spin" size={16} aria-hidden="true" />
                  ) : (
                    <FiSend size={16} aria-hidden="true" />
                  )}
                </button>

                <p className="mt-4 text-center font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted">
                  We reply to every message
                </p>

                {status === STATUS.ERROR ? (
                  <p
                    className="mt-5 flex items-start gap-3 border border-line-strong bg-ink px-4 py-3.5 text-sm"
                    role="alert"
                  >
                    <FiAlertCircle
                      className="mt-0.5 shrink-0 text-primary"
                      size={16}
                      aria-hidden="true"
                    />
                    <span>
                      That did not go through. Please try again, or email us directly
                      at{" "}
                      <a
                        href={`mailto:${SITE.email}`}
                        onClick={() =>
                          track("contact_click", {
                            channel: "email",
                            location: "contact",
                          })
                        }
                        className="link-underline text-primary"
                      >
                        {SITE.email}
                      </a>
                      .
                    </span>
                  </p>
                ) : null}
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
