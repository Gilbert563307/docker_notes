import React from "react";
import "./css/CollectReadTask.css";
import useGetTaskHook from "../../shared/hooks/useGetTaskHook";
import UpdateTaskComponent from "../../features/kanboard/component/tasks/UpdateTaskComponent";

export default function CollectUpdateTask() {
  const { task, dispatch } = useGetTaskHook();

  return <UpdateTaskComponent task={task} dispatch={dispatch} />;
}
