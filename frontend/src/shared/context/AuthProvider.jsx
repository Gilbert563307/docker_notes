import React, { createContext, useContext, useMemo, useState } from "react";
import { UserDto } from "../../features/auth/application/dto/UserDto";
import authService from "../../features/auth/application/service/AuthService";
import { UseCookieStorage } from "../helpers/useCookieStorage";


/**
 * Context for managing user authentication state and actions.
 * @typedef {Object} AuthContextType
 * @property {UserDto} user - The authenticated user object.
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
  user: new UserDto(null, null, null, null, null),
  login: () => {},
  logout: () => {},
});

export const AUTH_STORAGE_KEYS = {
  USER: "USER",
};

/**
 * Custom hook to access authentication context and functions.
 * @returns {AuthContextType} Authentication context value.
 */
export const useAuthProvider = () => {
  const authContext = useContext(AuthProviderContext);

  if (!authContext) {
    throw new Error("useAuthProvider must be used within an AuthProvider");
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
  /**
   *
   * @returns {UserDto | null}
   */
  const getUserFromCookie = () => {
    try {
      const cookieData = UseCookieStorage.readCookie(AUTH_STORAGE_KEYS.USER);

      const userDto = cookieData ? JSON.parse(cookieData) : null;
      if (userDto === null) return null;
      return new UserDto(userDto.uid, userDto.displayName, userDto.email, userDto.photoURL, userDto.token);
    } catch (error) {
      console.error("Failed to parse user data:", error);
      return null;
    }
  };

  const [user, setUser] = useState(getUserFromCookie());

  /**
   * Simulates user login action.
   * In a real implementation, this function would handle authentication logic.
   * @param {UserDto} userDto
   */
  const login = (userDto) => {
    //save the state token so that we can later check for it;
    UseCookieStorage.createCookie(AUTH_STORAGE_KEYS.USER, JSON.stringify(userDto.toJson()), 1, "/");
    setUser(userDto);
  };

  /**
   * Simulates user logout action.
   * In a real implementation, this function would handle logout logic.
   */
  const logout = () => {
    UseCookieStorage.deleteCookie(AUTH_STORAGE_KEYS.USER);
    setUser(null); // Clear authenticated user
    authService.signUserOut(); // Sign user out of firebase
    localStorage.clear(); //Clear all localstorage items stored
    sessionStorage.clear(); //Clear all sessionstorage items stored
  };

  /**
   * Memoized context value to optimize performance.
   */
  const contextValue = useMemo(() => {
    return { user, login, logout };
  }, [user]);

  return <AuthProviderContext.Provider value={contextValue}>{children}</AuthProviderContext.Provider>;
}
