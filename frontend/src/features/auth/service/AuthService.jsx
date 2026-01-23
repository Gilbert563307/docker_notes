import React from "react";
import { ALERT_TYPES } from "../../../shared/components/bs5/BS5Alert";
import { auth, googleProvider, githubProvider } from "../../../database/firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
import { SHA256 } from "crypto-js";
import SessionService from "./SessionService";
import { NotificationDto } from "../../notification/application/dto/NotificationDto";
import { UserDto } from "../application/dto/UserDto";
import { User } from "../domain/User";
import { UserMapper } from "../application/mapper/UserMapper";

const initialStateUser = new UserDto(null, null, null, null, null);
export default function AuthService() {
  const { createSession } = SessionService();

  /**
   *
   * @param {*} response
   * @returns {Promise<{ login: boolean, user: UserDto, notificationDto: NotificationDto }>}
   */
  async function handleSignInResponse(response) {
    try {   
      if (!response && !auth)
        return {
          user: initialStateUser,
          login: false,
          notificationDto: new NotificationDto("Something went wrong while trying to sign you in", ALERT_TYPES.DANGER),
        };

      const hashedUid = SHA256(auth.currentUser.uid).toString();
      const sessionResponse = await createSession(hashedUid, auth.currentUser);

      if (!sessionResponse.created) {
        return {
          ...sessionResponse,
          login: false,
          user: initialStateUser,
          notificationDto: new NotificationDto("Something went wrong while trying to sign you in", ALERT_TYPES.DANGER),
        };
      }

      //if user is logged in create a session token
      const user = new User(hashedUid, auth.currentUser.displayName || "",  auth.currentUser.email || "", auth.currentUser.photoURL || "", sessionResponse.sessionToken)
      return {
        login: true,
        user: UserMapper.toDto(user),
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        user: initialStateUser,
        login: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   * Logs in a user using Google OAuth sign-in.
   * @returns {Promise<{ login: boolean, user: UserDto, notificationDto: NotificationDto }>}
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
        user: initialStateUser,
        login: false,
        notificationDto: new NotificationDto(error.message || "Failed to login with Google", ALERT_TYPES.DANGER),
      };
    }
  }

  async function LoginWithGithub() {
    try {
      const response = await signInWithPopup(auth, githubProvider);
      return await handleSignInResponse(response);
    } catch (error) {
      return {
        user: initialStateUser,
        login: false,
        notificationDto: new NotificationDto(error.message || "Failed to login with Github", ALERT_TYPES.DANGER),
      };
    }
  }

  const SignUserOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      return {
        notificationDto: new NotificationDto(error.message || "Failed to sign out ", ALERT_TYPES.DANGER),
      };
    }
  };
  return { LoginWithGoogle, SignUserOut, LoginWithGithub };
}
