import React from 'react'
import { useAuthProvider } from '../../context/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

export default function GuestRoute({ children }) {
  const { user } = useAuthProvider();

  // Redirect to notews if user authenticated
  if (user !== null || (user && Object.keys(user).length > 0)) {
    return <Navigate to="/notes" />;
  }

  // Render children if user is authenticated
  return <>{children}</>;
}
