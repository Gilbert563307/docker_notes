import React from 'react'
import RepositoryTableRow from './RepositoryTableRow';


/**
 * 
 * @param {Object} props - The properties object.
 * @param {import("../../../../types/types").DriveFiles} props.files - 
 * @returns {JSX.Element} The rendered  component.
 */
export default function RepositoryTable({ files }) {

    /**
    * 
    * @type {Array<{ name: string, icon: JSX.Element | string, className: string,}>}
    */
    const headers = [
        { name: "#", icon: "", className: "", },
        { name: "Name", icon: <i className="fa-light fa-subtitles"></i>, className: "", },
        { name: "Created", icon: <i className="fa-light fa-calendar-day"></i>, className: "created-at", },
        { name: "Updated", icon: <i className="fa-light fa-calendar-day"></i>, className: "updated-at", },
        { name: "Actions", icon: <i className="fa-light fa-gears"></i>, className: "", },
    ];

    return (
      <table className="table table-striped repository-table table-sm mt-3">
        <thead className="thead-light">
          <tr className="repository-table-tr-headers tasks-table-tr-headers">
            {headers.map((header) => {
              return (
                <th
                  scope="col"
                  className={`${header.className} px-6 py-3`}
                  key={header.name}
                >
                  <span>{header.icon}</span> {header.name}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {files &&
            files.length > 0 &&
            files.map((file, index) => (
              <RepositoryTableRow key={file.id || index} file={file} />
            ))}
        </tbody>
      </table>
    );
}
