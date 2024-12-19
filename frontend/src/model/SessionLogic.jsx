import React from "react";
import { ALERT_ACTIONS } from "../view/components/bs5/BS5Alert";
import DataHandler from "./DataHandler";

export default function SessionLogic() {
  const { collectionRef, currentServerTimestamp, Timestamp, addDoc } =
    DataHandler({
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
   * @param {string} user_uid
   * @returns {Promise<{created: Boolean, sessionToken: string, message: string, type: number}>}
   */
  async function createSession(user_uid) {
    if (!user_uid) {
      return {
        created: false,
        sessionToken: "",
        message: "Invalid user_uid provided.",
        type: ALERT_ACTIONS.DANGER,
      };
    }

    const expireDate = getSessionExpireDate();
    const payload = createSessionPayload(user_uid, expireDate);

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
   *
   * @param {string} user_uid
   * @param {Date} expireDate
   * @returns  {import("../types/types").Session}
   */
  function createSessionPayload(user_uid, expireDate) {
    return {
      user_uid: user_uid,
      token: generateUniqueToken(),
      expire_date: Timestamp.fromDate(expireDate),
      created_at: currentServerTimestamp,
      updated_at: currentServerTimestamp,
    };
  }
  return { createSession };
}
