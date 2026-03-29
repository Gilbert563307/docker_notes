import React from "react";
import useGetProjectsHook from "../../../shared/hooks/useGetProjectsHook";

export default function ProjectFilters() {
  const { kanBoards } = useGetProjectsHook();

  return (
    <div>
      <select className="form-select" aria-label="Select your kanboard to filter on">
        <option defaultValue={""}>Filter on project </option>
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
