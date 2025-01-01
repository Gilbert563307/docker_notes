import React from "react";
import { Link } from "react-router-dom";
import "../../assets/css/views/folders/CollectListFolders.css";
import BS5PaginationV2 from "../components/bs5/BS5PaginationV2";
import useSetPageTitleHook from "../../hooks/useSetPageTitleHook";

export default function CollectListFolders() {
  useSetPageTitleHook({ title: "Folders " });

  const folders = [
    {
      id: "NECQfscfVTouhVLvTjUo",
      name: "AI",
      color: "#AAF3B4",
      created_at: "December 17, 2024 at 2:08:32 AM UTC+1",
      updated_at: "December 17, 2024 at 2:22:25 AM UTC+1",
      user_uid: "4a422422542e48ec029f6d21bc93c2d3cd24f823a33dba037672c5d180",
    },
    {
      id: "PLMWesfdKYuioTQweWVp",
      name: "Projects",
      color: "#FFD700",
      created_at: "December 18, 2024 at 3:12:45 PM UTC+1",
      updated_at: "December 19, 2024 at 4:10:30 PM UTC+1",
      user_uid: "3b5124345eac57ec049f7e11bd14c2e3ce47f134b22cab038674c6d270",
    },
    {
      id: "QWERTASDFVZXC5678YUI",
      name: "Work",
      color: "#FF5733",
      created_at: "December 16, 2024 at 11:22:01 AM UTC+1",
      updated_at: "December 17, 2024 at 12:40:18 PM UTC+1",
      user_uid: "1a612523652c35dc034f8d11ef34b1f4de58g247c44eda048978d7f480",
    },
    {
      id: "ZXCVBNMASD1234GHJKL",
      name: "Personal",
      color: "#3CB371",
      created_at: "December 15, 2024 at 10:15:44 AM UTC+1",
      updated_at: "December 16, 2024 at 9:55:27 PM UTC+1",
      user_uid: "2c732643762d45fc023f9f12ef45c3g5ef69h358d55fca059089e8g590",
    },
    {
      id: "LKJHGFDSAPOIUYTREWQ",
      name: "Archive",
      color: "#8A2BE2",
      created_at: "December 14, 2024 at 6:05:32 PM UTC+1",
      updated_at: "December 15, 2024 at 8:18:43 PM UTC+1",
      user_uid: "5d843854872e56gd034g1g13gf56d4h6fh79j469e66gda061190f9h690",
    },
  ];
  return (
    <article className="folders-article">
      <div>
        <ul className="list-group list-group-flush">
          {folders.map((f) => {
            const readFolderUrl = `folders/read/${f.id}`;
            return (
              <li className="list-group-item">
                <span>
                  <i
                    className="fa-duotone fa-solid fa-folder"
                    style={{ color: f.color }}
                  ></i>
                </span>{" "}
                <Link className="folders-link" to={readFolderUrl}>
                  {f.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        {/* <BS5PaginationV2 totalItems={totalFiles} totalPages={totalPages} /> */}
      </div>
    </article>
  );
}
