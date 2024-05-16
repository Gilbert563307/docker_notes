import React from 'react';
import DefaultLayout from '../view/layout/DefaultLayout';
import { useAuthProvider } from '../context/AuthProvider';
import GuestLayout from '../view/layout/GuestLayout';


/**
 * @typedef {{type: number, message: string}} notificationObject
 */

/**
 * MainController component manages the main layout based on user authentication status.
 * Renders either the DefaultLayout if user is authenticated, or the Outlet for unauthenticated users.
 * @returns {React.ReactNode} Rendered component based on user authentication.
 */
export default function MainController() {
  const { user } = useAuthProvider();
  return (
    <>
      {user != null && Object.keys(user).length > 0 ? (
        <DefaultLayout />
      ) : (
        <GuestLayout />
      )}
    </>
  );
}


