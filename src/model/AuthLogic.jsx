import React from 'react'
import { ALERT_TYPES } from '../view/components/alerts/BS5Alert';
import { auth, googleProvider } from '../database/firebaseConfig';
import {
    signInWithPopup,
    signOut,
} from "firebase/auth";

export default function AuthLogic() {


    /**
     * Logs in a user using Google OAuth sign-in.
     * @returns {Promise<{ login: boolean, user: Object, type: string, message: string }>}
     * A Promise that resolves with an object representing the login result:
     * - `login`: A boolean indicating if the login was successful.
     * - `user`: An object containing user details if logged in successfully (uid, displayName, email, token).
     * - `type`: A string representing the type of alert (SUCCESS for successful login, DANGER for error).
     * - `message`: A message describing the result of the login attempt.
     */
    const LoginWithGoogle = async () => {
        try {
            const response = await signInWithPopup(auth, googleProvider);

            if (response && auth.currentUser) {
                return {
                    login: true,
                    user: {
                        uid: auth.currentUser.uid,
                        displayName: auth.currentUser.displayName || "",
                        email: auth.currentUser.email || "",
                        token: auth.currentUser.refreshToken || "",
                    },
                    type: ALERT_TYPES.SUCCESS,
                    message: "",
                };
            }
            return {
                user: {},
                login: false,
                type: ALERT_TYPES.DANGER,
                message: 'Failed to login with Google',
            };
        } catch (error) {
            return {
                user: {},
                login: false,
                type: ALERT_TYPES.DANGER,
                message: error.message || 'Failed to login with Google',
            };
        }
    }
    return { LoginWithGoogle }
}
