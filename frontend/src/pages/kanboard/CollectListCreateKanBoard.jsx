import React from "react";

import { KAN_BOARDS_CONTROLLER_ACTIONS, useKanBoardsControllerContext } from "../../features/kanboard/presentation/KanBoardsController";
import KanboardForm from "../../features/kanboard/component/kanboard/KanBoardForm";

export default function CollectListCreateKanBoard() {
  const { dispatch } = useKanBoardsControllerContext();

  /**
   * 
   * @param {{name: string, color: string}} data 
   */
  const onSubmit = (data) => {
    dispatch({ type: KAN_BOARDS_CONTROLLER_ACTIONS.CREATE, payload: data });
  };

  return (                          
    <KanboardForm onSubmit={onSubmit} board={{name: "", color: ""}} submitButtonValue="create" />
  );
}
