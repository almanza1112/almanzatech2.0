import React, { useEffect, useRef, useState } from "react";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import bgVideo from "../assets/main_vid_bg.mp4";
import heroPoster from "../assets/hero_poster.jpg";
import { track } from "../lib/analytics";
import { prefersReducedMotion } from "../lib/motion";
import { SITE } from "../data/site";

/** Rotates through what AlmanzaTech actually builds, so the hero states the
 *  service range immediately instead of waiting for the next section. */
const ROTATING_WORDS = ["VISION", "WEBSITE", "APP", "PLATFORM", "BRAND"];

const HERO_FACTS = [
  `Est. ${SITE.foundedYear}`,
  SITE.location,
  "In-house team, never outsourced",
];

const Main = () => {
  const videoRef = useRef(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [reduced] = useState(prefersReducedMotion);

  // React can drop the `muted` attribute, which silently blocks autoplay.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true;
  }, []);

  useEffect(() => {
    if (reduced) return undefined;
    const id = window.setInterval(
      () => setWordIndex((i) => (i + 1) % ROTATING_WORDS.length),
      2600
    );
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <section id="top" className="hero">
      {/* Poster paints instantly; the video takes over once it can play.
          Under reduced motion the poster is all that ever loads. */}
      <video
        ref={videoRef}
        className="hero-media"
        src={bgVideo}
        poster={heroPoster}
        autoPlay={!reduced}
        loop
        muted
        playsInline
        preload={reduced ? "none" : "auto"}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="hero-scrim" aria-hidden="true" />
      <div
        className="blueprint-grid blueprint-grid--masked animate-grid-drift absolute inset-0"
        aria-hidden="true"
      />

      <div className="shell relative z-10 px-6 pb-28 pt-32 sm:px-8 md:px-10 md:pb-36 md:pt-36">
        <div className="max-w-4xl">
          <p
            className="eyebrow"
            style={{ animation: reduced ? "none" : "rise-in .6s var(--ease-out) both" }}
          >
            <span>Software studio · {SITE.location}</span>
          </p>

          <h1
            className="hero-title mt-6"
            style={{
              animation: reduced
                ? "none"
                : "rise-in .8s var(--ease-out) .08s both",
            }}
          >
            We build
            <br />
            your{" "}
            {/* key change replays the roll animation on each word swap */}
            <span key={wordIndex} className="word-roll text-glow">
              {ROTATING_WORDS[wordIndex]}
            </span>
            <span className="caret" aria-hidden="true" />
          </h1>

          <p
            className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            style={{
              animation: reduced
                ? "none"
                : "rise-in .8s var(--ease-out) .2s both",
            }}
          >
            Custom websites, mobile apps, and the IT backbone behind them — designed
            and engineered in-house for businesses and entrepreneurs since{" "}
            {SITE.foundedYear}.
          </p>

          <div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
            style={{
              animation: reduced
                ? "none"
                : "rise-in .8s var(--ease-out) .32s both",
            }}
          >
            <a
              href="#contact"
              onClick={() =>
                track("cta_click", {
                  label: "Start a project",
                  location: "hero",
                })
              }
              className="btn btn-primary"
            >
              Start a project
              <FiArrowUpRight aria-hidden="true" size={16} />
            </a>
            <a
              href="#services"
              onClick={() =>
                track("cta_click", {
                  label: "See what we do",
                  location: "hero",
                })
              }
              className="btn btn-ghost"
            >
              See what we do
              <FiArrowDownRight aria-hidden="true" size={16} />
            </a>
          </div>

          <ul
            className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted sm:gap-x-8"
            style={{
              animation: reduced
                ? "none"
                : "rise-in .8s var(--ease-out) .44s both",
            }}
          >
            {HERO_FACTS.map((fact) => (
              <li key={fact} className="flex items-center gap-2.5">
                <span
                  className="h-1 w-1 shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Scroll cue — desktop only; the sticky CTA owns the bottom on mobile */}
      <a
        href="#services"
        aria-label="Scroll to what we do"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-muted">
          Scroll
        </span>
        <span className="scroll-cue-line" aria-hidden="true">
          <span className="scroll-cue-dot" />
        </span>
      </a>
    </section>
  );
};

export default Main;
