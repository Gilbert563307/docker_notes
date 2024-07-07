import React from 'react'
import useSetPageTitleHook from '../../hooks/useSetPageTitleHook';
import ThemeModeComponent from './components/ThemeModeComponent';
import "../../assets/css/views/CollectListSettings.css";

export default function CollectListSettings() {
  useSetPageTitleHook({ title: "Settings " });

  return (
    <article className='settings-options'>
      <ThemeModeComponent />
    </article>
  )
}
