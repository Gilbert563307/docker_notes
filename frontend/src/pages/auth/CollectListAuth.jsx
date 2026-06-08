import React from "react";
import "./css/CollectListAuth.css";
import { useAuthControllerContext } from "../../shared/context/AuthControllerContext";
import { AUTH_CONTROLLER_ACTIONS } from "../../features/auth/presentation/AuthController";
import IMAGES from "../../assets/images/Images";

export default function CollectListAuth() {
  const { dispatch } = useAuthControllerContext();

  function signInWithGoogle() {
    dispatch({ type: AUTH_CONTROLLER_ACTIONS.LOGIN_WITH_GOOGLE });
  }

  function signInWithGithub() {
    dispatch({ type: AUTH_CONTROLLER_ACTIONS.LOGIN_WITH_GITHUB });
  }

  // function signInWithEmailAndPassword() {
  //   // dispatch({ type: AUTH_CONTROLLER_ACTIONS.LOGIN_WITH_EMAIL });
  // }

  return (
    <article className="auth-article">
      <article className="auth-vector">
        <div className="auth-content">
          <h1>Your Tasks</h1>

          <div className="sign-in-buttons">
            {/* <button
              type="button"
              className="btn sign-in-btn"
              onClick={signInWithEmailAndPassword}
            >
              Sign in with Email & Password
            </button> */}
            <button
              type="button"
              className="btn sign-in-btn"
              onClick={signInWithGoogle}
            >
              <img
                src={IMAGES.googleIcon}
                className="sign-in-icons"
                alt="goole icon"
              ></img>
              Sign in with Google
            </button>

            <button
              type="button"
              className="btn sign-in-btn"
              onClick={signInWithGithub}
            >
              <img
                src={IMAGES.githubicon}
                className="sign-in-icons"
                alt="github icon"
              ></img>
              Sign in with Github
            </button>
          </div>
        </div>
      </article>
    </article>
  );
}
