import React from "react";
import useGetProjectsHook from "../../../shared/hooks/useGetProjectsHook";
import { SessionMemoryFilter } from "../../../shared/helpers/SessionMemoryFilterUtil";
import { TASKS_PROJECT_ID_FILTER, NONE_PROJECTS } from "../../../config";

export default function ProjectFilters() {
  const { kanBoards } = useGetProjectsHook();

  // function getSelectedOption() {
  //   const item = SessionMemoryFilter.getItem(TASKS_PROJECT_ID_FILTER);
  //   if (item) return item;
  //   return "";
  // }

  // const [selectedProject, setSelectedProject] = useState(getSelectedOption());

  /**
   *
   * @param {Event} event
   */
  function addProjectIdToSession(event) {
    const kanBoardId = event.target.value;
    SessionMemoryFilter.setItem(TASKS_PROJECT_ID_FILTER, kanBoardId);
  }

  return (
    <div>
      <select
        className="form-select"
        aria-label="Select your kanboard to filter on"
        onChange={(e) => addProjectIdToSession(e)}
      >
        <option value="">Filter on project </option>
        <option value={NONE_PROJECTS}>None</option>
        {kanBoards.map((kanBoard) => {
          return (
            <option key={kanBoard.getId()} value={kanBoard.getId()}>
              {kanBoard.getName()}
            </option>
          );
        })}
      </select>
    </div>
  );
}
