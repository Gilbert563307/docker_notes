import React from "react";

export const ALERT_TYPES = {
  INFO: 0,
  DANGER: 1,
  SUCCESS: 2,
  PRIMARY: 3,
};

export const ALERT_ACTIONS = {
  CLOSE_ALERT: "CLOSE_ALERT",
};

/**
 *
 * @param {Object} props
 * @param {import("react").MouseEventHandler} props.closeNotification
 * @param {string} props.message
 * @param {number} props.type
 *
 * @returns {JSX.Element} - React component.
 */
export default function BS5Alert({
  closeNotification = () => {},
  message,
  type = ALERT_TYPES.INFO,
}) {
  const alertTypeMap = {
    [ALERT_TYPES.INFO]: "alert-info",
    [ALERT_TYPES.DANGER]: "alert-danger",
    [ALERT_TYPES.SUCCESS]: "alert-success",
    [ALERT_TYPES.PRIMARY]: "alert-primary",
  };

  const getAlertType = (type) =>
    alertTypeMap[type] || alertTypeMap[ALERT_TYPES.INFO];

  return (
    <div
      className={`alert alert-dismissible fade show ${getAlertType(type)}`}
      role="alert"
    >
      {/* //TODO maybe implement to show which type or alert <strong>Holy guacamole!</strong> */}
      {message}
      <button
        type="button"
        className="btn-close"
        onClick={closeNotification}
        aria-label="Close"
      ></button>
    </div>
  );
}

