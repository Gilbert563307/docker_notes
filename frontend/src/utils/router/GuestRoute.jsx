import React from 'react'
import { useAuthProvider } from '../../context/AuthProvider';
import { Navigate } from 'react-router-dom';
import { LANDING_PAGE_ROUTE } from '../../config';

export default function GuestRoute({ children }) {
  const { user } = useAuthProvider();

  // Redirect to baord if user authenticated
  if (user !== null || (user && Object.keys(user).length > 0)) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  // Render children if user is authenticated
  return <>{children}</>;
}
