import React from 'react'
import BS5TruncateSpan from '../../bs5/BS5TruncateSpan'
import { Link } from 'react-router-dom'

export default function RepositoryTableRow({ file }) {

    const readFileUrl = `/drive/read/file/${file.id}`;
    return (
        <tr className='repository-table-row'>
            <th scope="row">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        disabled={true}
                    />
                </div>
            </th>
            <td>
                <BS5TruncateSpan
                    content={<Link to={readFileUrl} state={{ file: file }} title={file.name} className="read-link">
                        {file.name}
                    </Link>}
                    maxWidthToSet="350px"
                />
            </td>
            <td>{file.created_at.toLocaleString()}</td>
            <td>{file.updated_at.toLocaleString()}</td>
            <td className='main-table-actions'>
                <button>
                    <Link to={readFileUrl} state={{ file: file }}>
                        <i className="fa-light fa-magnifying-glass"></i>
                    </Link>
                </button>
                <button>
                    <Link to={`/drive/update/file/${file.id}`}>
                        <i className="fa-sharp fa-light fa-pencil"></i>
                    </Link>
                </button>
                <button>
                    <i className="fa-light fa-box-archive"></i>
                </button>
                <button>
                    <i className="fa-light fa-download"></i>
                </button>
            </td>
        </tr>
    )
}
