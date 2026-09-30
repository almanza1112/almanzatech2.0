import React, { useEffect } from "react";
import { PRIVACY } from "../data/privacy";
import { SITE } from "../data/site";

const PrivacyText = ({ parts }) => parts.map((part, index) => (
  typeof part === "string" ? part : (
    <a href={part.href} key={index}>{part.label}</a>
  )
));

const PrivacyPage = () => {
  useEffect(() => {
    document.title = `${PRIVACY.title} · ${SITE.shortName}`;
  }, []);

  return (
    <article className="privacy-page" aria-labelledby="privacy-title">
      <div className="wrap">
        <a className="text-link" href={PRIVACY.back.href}>{PRIVACY.back.label}</a>
        <h1 id="privacy-title">{PRIVACY.title}</h1>
        <p className="privacy-effective">{PRIVACY.effective}</p>
        <p className="privacy-intro">{PRIVACY.intro}</p>
        {PRIVACY.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((parts, index) => (
              <p className="privacy-copy" key={index}>
                <PrivacyText parts={parts} />
              </p>
            ))}
            {section.lines && (
              <address className="privacy-copy">
                {section.lines.map((line, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <br />}
                    <PrivacyText parts={[line]} />
                  </React.Fragment>
                ))}
              </address>
            )}
          </section>
        ))}
      </div>
    </article>
  );
};

export default PrivacyPage;
