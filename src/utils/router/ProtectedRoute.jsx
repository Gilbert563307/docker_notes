import React from 'react'
import { useAuthProvider } from '../../context/AuthProvider'
import { Navigate, Outlet } from 'react-router-dom';


/**
 * ProtectedRoute component renders children only if the user is authenticated.
 * If the user is not authenticated, it redirects to the login page.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to render if user is authenticated.
 * @returns {React.ReactNode} Rendered component or navigation redirect.
 */
// eslint-disable-next-line react/prop-types
export default function ProtectedRoute() {
  const { user } = useAuthProvider();

  // Redirect to login if user is not authenticated
  if (user === null || (user && Object.keys(user).length === 0)) {
    return <Navigate to="/auth/login" />;
  }

  // Render children if user is authenticated
  return <Outlet></Outlet>;
}
