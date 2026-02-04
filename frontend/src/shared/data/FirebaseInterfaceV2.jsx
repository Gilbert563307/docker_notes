import React from "react";
import { useAuthProvider } from "../context/AuthProvider";

export default function FirebaseInterfaceV2() {
  const { user } = useAuthProvider();
  const userUid = user ? user.getUid() : null;
  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
  const X_TOKEN = user ? user.getToken() : null;

  return { user, userUid, BACKEND_URL, X_TOKEN };
}
