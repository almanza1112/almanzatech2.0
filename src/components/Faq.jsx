import React from "react";
import { FAQ_ITEMS, PAGE_COPY } from "../data/work";

const Faq = () => (
  <section id="faq" className="faq-section" aria-labelledby="faq-title">
    <div className="wrap faq-grid">
      <div className="faq-head">
        <h2 id="faq-title">{PAGE_COPY.faq.heading}</h2>
      </div>
      <dl className="faq-list">
        {FAQ_ITEMS.map((item) => (
          <div className="faq-item" key={item.question}>
            <dt>{item.question}</dt>
            <dd>
              {item.answer.map((part, index) => typeof part === "string" ? part : (
                <a className="text-link" href={part.href} key={index}>
                  {part.label}
                </a>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);

export default Faq;
