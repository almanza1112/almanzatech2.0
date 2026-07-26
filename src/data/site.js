/** Single source of truth for details that appear in several places. */

export const SITE = {
  name: "AlmanzaTech LLC",
  shortName: "AlmanzaTech",
  url: "https://almanzatech.com/",
  foundedYear: 2019,
  location: "Northern New Jersey",
  email: "info@almanzatech.com",
  phoneDisplay: "(201) 467-1007",
  phoneHref: "tel:+12014671007",
  hours: [
    { days: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
    { days: "Saturday", time: "10:00 AM – 1:00 PM" },
  ],
};

export const yearsInBusiness = () =>
  Math.max(1, new Date().getFullYear() - SITE.foundedYear);

export const NAV_LINKS = [
  { id: "services", label: "What We Do" },
  { id: "process", label: "How We Work" },
  { id: "about", label: "Who We Are" },
  { id: "contact", label: "Contact" },
];

/** Ids the navbar watches for active-link highlighting. Kept module-level so
 *  the observer effect isn't torn down on every render. */
export const NAV_IDS = NAV_LINKS.map((link) => link.id);
