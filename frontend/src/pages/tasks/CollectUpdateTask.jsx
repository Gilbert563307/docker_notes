import React from "react";
import "./css/CollectReadTask.css";
import useGetTaskHook from "../../shared/hooks/useGetTaskHook";
import UpdateTaskComponent from "../../features/kanboard/component/tasks/UpdateTaskComponent";
import { Show } from "../../shared/components/custom/Show";

export default function CollectUpdateTask() {

  const { task, dispatch } = useGetTaskHook();

  const checkIfTheTaskIsLoadedIn = (taskObject) => {
    if (Object.keys(taskObject).length === 0) return false;
    return true;
  }

  return (
    <>
      <Show>
        <Show.When isTrue={checkIfTheTaskIsLoadedIn(task)}>
          <UpdateTaskComponent task={task} dispatch={dispatch} />
        </Show.When>
        <Show.Else>
          <article className="d-flex justify-content-center read-project-component">
            <p>Loading....</p>
          </article>
        </Show.Else>
      </Show>
    </>
  );
}