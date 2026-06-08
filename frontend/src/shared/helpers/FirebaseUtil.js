import { UserDto } from "../../features/auth/application/dto/UserDto";
import { AUTH_STORAGE_KEYS } from "../context/AuthProvider";
import { UseCookieStorage } from "./useCookieStorage";

export class FirebaseUtil {
  getCurrentUser() {
    const cookieData = UseCookieStorage.readCookieByDocument(AUTH_STORAGE_KEYS.USER);
    const userDto = cookieData ? JSON.parse(cookieData) : null;
    if (userDto === null) return null;
    return new UserDto(userDto.uid, userDto.displayName, userDto.email, userDto.photoURL, userDto.token);
  }

  getUserUid() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;
    return currentUser.getUid();
  }

  getBackendUrl() {
    return import.meta.env.VITE_APP_BACKEND_URL;
  }

  getXToken() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;
    return currentUser.getToken();
  }

  getDisplayName(){
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;
    return currentUser.getDisplayName();
  }
}
