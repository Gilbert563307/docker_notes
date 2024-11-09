import React, { useEffect } from 'react';
import useLocalStorageHook from '../hooks/useLocalStorageHook';
import { THEME_MODES } from '../context/ThemeContext';
import { SESSION_THEME_MODE } from '../config';

/**
 * Manages theme logic including reading and setting the theme mode.
 * @returns {{darkTheme: Function, lightTheme: Function}} Functions to set the dark and light themes.
 */
export default function ThemeLogic() {
    const { readValue, storeValue } = useLocalStorageHook();

    // Read the current theme mode from local storage.
    const themeMode = readValue(SESSION_THEME_MODE);

    /**
     * Removes existing theme classes ('light', 'dark') from the <html> element.
     */
    function removeExistingThemeClasses() {
        const htmlElement = document.querySelector('html');
        if (htmlElement === null) return;
        htmlElement.classList.remove('light', 'dark');
        htmlElement.removeAttribute('data-bs-theme');
    }

    /**
     * Sets the theme mode on the <html> element and stores it in local storage.
     * @param {string} mode - The theme mode to set ('light' or 'dark').
     */
    function setTheModeToHtml(mode) {
        const htmlElement = document.querySelector('html');
        if (htmlElement === null) return;
        htmlElement.classList.add(mode);
        if (mode === THEME_MODES.DARK) {
            htmlElement.setAttribute('data-bs-theme', 'dark');
        } else {
            htmlElement.removeAttribute('data-bs-theme');
        }
        storeValue(SESSION_THEME_MODE, mode);
    }

    /**
     * Sets the theme to dark mode.
     */
    const darkTheme = () => {
        const mode = THEME_MODES.DARK;
        removeExistingThemeClasses();
        setTheModeToHtml(mode);
    };

    /**
     * Sets the theme to light mode.
     */
    const lightTheme = () => {
        const mode = THEME_MODES.LIGHT;
        removeExistingThemeClasses();
        setTheModeToHtml(mode);
    };

    useEffect(() => {
        if (themeMode === null) return;
        removeExistingThemeClasses();
        setTheModeToHtml(themeMode);
    }, [themeMode]);

    return { darkTheme, lightTheme };
}
