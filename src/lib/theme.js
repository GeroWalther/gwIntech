// Routes that render their own dark ground. The shared chrome — nav bar,
// footer and the app shell background — flips to match so there is no light
// seam above the page.
export const DARK_ROUTES = [
  "/",
  "/projects",
  "/about",
  "/solutions",
  "/ai-box",
  "/skribble",
  "/gridly",
];

export const isDarkRoute = (pathname) => DARK_ROUTES.includes(pathname);
