import React, { useContext, useMemo, useReducer } from "react";
import { Outlet } from "react-router-dom";
import { useAuthProvider } from "../../../shared/context/AuthProvider";
import AuthService from "../service/AuthService";
import AuthControllerContext, { initialState } from "../../../shared/context/AuthControllerContext";
import { notificationObserver } from "../../notification/observer/NotificationObserver";
import { NotificationDto } from "../../notification/application/dto/NotificationDto";

/**
 * @typedef {Object} AuthControllerActions
 * @property {string} LOGIN_WITH_GOOGLE - Action for the login
 */
export const AUTH_CONTROLLER_ACTIONS = {
  LOGIN_WITH_GOOGLE: "LOGIN_WITH_GOOGLE",
  LOGIN_WITH_GITHUB: "LOGIN_WITH_GITHUB",
};

export function useAuthControllerContext() {
  try {
    return useContext(AuthControllerContext);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * AuthController component manages authentication logic and state.
 * @returns {JSX.Element} Rendered AuthController component.
 */
export default function AuthController() {
  const { login } = useAuthProvider();
  const { LoginWithGoogle, LoginWithGithub } = AuthService();

  /**
   *
   * @param {NotificationDto} notificationDto
   * @returns {void}
   */
  function setNotificationToState(notificationDto) {
    if (notificationDto.getMessage() === "") return;
    notificationObserver.addData(notificationDto);
  }

  function closeAlert() {
    notificationObserver.addData(new NotificationDto("", 0));
  }

  /**
   * Handles login with Google authentication.
   */
  async function collectLoginWithGoogle() {
    const response = await LoginWithGoogle();
    if (response.login === false) {
      setNotificationToState(response.notificationDto);
      return;
    }
    login(response.user);
  }

  async function collectLoginWithGithub() {
    const response = await LoginWithGithub();
    if (response.login === false) {
      setNotificationToState(response.notificationDto);
      return;
    }
    login(response.user);
  }

  /**
   * Reducer function for handling state updates in AuthController.
   * @param {Object} state - Current state.
   * @param {Object} action - Action object containing type and payload.
   * @returns {Object} New state after processing the action.
   */
  function reducer(state, action) {
    switch (action.type) {
      default:
        return state;
    }
  }

  const [state, dispatchAction] = useReducer(reducer, initialState);

  /**
   * Dispatches actions based on provided action type.
   * @param {{ type: string, payload: any }} action - Action object with type and optional payload.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function dispatch(action) {
    try {
      switch (action.type) {
        case AUTH_CONTROLLER_ACTIONS.LOGIN_WITH_GOOGLE:
          await collectLoginWithGoogle();
          return;
        case AUTH_CONTROLLER_ACTIONS.LOGIN_WITH_GITHUB:
          await collectLoginWithGithub();
          return;

        case "CLOSE_ALERT":
          closeAlert();
          return;
        default:
          return;
      }
    } catch (error) {
      console.error(`AuthController Error: `, error);
    }
  }

  /** @returns {import("../../../shared/context/AuthControllerContext").AuthControllerContext} */
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <AuthControllerContext.Provider value={contextValue}>
      <Outlet></Outlet>
    </AuthControllerContext.Provider>
  );
}
