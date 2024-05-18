import React, { useEffect } from 'react'
import { useMainControllerContext } from '../../controller/MainController';

export default function CollectListNotes() {

  const { setTitle } = useMainControllerContext();
  useEffect(() => {
    setTitle("Notes");
  }, []);

  return (
    <div>CollectListNotes</div>
  )
}
