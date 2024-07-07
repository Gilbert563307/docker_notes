import React, { createContext, useContext  } from 'react';

/**
 * @typedef {Object} InitialState
 * @property {string} themeMode - The current theme mode, either 'LIGHT' or 'DARK'.
 * @property {Function} darkTheme - Function to set the theme mode to dark.
 * @property {Function} lightTheme - Function to set the theme mode to light.
 */

/**
 * @typedef {Object} DARK
 * @property {string} LIGHT -
 * @property {string} DARK -
 */
export const THEME_MODES = {
    LIGHT: "light",
    DARK: "dark",
  };
  

/**
 * Initial state for the ThemeContext.
 * @type {InitialState}
 */
export const initialState = {
    themeMode: THEME_MODES.LIGHT,
    darkTheme: () => {},
    lightTheme: () => {},
};

/**
 * Context for managing theme state and actions.
 * @type {React.Context<InitialState>}
 */
export const ThemeContext = createContext(initialState);

/**
 * Custom hook to access the ThemeContext.
 * @returns {InitialState} Theme context value.
 */
export const useThemeContext = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeContextProvider');
    }

    return context;
};
