import { useEffect } from "react";
import { SESSION_THEME_MODE } from "../../../config";
import { THEME_MODES } from "../../context/ThemeContext";

/**
 * Manages theme logic including reading and setting the theme mode.
 * @returns {{darkTheme: Function, lightTheme: Function}} Functions to set the dark and light themes.
 */
export default function ThemeService() {

  /**
   * Removes existing theme classes ('light', 'dark') from the <html> element.
   */
  function removeExistingThemeClasses() {
    const htmlElement = document.querySelector("html");
    if (htmlElement === null) return;
    htmlElement.classList.remove("light", "dark");
    htmlElement.removeAttribute("data-bs-theme");
  }

  /**
   * Sets the theme mode on the <html> element and stores it in local storage.
   * @param {string} mode - The theme mode to set ('light' or 'dark').
   */
  function setTheModeToHtml(mode) {
    const htmlElement = document.querySelector("html");
    if (htmlElement === null) return;
    htmlElement.classList.add(mode);
    if (mode === THEME_MODES.DARK) {
      htmlElement.setAttribute("data-bs-theme", "dark");
    } else {
      htmlElement.removeAttribute("data-bs-theme");
    }
    localStorage.setItem(SESSION_THEME_MODE, mode);
  }

  /**
   * Sets the theme to dark mode.
   */
  function darkTheme() {
    const mode = THEME_MODES.DARK;
    removeExistingThemeClasses();
    setTheModeToHtml(mode);
  }

  /**
   * Sets the theme to light mode.
   */
  function lightTheme() {
    const mode = THEME_MODES.LIGHT;
    removeExistingThemeClasses();
    setTheModeToHtml(mode);
  }
  return { darkTheme, lightTheme };
}
