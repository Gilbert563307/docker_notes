import React from 'react'
import useSetPageTitleHook from '../../hooks/useSetPageTitleHook';
import { Link } from 'react-router-dom';

export default function CollectListDriveFiles() {

  useSetPageTitleHook({ title: "Drive " });

  return (
    <article className='drive-article '>
      <div className='drive-header'>
        <input
          type="text"
          className="form-control disabled"
          id="search_bar"
          placeholder="Search ...."
        // value={searchValue}
        // onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className="tasks-article-buttons">
          {/* <div>
            filters..
          </div> */}
          <div>
            <Link
              aria-describedby="create task button"
              className="add-task-button task-btn-plain "
              to="/drive/upload"
            >
              upload
            </Link>
          </div>
        </div>
      </div>

    </article>
  )
}
