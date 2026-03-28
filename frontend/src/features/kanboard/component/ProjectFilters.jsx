import React from "react";
import useGetProjectsHook from "../../../shared/hooks/useGetProjectsHook";

export default function ProjectFilters() {
  const { projects } = useGetProjectsHook();

  return (
    <div>
      <select className="form-select" aria-label="Default select example">
        <option selected>Filter on project </option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </select>
    </div>
  );
}
