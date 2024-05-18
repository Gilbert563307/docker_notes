import React from 'react'
import "../../assets/css/views/CollectListAuth.css";
import { AUTH_CONTROLLER_ACTIONS, useAuthControllerContext } from '../../controller/AuthController';

export default function CollectListAuth() {

  const { dispatch } = useAuthControllerContext();

  const signInWithGoogle = () => {
    dispatch({ type: AUTH_CONTROLLER_ACTIONS.LOGIN_WITH_GOOGLE });
  }

  return (
    <article className='auth-article'>
      <article className='auth-vector'>
        <div className='auth-content'>
          <h1>Your Note's</h1>

          <button type="button" className="btn" onClick={signInWithGoogle}>Sign in with google</button>
        </div>
      </article>

    </article>
  )
}
