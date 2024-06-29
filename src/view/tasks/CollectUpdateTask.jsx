import React from "react";
import "../../assets/css/views/tasks/CollectReadTask.css";
import useGetTaskHook from "../../hooks/useGetTaskHook";
import { Show } from "../components/custom/Show";
import UpdateTaskComponent from "./components/UpdateTaskComponent";

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
            <p>Wachten op de server....</p>
          </article>
        </Show.Else>
      </Show>
    </>
  );
}