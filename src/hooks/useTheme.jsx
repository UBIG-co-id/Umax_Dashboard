import { useEffect, useState } from "react";
import themesData from "../Theme/themes.json";


export default function useTheme() {
  const [themes, setThemes] = useState(themesData);

  useEffect(() => {
    const loadedThemeTitle =
      localStorage.getItem("theme") || themes[0].title;
    if (loadedThemeTitle) {
      const iteratedThemes = themes.map((theme) => {
        if (loadedThemeTitle === theme.title) {
          return {
            ...theme,
            checked: true,
          };
        } else {
          return {
            ...theme,
            checked: false,
          };
        }
      });
      setThemes(iteratedThemes);
    } else {
      // load theme from state
      setThemes((allThemes) => {
        return allThemes.map((theme, index) =>
          index === 0 ? { ...theme, checked: true } : theme
        );
      });
    }
    localStorage.setItem("theme", loadedThemeTitle);
  }, []);

  useEffect(() => {
    // save current theme to localStorage
    const selectedTheme =
      themes.filter((item) => item.checked)[0]?.title ||
      localStorage.getItem("theme");
    document
      .querySelector("html")
      ?.setAttribute("data-theme", selectedTheme || "");
  }, [themes]);

  return { themes, setThemes };
}
