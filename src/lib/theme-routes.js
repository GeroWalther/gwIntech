// Route rules for theming, kept free of React so the no-flash script in
// _document can import the very same lists. They used to be duplicated as a
// string literal in that script, which is precisely the kind of pair that
// drifts the moment a route is added.

export const STORAGE_KEY = "gw-theme";
export const DEFAULT_THEME = "light";

// Pages that honour the visitor's choice.
export const THEMEABLE_ROUTES = [
  "/",
  "/projects",
  "/about",
  "/solutions",
];

// Pages authored as fixed dark artefacts. The product pages ("webspecials")
// are designed around a dark ground — their gradients, glows and the Skribble
// canvas demo only work there — so they ignore the preference entirely.
export const ALWAYS_DARK_ROUTES = ["/ai-box", "/skribble", "/gridly"];

export const isThemeable = (pathname) => THEMEABLE_ROUTES.includes(pathname);

export const resolveTheme = (pathname, preference) => {
  if (isThemeable(pathname)) return preference === "dark" ? "dark" : "light";
  return ALWAYS_DARK_ROUTES.includes(pathname) ? "dark" : "light";
};
