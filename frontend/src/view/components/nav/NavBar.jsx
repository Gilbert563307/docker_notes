import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/css/components/NavBar.css";
import { useAuthProvider } from "../../../context/AuthProvider";

export default function NavBar() {
  const { logout } = useAuthProvider();
  const navigate = useNavigate();
  const cacheUrl = sessionStorage.getItem("ACTIVE_URL");
  const [activeItem, setActiveItem] = useState(
    cacheUrl ? parseInt(cacheUrl) : 0
  );
  /**
   *
   * @param {number} key
   */
  const saveActiveUrl = (key) => {
    setActiveItem(key);
    sessionStorage.setItem("ACTIVE_URL", String(key));
  };
  /**
   * @returns {Array<{name: string, url: string, icon: string}>}
   */
  const items = [
    {
      name: "Kanban",
      url: "kanboards",
      icon: "fa-duotone fa-solid fa-chart-kanban",
    },
    // {
    //   name: "Board",
    //   url: "/board",
    //   icon: "fa-duotone fa-solid fa-clapperboard",
    // },
    { name: "Tasks", url: "/tasks", icon: "fa-duotone fa-solid fa-list-check" },
    { name: "Folders", url: "/folders", icon: "fa-duotone fa-solid fa-folder" },
    {
      name: "Drive",
      url: "/drive",
      icon: "fa-duotone fa-regular fa-hard-drive",
    },
    { name: "Settings", url: "/settings", icon: "fa-duotone fa-thin fa-gear" },
  ];

  return (
    <nav className="main-navigation">
      <ul className="navbar">
        {items.map((item, key) => {
          const isActiveUrl = key === activeItem;
          return (
            <li key={key} className={isActiveUrl ? "active-url" : ""}>
              <Link onClick={() => saveActiveUrl(key)} to={item.url}>
                <div className="nav-item-group">
                  <div>
                    <i
                      className={` ${item.icon} ${
                        !isActiveUrl ? "text-dark" : ""
                      }`}
                    />
                  </div>
                  <div>{item.name}</div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <ul className="sign-out">
        <li>
          <a href="#" role="button" onClick={logout}>
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
}
