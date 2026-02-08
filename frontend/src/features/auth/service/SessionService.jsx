import React from "react";
import { ALERT_TYPES } from "../../../shared/presentation/components/bs5/BS5Alert";
import { CollectionManager } from "../../../firebase_entity_manager/CollectionManager";
import { db } from "../../../database/firebaseConfig";
import { Session } from "../domain/Session";
import { NotificationDto } from "../../notification/application/dto/NotificationDto";

const collectionManager = new CollectionManager("sessions", db);
export default function SessionService() {
  /**
   *
   * @param {number} length
   * @returns {string}
   */
  function generateUniqueToken(length = 64) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }
    return token;
  }

  /**
   *
   * @param {Date} date
   * @param {number} hours
   * @returns
   */
  function addHours(date, hours) {
    const hoursToAdd = hours * 60 * 60 * 1000;
    date.setTime(date.getTime() + hoursToAdd);
    return date;
  }

  /**
   *
   * @returns {Date}
   */
  function createSessionExpireDate() {
    // Create a Date object for the end of the current day
    const currentDate = new Date();
    const endOfDay = addHours(currentDate, 24);
    return endOfDay;
  }

  /**
   *
   * @param {string} hashedUid
   * @param {Object} currentUser // firebase auth.currentUser object
   * @returns {Promise<{created: Boolean, sessionToken: string, notificationDto: NotificationDto}>}
   */
  async function createSession(hashedUid, currentUser) {
    if (!hashedUid || !currentUser) {
      return {
        created: false,
        sessionToken: "",
        notificationDto: new NotificationDto("Invalid user or user uid provided.", ALERT_TYPES.DANGER),
      };
    }

    try {
      const session = await createSessionInstance(currentUser, hashedUid, createSessionExpireDate());
      collectionManager.createDocument(session.toJson());

      return {
        created: true,
        sessionToken: session.getToken(),
        notificationDto: new NotificationDto("Session created successfully.", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        created: false,
        sessionToken: "",
        notificationDto: new NotificationDto(error.message || "An unknown error occurred.", ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   * Generates a unique token that is not already in use for the given user.
   * @param {string} user_uid - The user ID.
   * @returns {Promise<{token: string, notificationDto: NotificationDto}>}
   */
  async function getAvailableSessionToken(user_uid) {
    try {
      let token;
      let isUnique = false;

      do {
        token = generateUniqueToken(); // Generate a new token
        const sessionQuery = [
          collectionManager.whereQuery("user_uid", "==", user_uid),
          collectionManager.whereQuery("token", "==", token), // Directly check if the token exists
        ];

        const documentSnapshots = await collectionManager.getDocumentSnapShotsByQuery(sessionQuery);
        isUnique = documentSnapshots.empty; // Check if the token is unique
      } while (!isUnique); // Repeat if the token already exists

      return {
        token: token,
        notificationDto: new NotificationDto("Token generated successfully.", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        token: "",
        notificationDto: new NotificationDto(
          error.message || "An error occurred while generating the token.",
          ALERT_TYPES.DANGER,
        ),
      };
    }
  }

  /**
   *
   * @param {Object} currentUser
   * @param {string} hashedUid
   * @param {Date} expireDate
   * @returns  {Promise<Session>}
   */
  async function createSessionInstance(currentUser, hashedUid, expireDate) {
    const currentServerTimestamp = collectionManager.getCurrentServerTimestamp();

    const { token } = await getAvailableSessionToken(hashedUid);
    return new Session(
      JSON.stringify(currentUser),
      token,
      collectionManager.getTimestampClass().fromDate(expireDate),
      currentServerTimestamp,
      currentServerTimestamp,
    );
  }

  function checkUserSession() {
    throw new Error("Implement method checkUserSession");
  }
  return { createSession, checkUserSession };
}
