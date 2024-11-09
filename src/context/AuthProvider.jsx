import React, { createContext, useContext, useMemo, useState } from 'react';
import AuthLogic from '../model/AuthLogic';
import useCookieStorageHook from '../hooks/useCookieStorageHook';

/**
 * Context for managing user authentication state and actions.
 * @typedef {Object} AuthContextType
 * @property {import("../types/types").User | {}} user - The authenticated user object.
 * @property {Function} login - Function to perform user login.
 * @property {Function} logout - Function to perform user logout.
 */

/**
 * Context to provide authentication state and actions to its children.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to wrap with the AuthProvider.
 * @returns {React.Context<AuthContextType>} AuthProviderContext - Context provider for authentication.
 */
const AuthProviderContext = createContext({
  user: {},
  login: () => { },
  logout: () => { },
});


export const AUTH_STORAGE_KEYS = {
  USER: "USER",
}

/**
 * Custom hook to access authentication context and functions.
 * @returns {AuthContextType} Authentication context value.
 */
export const useAuthProvider = () => {
  const authContext = useContext(AuthProviderContext);

  if (!authContext) {
    throw new Error('useAuthProvider must be used within an AuthProvider');
  }

  return authContext;
};

/**
 * AuthProvider component manages user authentication state.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to wrap with the AuthProvider.
 * @returns {React.ReactNode} JSX element wrapping child components with authentication context.
 */
// eslint-disable-next-line react/prop-types
export default function AuthProvider({ children }) {
  const { SignUserOut } = AuthLogic();

  const { createCookie, readCookie, deleteCookie } = useCookieStorageHook();
  const getUserFromCookie = () => {
    try {
      const cookieData = readCookie(AUTH_STORAGE_KEYS.USER);
      return cookieData ? JSON.parse(cookieData) : null;
    } catch (error) {
      console.error("Failed to parse user data:", error);
      return null;
    }
  }

  const [user, setUser] = useState(getUserFromCookie());

  /**
   * Simulates user login action.
   * In a real implementation, this function would handle authentication logic.
   * @param {import("../types/types").User} userObject 
   */
  const login = (userObject) => {
    //save the state token so that we can later check for it;
    createCookie(AUTH_STORAGE_KEYS.USER, JSON.stringify(userObject), 1, "/");
    setUser(userObject);
  };

  /**
   * Simulates user logout action.
   * In a real implementation, this function would handle logout logic.
   */
  const logout = () => {
    deleteCookie(AUTH_STORAGE_KEYS.USER)
    setUser(null); // Clear authenticated user
    SignUserOut(); // Sign user out of firebase
  };

  /**
   * Memoized context value to optimize performance.
   */
  const contextValue = useMemo(() => {
    return { user, login, logout };
  }, [user]);

  return (
    <AuthProviderContext.Provider value={contextValue}>
      {children}
    </AuthProviderContext.Provider>
  );
}
