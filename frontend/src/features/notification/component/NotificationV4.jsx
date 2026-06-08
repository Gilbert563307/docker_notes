import React, { createRef, useEffect, useState } from "react";
import { notificationObserver } from "../observer/NotificationObserver";
import "../css/notificationv4.css";
import { NotificationDto } from "../application/dto/NotificationDto";

export const NOTIFICATION_TYPES = {
  INFO: 0,
  DANGER: 1,
  SUCCESS: 2,
  PRIMARY: 3,
};

/**
 *
 * @param {Object} props
 * @param {import("react").MouseEventHandler} props.closeNotification
 * @param {string} props.title
 * @param {string} props.message
 * @param {string} props.timestamp
 * @param {number} props.type
 * @param {boolean} props.unread
 *
 * @returns {JSX.Element}
 */
export default function NotificationV4() {
  const typeMap = {
    [NOTIFICATION_TYPES.INFO]: "text-info border-info",
    [NOTIFICATION_TYPES.DANGER]: "text-danger border-danger",
    [NOTIFICATION_TYPES.SUCCESS]: "text-success border-success",
    [NOTIFICATION_TYPES.PRIMARY]: "text-primary border-primary",
  };

  const [notification, setNotification] = useState({ message: "", type: 0 });
  const articleRef = createRef();

  /**
   *
   * @param {number} type
   * @returns {string}
   */
  const getTypeClasses = (type) => typeMap[type] || typeMap[NOTIFICATION_TYPES.INFO];

  /**
   * Will be called as a callback function because this class subscribed to the notification observer
   * Then the data will be passes as an array with
   *
   * @param {Array<NotificationDto>} data
   */
  function next(data) {
    if (data.length === 1) {
      const notification = data[0];
      setNotification(notification.toJson());
      articleRef.current?.focus();
    }
  }

  function closeNotification() {
    setNotification({ message: "", type: 0 });
  }

  const observer = { next: next };

  useEffect(() => {
    notificationObserver.subscribe(observer);
  }, []);

  return (
    <article
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      tabIndex={-1}
      ref={articleRef}
      className={`notification ${notification.message != "" ? "show" : "hide"}  ${getTypeClasses(notification.type)} `}
    >
      <button className="close-btn" title="Close" onClick={closeNotification}>
        ×
      </button>
      <p className="notification-message">{notification.message}</p>
    </article>
  );
}
