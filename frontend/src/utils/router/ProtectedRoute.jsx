import React from "react";
import useAuthHelpers from "../../shared/helpers/useAuthHelpers";
import { AUTH_STORAGE_KEYS } from "../../shared/context/AuthProvider";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute component renders children only if the user is authenticated.
 * If the user is not authenticated, it redirects to the login page.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to render if user is authenticated.
 * @returns {React.ReactNode} Rendered component or navigation redirect.
 */
// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ children }) {
  const { getCookie, parseJson } = useAuthHelpers();

  const rawUser = getCookie(AUTH_STORAGE_KEYS.USER);
  const userObject = parseJson(rawUser);

  if (userObject === null || Object.keys(userObject).length === 0) {
    return <Navigate to="/auth/verify" replace />;
  }

  return <>{children}</>;
}
