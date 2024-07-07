import React, { createContext, useMemo, useState, useContext, useEffect } from 'react';
import DefaultLayout from '../view/layout/DefaultLayout';
import { useAuthProvider } from '../context/AuthProvider';
import GuestLayout from '../view/layout/GuestLayout';
import { auth } from '../database/firebaseConfig';
import { ThemeContext } from '../context/ThemeContext';
import ThemeLogic from '../model/ThemeLogic';

/**
 * Initial state for the MainController.
 * @typedef {Object} MainControllerState
 * @property {string} title - The current title.
 * @property {function(string): void} setTitle - Function to set the title.
 */

/**
 * Initial state for the MainController.
 * @type {MainControllerState}
 */
const initialState = {
  title: "",
  setTitle: () => { },
};

/**
 * Context for managing state and actions within the MainController.
 * @type {React.Context<MainControllerState>}
 */
const MainControllerContext = createContext(initialState);

/**
 * Custom hook to use the MainController context.
 * @returns {MainControllerState} The MainController context state.
 * @throws {Error} Throws an error if used outside of MainController.
 */
export const useMainControllerContext = () => {
  const mainControllerContext = useContext(MainControllerContext);

  if (!mainControllerContext) {
    throw new Error('useMainControllerContext must be used within MainController');
  }

  return mainControllerContext;
};


/**
 * @typedef {{type: number, message: string}} notificationObject
 */

/**
 * MainController component manages the main layout based on user authentication status.
 * Renders either the DefaultLayout if user is authenticated, or the GuestLayout for unauthenticated users.
 * @returns {React.ReactNode} Rendered component based on user authentication.
 */
export default function MainController() {
  const { user } = useAuthProvider();
  const { darkTheme, lightTheme } = ThemeLogic();

  const [title, setTitle] = useState("");


  //TODO REMOVE 
  // useEffect(() => {
  //   // console.log(`MainController: Dev`, auth);
  // }, [auth]); // Log auth on component mount

  const contextValue = useMemo(() => ({ title, setTitle }), [title, setTitle]);

  return (
    <MainControllerContext.Provider value={contextValue}>
      {user != null && Object.keys(user).length > 0 ? (
        <ThemeContext.Provider value={{ darkTheme, lightTheme }}>
          <DefaultLayout />
        </ThemeContext.Provider>
      ) : (
        <GuestLayout />
      )}
    </MainControllerContext.Provider>
  );
}
