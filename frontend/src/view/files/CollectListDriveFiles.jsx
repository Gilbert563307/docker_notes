import React from 'react'
import useSetPageTitleHook from '../../hooks/useSetPageTitleHook';
import CollectListRepository from '../components/drive/CollectListRepository';

export default function CollectListDriveFiles() {

  useSetPageTitleHook({ title: "Drive " });

  return (
    <article className='drive-article '>
      <div>
        <CollectListRepository/>
      </div>
    </article>
  )
}
