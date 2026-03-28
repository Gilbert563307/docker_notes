import React, { useEffect } from "react";
import {
  TASKS_CONTROLLER_ACTIONS,
  useTasksControllerContext,
} from "../../features/kanboard/presentation/TasksController";

export default function useGetProjectsHook() {
  const { state, dispatch } = useTasksControllerContext();

  function getKanboardsByCurrentUser() {
    dispatch({ type: TASKS_CONTROLLER_ACTIONS.GET_KAN_BOARDS_BY_CURRENT_USER });
  }

  useEffect(() => {
    getKanboardsByCurrentUser();
  }, []);

  return {
    kanBoards: state.kanBoards,
  };
}
