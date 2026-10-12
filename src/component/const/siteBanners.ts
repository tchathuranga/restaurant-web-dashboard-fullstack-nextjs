// Pages whose banner can be changed. Keys must match the `page` prop of ManagedBanner on the website.
export const BANNER_PAGES = [
  { key: "home", label: "Home", hint: "Slider: add several images and they rotate every 5 seconds" },
  { key: "our-story", label: "Our Story", hint: "Single banner image" },
  { key: "food-menu", label: "Food Menu", hint: "Single banner image" },
  { key: "outdoor-catering", label: "Outdoor Catering", hint: "Single banner image" },
  { key: "news-feed", label: "News Feed", hint: "Single banner image" },
  { key: "join-the-team", label: "Join the Team", hint: "Also used on each job page" },
  { key: "contact-us", label: "Contact Us", hint: "Single banner image" },
];

export const BANNER_PAGE_KEYS = BANNER_PAGES.map((page) => page.key);
