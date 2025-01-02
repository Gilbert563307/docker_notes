import React, { useMemo, useReducer } from "react";
import { Outlet } from "react-router-dom";
import { useAuthProvider } from "../context/AuthProvider";
import AuthLogic from "../model/AuthLogic";
import AuthControllerContext, {
  initialState,
} from "../context/AuthControllerContext";

/**
 * @typedef {Object} AuthControllerActions
 * @property {string} LOGIN_WITH_GOOGLE - Action for the login
 */
export const AUTH_CONTROLLER_ACTIONS = {
  LOGIN_WITH_GOOGLE: "LOGIN_WITH_GOOGLE",
};

/**
 * AuthController component manages authentication logic and state.
 * @returns {JSX.Element} Rendered AuthController component.
 */
export default function AuthController() {
  const { login } = useAuthProvider();
  const { LoginWithGoogle } = AuthLogic();

  /**
   * Reducer function for handling state updates in AuthController.
   * @param {Object} state - Current state.
   * @param {Object} action - Action object containing type and payload.
   * @returns {Object} New state after processing the action.
   */
  function reducer(state, action) {
    switch (action.type) {
      case AUTH_CONTROLLER_ACTIONS.SET_NOTIFICATION:
        return { ...state, notification: action.payload };
      default:
        return state;
    }
  }

  const [state, dispatchAction] = useReducer(reducer, initialState);

  /**
   * Sets error notification to state.
   * @param {import("../types/types").Notification} notificationObject - Object containing error message and type.
   */
  function setMessageToState(notificationObject) {
    if (
      Object.keys(notificationObject).length === 0 ||
      notificationObject.message === ""
    )
      return;
    dispatchAction({
      type: AUTH_CONTROLLER_ACTIONS.SET_NOTIFICATION,
      payload: {
        message: notificationObject.message,
        type: notificationObject.type,
      },
    });
  }

  /**
   * Handles login with Google authentication.
   */
  async function collectLoginWithGoogle() {
    try {
      const response = await LoginWithGoogle();
      if (response.login === false || Object.keys(response.user).length === 0)
        return;
      login(response.user);
    } catch (error) {
      setMessageToState(error);
    }
  }

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
        default:
          return;
      }
    } catch (error) {
      console.log(`AuthController Error: `, error);
    }
  }

  /** @returns {import("../context/AuthControllerContext").AuthControllerContext} */
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <AuthControllerContext.Provider value={contextValue}>
      <Outlet></Outlet>
    </AuthControllerContext.Provider>
  );
}
