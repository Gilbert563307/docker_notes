import React from 'react'
import useSetPageTitleHook from '../../hooks/useSetPageTitleHook'

export default function CollectListNotes() {
  useSetPageTitleHook({ title: "Notes" });

  return (
    <div>CollectListNotes</div>
  )
}
