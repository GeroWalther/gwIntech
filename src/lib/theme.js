import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";

export const STORAGE_KEY = "gw-theme";
export const DEFAULT_THEME = "light";

// Pages that honour the visitor's choice. Add a route here and it gains the
// toggle; nothing else has to change.
export const THEMEABLE_ROUTES = ["/"];

// Pages authored as fixed dark artefacts. The product pages ("webspecials")
// are designed around a dark ground — their gradients, glows and the canvas
// demo only work there — so they ignore the preference entirely.
export const ALWAYS_DARK_ROUTES = [
  "/projects",
  "/about",
  "/solutions",
  "/ai-box",
  "/skribble",
  "/gridly",
];

export const isThemeable = (pathname) => THEMEABLE_ROUTES.includes(pathname);

export const resolveTheme = (pathname, preference) => {
  if (isThemeable(pathname)) return preference === "dark" ? "dark" : "light";
  return ALWAYS_DARK_ROUTES.includes(pathname) ? "dark" : "light";
};

// Kept for callers that only need to know whether the ground is dark and do
// not have the visitor's preference to hand.
export const isDarkRoute = (pathname) =>
  resolveTheme(pathname, DEFAULT_THEME) === "dark";

const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  preference: DEFAULT_THEME,
  themeable: false,
  mounted: false,
  toggle: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const router = useRouter();
  const [preference, setPreference] = useState(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  // The server cannot know the stored preference, so the first render is always
  // the default and the saved value is adopted right after mount. The inline
  // script in _document has already painted the right theme by then, so this
  // only re-syncs React's copy — it is not what the visitor sees.
  useEffect(() => {
    setMounted(true);
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "dark" || saved === "light") setPreference(saved);
    } catch {
      // Private mode or storage disabled. The default is fine.
    }
  }, []);

  const themeable = isThemeable(router.pathname);
  const theme = resolveTheme(router.pathname, preference);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    // Tells the browser which form controls and scrollbars to draw.
    root.style.colorScheme = theme;
  }, [theme]);

  const toggle = useCallback(() => {
    setPreference((current) => {
      const next = current === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Failing to remember it is no reason to refuse the switch.
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, preference, themeable, mounted, toggle }),
    [theme, preference, themeable, mounted, toggle]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
