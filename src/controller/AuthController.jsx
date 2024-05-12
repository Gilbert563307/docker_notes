import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthProvider } from '../context/AuthProvider';
import AuthLogic from '../model/AuthLogic';

/**
 * Actions that can be dispatched to the AuthController's reducer.
 * @type {Object}
 */
export const AUTH_CONTROLLER_ACTIONS = {
  LOGIN_WITH_GOOGLE: "LOGIN_WITH_GOOGLE",
};

/**
 * Initial state for the AuthController.
 * @type {Object}
 */
const initialState = {
  notification: { message: "", type: 0 },
};

/**
 * Context for managing state and actions within the AuthController.
 */
const AuthControllerContext = createContext(initialState);

/**
 * Custom hook to access the AuthController context.
 * @returns {Object} AuthController context value.
 */
export const useAuthControllerContext = () => {
  const authControllerContext = useContext(AuthControllerContext);

  if (!authControllerContext) {
    throw new Error('useAuthControllerContext must be used within an AuthController');
  }

  return authControllerContext;
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
  const reducer = (state, action) => {
    switch (action.type) {
      case AUTH_CONTROLLER_ACTIONS.SET_NOTIFICATION:
        return { ...state, notification: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatchAction] = useReducer(reducer, initialState);

  /**
   * Sets error notification to state.
   * @param {{ notification: string, message: string} } notificationObject - Object containing error message and type.
   */
  const setMessageToState = (notificationObject) => {
    if (Object.keys(notificationObject).length === 0 || notificationObject.message === "") return;
    dispatchAction({
      type: AUTH_CONTROLLER_ACTIONS.SET_NOTIFICATION,
      payload: { message: notificationObject.message, type: notificationObject.type },
    });
  };

  /**
   * Handles login with Google authentication.
   */
  const collectLoginWithGoogle = async () => {
    try {
      const response = await LoginWithGoogle();
      if (login === false || Object.keys(response.user).length === 0) return;
      login(response.user);

    } catch (error) {
      setMessageToState(error);
    }
  };

  /**
   * Dispatches actions based on provided action type.
   * @param {{ type: string, payload: any }} action - Action object with type and optional payload.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dispatch = async (action) => {
    try {
      switch (action.type) {
        case AUTH_CONTROLLER_ACTIONS.LOGIN_WITH_GOOGLE:
          await collectLoginWithGoogle();
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(`AuthController Error: `, error);
    }
  };

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <AuthControllerContext.Provider value={contextValue}>
      <Outlet></Outlet>
    </AuthControllerContext.Provider>
  );
}
