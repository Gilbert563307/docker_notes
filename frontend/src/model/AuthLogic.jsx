import React from "react";
import { ALERT_TYPES } from "../view/components/bs5/BS5Alert";
import {
  auth,
  googleProvider,
  githubProvider,
} from "../database/firebaseConfig";
import { signInWithPopup, signOut, GithubAuthProvider } from "firebase/auth";
import { SHA256 } from "crypto-js";
import SessionLogic from "./SessionLogic";

export default function AuthLogic() {
  const { createSession } = SessionLogic();

  /**
   *
   * @param {*} response
   * @returns {Promise<{ login: boolean, user: Object, type: number, message: string }>}
   */
  async function handleSignInResponse(response) {
    try {
      if (!response && !auth)
        return {
          user: {},
          login: false,
          type: ALERT_TYPES.SUCCESS,
          message: "Failed to login with Google",
        };

      const hashedUid = SHA256(auth.currentUser.uid).toString();
      const sessionResponse = await createSession(hashedUid, auth.currentUser);

      if (!sessionResponse.created) {
        return {
          ...sessionResponse,
          login: false,
          user: {},
        };
      }

      //if user is logged in create a session token
      return {
        login: true,
        user: {
          uid: hashedUid,
          displayName: auth.currentUser.displayName || "",
          email: auth.currentUser.email || "",
          photoURL: auth.currentUser.photoURL || "",
          token: sessionResponse.sessionToken,
        },
        type: ALERT_TYPES.SUCCESS,
        message: "",
      };
    } catch (error) {
      return {
        user: {},
        login: false,
        type: ALERT_TYPES.DANGER,
        message: error.message,
      };
    }
  }

  /**
   * Logs in a user using Google OAuth sign-in.
   * @returns {Promise<{ login: boolean, user: Object, type: number, message: string }>}
   * A Promise that resolves with an object representing the login result:
   * - `login`: A boolean indicating if the login was successful.
   * - `user`: An object containing user details if logged in successfully (uid, displayName, email, token).
   * - `type`: A string representing the type of alert (SUCCESS for successful login, DANGER for error).
   * - `message`: A message describing the result of the login attempt.
   */
  async function LoginWithGoogle() {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      return await handleSignInResponse(response);
    } catch (error) {
      return {
        user: {},
        login: false,
        type: ALERT_TYPES.DANGER,
        message: error.message || "Failed to login with Google",
      };
    }
  }

  async function LoginWithGithub() {
    try {
      const response = await signInWithPopup(auth, githubProvider);
      return await handleSignInResponse(response);
    } catch (error) {
        return {
          user: {},
          login: false,
          type: ALERT_TYPES.DANGER,
          message: error.message || "Failed to login with Github",
        };
    }
  }

  const SignUserOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
      return {
        type: ALERT_TYPES.DANGER,
        message: error.message || "Failed to sign out ",
      };
    }
  };
  return { LoginWithGoogle, SignUserOut, LoginWithGithub };
}
