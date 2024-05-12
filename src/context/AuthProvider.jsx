import React, { createContext, useContext, useMemo, useState } from 'react';

/**
 * Context for managing user authentication state and actions.
 * @typedef {Object} AuthContextType
 * @property {Object} user - The authenticated user object.
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


/**
 * Custom hook to access authentication context and functions.
 * @returns {Object} Authentication context value.
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
  const [user, setUser] = useState(null);

  /**
   * Simulates user login action.
   * In a real implementation, this function would handle authentication logic.
   */
  const login = () => {
    setUser({ username: 'exampleUser' }); // Example: Set authenticated user
  };

  /**
   * Simulates user logout action.
   * In a real implementation, this function would handle logout logic.
   */
  const logout = () => {
    setUser(null); // Example: Clear authenticated user
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
