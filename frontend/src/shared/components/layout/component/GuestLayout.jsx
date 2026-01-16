import React from "react";
import { Outlet } from "react-router-dom";
import NotificationV4 from "../../../../features/notification/component/NotificationV4";

export default function GuestLayout() {
  return (
    <section className="main-section">
      <NotificationV4 />
      <Outlet></Outlet>
    </section>
  );
}
