import React from "react";
import "../../../assets/css/components/NotificationV3.css";
import BS5Alert, { ALERT_ACTIONS } from "../../../shared/components/bs5/BS5Alert";

/**
 * A reusable notification component that listens to a specified controller context.
 * @deprecated 
 * @param {Object} props - Component props.
 * @param {Object} props.controllerContext - The controller context from which to extract notifications.
 *
 * @returns {JSX.Element} - React component.
 */
export default function NotificationV3({ controllerContext }) {
  const { state, dispatch } = controllerContext();

  const closeNotification = () => {
    dispatch({ type: ALERT_ACTIONS.CLOSE_ALERT });
  };

  return (
    <>
      {state && state.notification && state.notification.message && (
        <article className="bs5-alert-v3 ">
          <BS5Alert
            message={state.notification.message}
            type={state.notification.type}
            closeNotification={closeNotification}
          />
        </article>
      )}
    </>
  );
}
