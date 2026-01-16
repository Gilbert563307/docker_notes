import React from "react";
import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";
import ThemeModeComponent from "../../features/settings/component/ThemeModeComponent";
import "./css/CollectListSettings.css";
import { useAuthProvider } from "../../shared/context/AuthProvider";
import { Link } from "react-router-dom";

export default function CollectListSettings() {
  useSetPageTitleHook({ title: "Settings " });
  const { logout } = useAuthProvider();
  return (
    <article className="settings-options">
      <ThemeModeComponent />

      <div className="">
        <div className="m-3">
          <div
            className="toast show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="me-auto">Extra tools</strong>
            </div>
            <div className="toast-body">
              <ul>
                <li>
                  <button
                    type="button"
                    className="btn btn-link log-out-settings"
                    onClick={logout}
                  >
                    Force Logout
                </button>
                </li>
              </ul>
              <ul>
                <li>
                  <Link to="/board/0" title="Kanban default">
                    Kanban default
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card bug-card" >
          <div className="card-body">
            <h5 className="card-title">Report a Bug or Suggest an Improvement</h5>

            <p className="card-text">
              Found a bug or have a suggestion to make our app even better?
              Feel free to send an email to:
            </p>

            <a href="mailto:app.development759@gmail.com" className="card-link">
              app.development759@gmail.com
            </a>
          </div>
        </div> 
      </div>
    </article>
  );
}
