import React from 'react'

export default function ThemeModeComponent() {

    return (
        <div className='setting-option'>

            <div className="dropdown">
                <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Theme
                </button>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#"><i className="fa-light fa-sun"></i> Light theme</a></li>
                    <li><a className="dropdown-item" href="#"><i className="fa-light fa-moon"></i> Dark theme</a></li>
                </ul>
            </div>
        </div>
    )
}
