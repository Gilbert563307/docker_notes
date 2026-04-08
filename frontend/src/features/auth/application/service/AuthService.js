import { NotificationDto } from "../../../notification/application/dto/NotificationDto";
import { auth, googleProvider, githubProvider } from "../../../../database/firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
import { User } from "../../domain/User";
import { UserMapper } from "../mapper/UserMapper";
import { AuditDto } from "../../../audit/domain/dto/AuditDto";
import { ALERT_TYPES } from "../../../../shared/presentation/components/bs5/BS5Alert";
import auditRepository from "../../data/AuditRepository";
import sessionService from "./SessionService";

/**
 * @typedef {import("../../application/service/SessionService").default} SessionService
 * @typedef {import("../../data/AuditRepository").default} AuditRepository
 */

class AuthService {
  #sessionService;
  #auditRepository;


  /**
   *
   * @param {SessionService} sessionService
   * @param {AuditRepository} auditRepository
   */
  constructor(sessionService, auditRepository) {
    this.#sessionService = sessionService;
    this.#auditRepository = auditRepository;
  }

  /**
   *
   * @param {*} response
   * @returns {Promise<{ login: boolean, user: UserDto, notificationDto: NotificationDto }>}
   */
  async #handleSignInResponse(response) {
    try {
      if (!response && !auth)
        return {
          user: null,
          login: false,
          notificationDto: new NotificationDto("Something went wrong while trying to sign you in", ALERT_TYPES.DANGER),
        };

      const hashedUid = auth.currentUser.uid;
      const sessionResponse = await this.#sessionService.createSession(hashedUid, auth.currentUser);

      if (!sessionResponse.created) {
        return {
          ...sessionResponse,
          login: false,
          user: null,
          notificationDto: new NotificationDto("Something went wrong while trying to sign you in", ALERT_TYPES.DANGER),
        };
      }

      //if user is logged in create a session token
      const user = new User(
        hashedUid,
        auth.currentUser.displayName || "",
        auth.currentUser.email || "",
        auth.currentUser.photoURL || "",
        sessionResponse.sessionToken,
      );
      return {
        login: true,
        user: UserMapper.toDto(user),
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      //audit the error
      this.#auditRepository.createDocument(
        new AuditDto(
          null,
          "AuthService",
          error.message,
          this.#auditRepository.getCurrentServerTimestamp(),
          this.#auditRepository.getCurrentServerTimestamp(),
        ).toJsonWithoutId(),
      );

      return {
        user: null,
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
  async loginWithGoogle() {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      return await this.#handleSignInResponse(response);
    } catch (error) {
      return {
        user: null,
        login: false,
        notificationDto: new NotificationDto(error.message || "Failed to login with Google", ALERT_TYPES.DANGER),
      };
    }
  }

  async loginWithGithub() {
    try {
      const response = await signInWithPopup(auth, githubProvider);
      return await this.#handleSignInResponse(response);
    } catch (error) {
      return {
        user: null,
        login: false,
        notificationDto: new NotificationDto(error.message || "Failed to login with Github", ALERT_TYPES.DANGER),
      };
    }
  }

  async signUserOut() {
    try {
      await signOut(auth);
    } catch (error) {
      return {
        notificationDto: new NotificationDto(error.message || "Failed to sign out ", ALERT_TYPES.DANGER),
      };
    }
  }
}

const authService = new AuthService(sessionService, auditRepository);
export default authService;
