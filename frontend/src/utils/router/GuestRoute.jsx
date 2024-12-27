import React from "react";
import { Navigate } from "react-router-dom";
import { LANDING_PAGE_ROUTE } from "../../config";
import useAuthHelpers from "../../helpers/useAuthHelpers";
import { AUTH_STORAGE_KEYS } from "../../context/AuthProvider";

export default function GuestRoute({ children }) {
  const { getCookie } = useAuthHelpers();

  // Redirect to baord if user authenticated
  const user = getCookie(AUTH_STORAGE_KEYS.USER);
  if (user !== null || (user && Object.keys(user).length > 0)) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  // Render children if user is authenticated
  return <>{children}</>;
}
