import React from "react";
import { Link } from "react-router-dom";
import useSetPageTitleHook from "../../hooks/useSetPageTitleHook";
import "../../assets/css/views/kanboard/collectlistkanboards.css";
import useGetKanBoardsHook from "../../hooks/useGetKanBoardsHook";

export default function CollectListKanBoards() {
  const { boards } = useGetKanBoardsHook();

  useSetPageTitleHook({ title: "Kanban" });

  return (
    <article>
      <div>
        <Link
          aria-describedby="create task button"
          className="add-task-button task-btn-plain "
          to="/kanboards/create"
        >
          create
        </Link>
      </div>
      <div className="cards">
        {boards.map((item) => {
          const boardsUrl = `/board/${item.id}`;
          return (
            <Link to={boardsUrl}>
              <div key={item.id} className="card">
                <div
                  className="card-color"
                  style={{ backgroundColor: item.color }}
                />
                <div className="card-label">{item.name}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </article>
  );
}
