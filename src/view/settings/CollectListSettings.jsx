import React from 'react'
import useSetPageTitleHook from '../../hooks/useSetPageTitleHook';
import ThemeModeComponent from './components/ThemeModeComponent';
import "../../assets/css/views/CollectListSettings.css";
import { useAuthProvider } from '../../context/AuthProvider';

export default function CollectListSettings() {
  useSetPageTitleHook({ title: "Settings " });
  const { logout } = useAuthProvider();
  return (
    <article className='settings-options'>
      <ThemeModeComponent />

      <div className=''>
        <ul>
          <li><button type="button" className="btn btn-link log-out-settings" onClick={logout} >Force Logout</button></li>
        </ul>
      </div>


    </article>
  )
}
