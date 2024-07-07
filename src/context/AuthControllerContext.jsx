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
 * Context for managing state and actions within the AuthController.
 */
/**
 * @typedef {React.Context} AuthControllerContext
 * @property {InitialState} state
 * @property {(object: {type: string, payload?: any} ) => void} dispatch
 */
const AuthControllerContext = createContext(
     /** @type {AuthControllerContext} */ {
        state: initialState,
        dispatch: (action) => { },
    }
);

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

export default AuthControllerContext;

