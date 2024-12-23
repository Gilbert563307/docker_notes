import React from "react";
import { ALERT_ACTIONS } from "../view/components/bs5/BS5Alert";
import DataHandler from "./DataHandler";

export default function SessionLogic() {
  const {
    collectionRef,
    currentServerTimestamp,
    Timestamp,
    addDoc,
    query,
    where,
    getDocs,
  } = DataHandler({
    table: "sessions",
  });

  function generateUniqueToken(length = 64) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }
    return token;
  }

  /**
   *
   * @returns {Date}
   */
  function getSessionExpireDate() {
    // Create a Date object for the end of the current day
    const endOfDay = new Date();
    endOfDay.setHours(24, 0, 0, 0); // Set time to 00:00 of the next day
    return endOfDay;
  }

  /**
   *
   * @param {string} hashedUid
   * @param {import("../types/types").User} currentUser
   * @returns {Promise<{created: Boolean, sessionToken: string, message: string, type: number}>}
   */
  async function createSession(hashedUid, currentUser) {
    if (!hashedUid || !currentUser) {
      return {
        created: false,
        sessionToken: "",
        message: "Invalid user_uid provided.",
        type: ALERT_ACTIONS.DANGER,
      };
    }

    const expireDate = getSessionExpireDate();
    const payload = await createSessionPayload(
      currentUser,
      hashedUid,
      expireDate
    );

    try {
      const created = await addDoc(collectionRef, payload);

      return {
        created: Boolean(created),
        sessionToken: payload.token,
        message: "Session created successfully.",
        type: ALERT_ACTIONS.SUCCESS,
      };
    } catch (error) {
      console.error("Error creating session:", error);

      return {
        created: false,
        sessionToken: "",
        message: error.message || "An unknown error occurred.",
        type: ALERT_ACTIONS.DANGER,
      };
    }
  }

  /**
   * Generates a unique token that is not already in use for the given user.
   * @param {string} user_uid - The user ID.
   * @returns {Promise<{token: string, message: string, type: string}>}
   */
  async function getAvailableSessionToken(user_uid) {
    try {
      let token;
      let isUnique = false;

      do {
        token = generateUniqueToken(); // Generate a new token
        const sessionQuery = query(
          collectionRef,
          where("user_uid", "==", user_uid),
          where("token", "==", token) // Directly check if the token exists
        );

        const documentSnapshots = await getDocs(sessionQuery);
        isUnique = documentSnapshots.empty; // Check if the token is unique
      } while (!isUnique); // Repeat if the token already exists

      return {
        token: token,
        message: "Token generated successfully.",
        type: ALERT_ACTIONS.SUCCESS,
      };
    } catch (error) {
      return {
        token: "",
        message:
          error.message || "An error occurred while generating the token.",
        type: ALERT_ACTIONS.DANGER,
      };
    }
  }

  /**
   *
   * @param {Object} currentUser
   * @param {string} hashedUid
   * @param {Date} expireDate
   * @returns  {Promise<import("../types/types").Session>}
   */
  async function createSessionPayload(currentUser, hashedUid, expireDate) {
    try {
      const { token } = await getAvailableSessionToken(hashedUid);
      return {
        user: JSON.stringify(currentUser),
        token: token,
        expire_date: Timestamp.fromDate(expireDate),
        // @ts-ignore
        created_at: currentServerTimestamp,
        // @ts-ignore
        updated_at: currentServerTimestamp,
      };
    } catch (error) {
      return {
        user_uid: "",
        token: "",
        expire_date: "",
        created_at: "",
        updated_at: "",
      };
    }
  }
  return { createSession };
}
