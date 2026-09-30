import { SITE } from "./site";

export const PRIVACY = {
  title: "Privacy policy",
  effective: "Effective September 30, 2026",
  intro: `This policy explains what information ${SITE.name} collects through almanzatech.com, how we use it and the choices you have. We keep it short because we don't collect much.`,
  back: { label: "← Home", href: "/" },
  sections: [
    {
      heading: "What you send us",
      paragraphs: [
        ["When you use the contact form, we collect your name, your email address, the kind of help you picked (if you picked one) and your message."],
        ["We use this only to reply to you and to talk with you about your project. The form sends your message to a Google Firebase service, which stores it in a private database in the United States and emails it to us."],
      ],
    },
    {
      heading: "What's collected automatically",
      paragraphs: [
        [
          "Analytics. We use Google Analytics, through Google Firebase, to understand how people use the site: which pages and sections are viewed, which buttons and links are clicked, whether the contact form was sent (without your name, email or message), and general details such as your browser, device type, the site that referred you and your approximate location, such as your city. Google Analytics uses cookies to tell visits apart. To learn how Google uses this information, see ",
          {
            label: "How Google uses information from sites or apps that use our services",
            href: "https://policies.google.com/technologies/partner-sites",
          },
          ".",
        ],
        ["Spam protection. The contact form is protected by Google reCAPTCHA through Firebase App Check. To tell people from bots, it looks at information about your browser and device. Google processes this for us only to protect against security threats, fraud and abuse, not for advertising."],
        ["Fonts. The site loads its fonts from Google Fonts, so your browser sends Google a request that includes your IP address."],
        ["Hosting. Our web host, Hostinger, may keep standard server logs, such as IP addresses, browser type and the pages requested."],
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        ["Google Analytics sets cookies named _ga and _ga_ followed by an ID for our site. They last up to two years and are used only for analytics. reCAPTCHA may also store information in your browser to protect the form. We don't use advertising cookies."],
        [
          "You can block or delete cookies in your browser settings, or opt out of Google Analytics on every site with Google's ",
          { label: "opt-out browser add-on", href: "https://tools.google.com/dlpage/gaoptout" },
          ".",
        ],
      ],
    },
    {
      heading: "Who we share it with",
      paragraphs: [
        ["We don't sell your information, and we don't share it for advertising. We share it only with the companies that run the site and the form: Google (Firebase, Google Analytics, reCAPTCHA, Google Fonts and our business email) and Hostinger (hosting). We may also share information if the law requires it."],
      ],
    },
    {
      heading: "Do Not Track and tracking across sites",
      paragraphs: [
        ["Our site doesn't respond differently to a browser's Do Not Track signal. We don't run ads or advertising trackers, and we don't let other companies use our site to track you across other websites for advertising. The Google services listed above receive information when you use our site, as described in this policy."],
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        ["We keep messages from the contact form for as long as we need them to work with you and keep our business records. Google Analytics keeps its detailed data for a limited time set in our account and keeps summary reports longer."],
      ],
    },
    {
      heading: "Your choices",
      paragraphs: [
        [
          "To see, correct or delete what you sent us through the contact form, email ",
          { label: SITE.email, href: `mailto:${SITE.email}` },
          " and we'll take care of it.",
        ],
      ],
    },
    {
      heading: "Children",
      paragraphs: [
        ["This site isn't meant for children under 13, and we don't knowingly collect their information."],
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        ["If we change this policy, we'll post the new version on this page and update the effective date at the top."],
      ],
    },
    {
      heading: "Contact us",
      lines: [
        SITE.name,
        SITE.location,
        { label: SITE.email, href: `mailto:${SITE.email}` },
        { label: SITE.phoneDisplay, href: SITE.phoneHref },
      ],
    },
  ],
};
