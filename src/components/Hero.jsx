import React, { useEffect, useRef, useState } from "react";
import { CASE_PAGE_COPY, CASE_STUDIES, PAGE_COPY, WEBSITES } from "../data/work";
import { track } from "../lib/analytics";
import { supportsObserver, usePausedMotion, useReducedMotion } from "../lib/motion";
import dashboard from "../assets/hero-screens/screen-01-dashboard.svg";
import chart from "../assets/hero-screens/screen-02-chart.svg";
import list from "../assets/hero-screens/screen-03-list.svg";
import calendar from "../assets/hero-screens/screen-04-calendar.svg";
import shop from "../assets/hero-screens/screen-05-shop.svg";
import chat from "../assets/hero-screens/screen-06-chat.svg";
import settings from "../assets/hero-screens/screen-07-settings.svg";
import map from "../assets/hero-screens/screen-08-map.svg";
import onboard from "../assets/hero-screens/screen-09-onboard.svg";
import form from "../assets/hero-screens/screen-10-form.svg";
import player from "../assets/hero-screens/screen-11-player.svg";
import light from "../assets/hero-screens/screen-12-light.svg";

const WALL_COLUMNS = [
  [dashboard, shop, onboard, list, light],
  [chart, settings, calendar, player, chat],
  [map, list, light, dashboard, form],
  [chat, player, chart, onboard, shop],
  [calendar, form, settings, map, dashboard],
];
const RECENT_WORK = [
  ...CASE_STUDIES.map(({ name, tags }) => ({ name, tags: tags.join(" · ") })),
  ...WEBSITES.map(({ name }) => ({ name, tags: CASE_PAGE_COPY.media.website })),
];
const headingLines = PAGE_COPY.hero.heading.split(/ (?=and IT|businesses and)/);
const proofBreak = PAGE_COPY.hero.proof.indexOf(". ") + 1;

const Hero = () => {
  const heroRef = useRef(null);
  const enteredRef = useRef(false);
  const reduced = useReducedMotion();
  const [paused, setPaused] = usePausedMotion();
  const [autoPaused, setAutoPaused] = useState(() => document.hidden);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    let offscreen = false;
    const update = () => setAutoPaused(offscreen || document.hidden);
    const observer = supportsObserver ? new IntersectionObserver(([entry]) => {
      offscreen = !entry.isIntersecting;
      update();
    }, { threshold: 0 }) : null;
    observer?.observe(heroRef.current);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (reduced) {
      setEntered(false);
      return undefined;
    }
    if (enteredRef.current || !window.matchMedia?.("(min-width: 1000px)").matches) {
      return undefined;
    }
    const frame = window.requestAnimationFrame(() => {
      enteredRef.current = true;
      setEntered(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [reduced]);

  return (
    <section
      id="top"
      ref={heroRef}
      className={`hero${autoPaused ? " hero--paused" : ""}${entered && !reduced ? " hero--entered" : ""}`}
      aria-labelledby="hero-title"
    >
      <div className="hero-wall" aria-hidden="true">
        {WALL_COLUMNS.map((screens, column) => (
          <div className="hero-wall-col" key={column}>
            {[0, 1].map((set) => (
              <div className="hero-wall-set wall-set" key={set}>
                {screens.map((src) => (
                  <img key={src} src={src} alt="" width="360" height="780" decoding="async" />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="wrap hero-inner">
        <h1 id="hero-title" className="hero-title" aria-label={PAGE_COPY.hero.heading}>
          {headingLines.map((line, index) => (
            <React.Fragment key={line}>
              {index > 0 && " "}
              <span className="hero-line" aria-hidden="true"><span>{line}</span></span>
            </React.Fragment>
          ))}
        </h1>
        <p className="hero-proof">
          <span className="hero-outline">
            {PAGE_COPY.hero.proof.slice(0, proofBreak).split(/(in-house\.)/).map((part, index) =>
              index % 2 ? <span className="keep-together" key={index}>{part}</span> : part
            )}
          </span>{" "}
          <span>{PAGE_COPY.hero.proof.slice(proofBreak + 1)}</span>
        </p>
        <div className="hero-actions" onAnimationEnd={() => setEntered(false)}>
          <a
            className="btn"
            href={PAGE_COPY.hero.cta.href}
            onClick={() =>
              track("cta_click", {
                label: PAGE_COPY.hero.cta.label,
                location: "hero",
              })
            }
          >
            {PAGE_COPY.hero.cta.label}
            <span className="arr" aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="hero-footer">
        {!reduced && (
          <button
            className="hero-motion-btn motion-btn"
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((current) => !current)}
          >
            <span className="hero-motion-icon" aria-hidden="true"><i /><i /></span>
            {paused ? "Play motion" : "Pause motion"}
          </button>
        )}
        <div className="hero-ticker" role="region" aria-label="Recent work">
          <span className="hero-ticker-label" aria-hidden="true">Recent work</span>
          <div className="hero-ticker-track">
            {[0, 1].map((group) => (
              <div className="hero-ticker-group" key={group} aria-hidden={group === 1 ? true : undefined}>
                {RECENT_WORK.map(({ name, tags }) => (
                  <span className="hero-ticker-item" key={name}>
                    <i aria-hidden="true" /><b>{name}</b><span>{tags}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
