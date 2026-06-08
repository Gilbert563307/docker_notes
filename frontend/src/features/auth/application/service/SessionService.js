/**

 * @typedef {import("../../data/SessionRepository").default} SessionRepository
 */

import { where } from "firebase/firestore";
import { ALERT_TYPES } from "../../../../shared/presentation/components/bs5/BS5Alert";
import { NotificationDto } from "../../../notification/application/dto/NotificationDto";
import sessionRepository from "../../data/SessionRepository";
import { Session } from "../../domain/Session";

class SessionService {
  #sessionRepository;

  /**
   *
   * @param {SessionRepository} sessionRepository
   */
  constructor(sessionRepository) {
    this.#sessionRepository = sessionRepository;
  }

  /**
   *
   * @param {string} hashedUid
   * @param {Object} currentUser // firebase auth.currentUser object
   * @returns {Promise<{created: Boolean, sessionToken: string, notificationDto: NotificationDto}>}
   */
  async createSession(hashedUid, currentUser) {
    if (!hashedUid || !currentUser) {
      return {
        created: false,
        sessionToken: "",
        notificationDto: new NotificationDto("Invalid user or user uid provided.", ALERT_TYPES.DANGER),
      };
    }

    try {
      const session = await this.#createSessionInstance(currentUser, hashedUid, this.#createSessionExpireDate());
      this.#sessionRepository.createDocument(session.toJson());

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
   *
   * @param {Object} currentUser
   * @param {string} hashedUid
   * @param {Date} expireDate
   * @returns  {Promise<Session>}
   */
  async #createSessionInstance(currentUser, hashedUid, expireDate) {
    const currentServerTimestamp = this.#sessionRepository.getCurrentServerTimestamp();

    const { token } = await this.#getAvailableSessionToken(hashedUid);
    return new Session(
      JSON.stringify(currentUser),
      token,
      this.#sessionRepository.getTimestampClass().fromDate(expireDate),
      currentServerTimestamp,
      currentServerTimestamp,
    );
  }

  /**
   * Generates a unique token that is not already in use for the given user.
   * @param {string} userUid - The user ID.
   * @returns {Promise<{token: string, notificationDto: NotificationDto}>}
   */
  async #getAvailableSessionToken(userUid) {
    try {
      let token;
      let isUnique = false;

      do {
        token = this.#generateUniqueToken(); // Generate a new token
        const sessionQuery = [
          where("user_uid", "==", userUid),
          where("token", "==", token), // Directly check if the token exists
        ];

        const documentSnapshots = await this.#sessionRepository.getDocumentSnapShotsByQuery(sessionQuery);
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

  #createSessionExpireDate() {
    // Create a Date object for the end of the current day
    const currentDate = new Date();
    const endOfDay = this.#addHours(currentDate, 24);
    return endOfDay;
  }

  /**
   *
   * @param {Date} date
   * @param {number} hours
   * @returns
   */
  #addHours(date, hours) {
    const hoursToAdd = hours * 60 * 60 * 1000;
    date.setTime(date.getTime() + hoursToAdd);
    return date;
  }

  /**
   *
   * @param {number} length
   * @returns {string}
   */
  #generateUniqueToken(length = 64) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }
    return token;
  }
}

const sessionService = new SessionService(sessionRepository);
export default sessionService;
