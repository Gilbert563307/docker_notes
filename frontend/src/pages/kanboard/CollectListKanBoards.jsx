import React from "react";
import { Link } from "react-router-dom";
import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";
import "./css/collectlistkanboards.css";
import useGetKanBoardsHook from "../../shared/hooks/useGetKanBoardsHook";

export default function CollectListKanBoards() {
  const { boards } = useGetKanBoardsHook();

  useSetPageTitleHook({ title: "Kanban" });

  return (
    <article className="kanboard-article">
      <div className="kanban-button-div">
        <p className="kanban-p">Your workspace's</p>
        <Link aria-describedby="create task button" className="add-task-button task-btn-plain " to="/kanboards/create">
          create
        </Link>
      </div>
      <div className="cards">
        {boards.map((item) => {
          const itemId = item.getId();
          const boardsUrl = `/board/${itemId}`;
          const updateBoardsUrl = `/kanboards/update/${itemId}`;
          return (
            <div className="card" key={itemId}>
              <Link to={boardsUrl}>
                <div className="card-color" style={{ backgroundColor: item.getColor() }} />
              </Link>
              <div className="card-label">
                {item.getName()}
                <Link to={updateBoardsUrl}>
                  <button className="kanboard-options-button">
                    <i className="fa-sharp fa-light fa-pencil"></i>
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
