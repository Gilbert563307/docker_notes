import React from "react";
import { Navigate } from "react-router-dom";
import useAuthHelpers from "../../helpers/useAuthHelpers";
import { AUTH_STORAGE_KEYS } from "../../context/AuthProvider";

/**
 * ProtectedRoute component renders children only if the user is authenticated.
 * If the user is not authenticated, it redirects to the login page.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to render if user is authenticated.
 * @returns {React.ReactNode} Rendered component or navigation redirect.
 */
// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ children }) {
  const { getCookie } = useAuthHelpers();

  // Redirect to login if user is not authenticated
  const user = getCookie(AUTH_STORAGE_KEYS.USER);
  if (user === null || (user && Object.keys(user).length === 0)) {
    return <Navigate to="/auth/verify" />;
  }

  // Render children if user is authenticated
  return <>{children}</>;
}
