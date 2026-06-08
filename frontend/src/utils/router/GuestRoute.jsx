import React from "react";
import { Navigate } from "react-router-dom";
import { LANDING_PAGE_ROUTE } from "../../config";
import useAuthHelpers from "../../shared/helpers/useAuthHelpers";
import { AUTH_STORAGE_KEYS } from "../../shared/context/AuthProvider";

export default function GuestRoute({ children }) {
  const { getCookie, parseJson } = useAuthHelpers();

  const rawUser = getCookie(AUTH_STORAGE_KEYS.USER);
  const userObject = parseJson(rawUser);

  // Redirect if user is authenticated (not null and not empty)
  if (userObject !== null && Object.keys(userObject).length > 0) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  // Allow guest to view the route
  return <>{children}</>;
}
