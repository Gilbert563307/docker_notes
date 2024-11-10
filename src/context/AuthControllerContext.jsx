import React, { createContext, useContext } from 'react';

/**
 * @typedef {Object} InitialState
 * @property {{message: string, type: number}} notification
 */

/**
 * Initial state for the AuthController.
 * @type {InitialState}
 */
export const initialState = {
    notification: { message: "", type: 0 },
};

/**
 * @typedef {Object} AuthControllerContext
 * @property {InitialState} state - The current state of the auth controller.
 * @property {(action: { type: string, payload?: any }) => void} dispatch - Function to dispatch actions.
 */

/** @type {React.Context<AuthControllerContext>} */
const AuthControllerContext = createContext({
    state: initialState,
    dispatch: (action) => { },
});

/**
 * Custom hook to access the AuthController context.
 * @returns {AuthControllerContext} AuthController context value.
 */
export const useAuthControllerContext = () => {
    const authControllerContext = useContext(AuthControllerContext);

    if (!authControllerContext) {
        throw new Error('useAuthControllerContext must be used within an AuthController');
    }

    return authControllerContext;
};

export default AuthControllerContext;

