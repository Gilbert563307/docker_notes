import React from 'react'
import { useThemeContext } from '../../../context/ThemeContext'

export default function ThemeModeComponent() {

    const { darkTheme, lightTheme } = useThemeContext();

    return (
        <div className='setting-option'>

            <div className="dropdown">
                <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Theme
                </button>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#" role='button' onClick={() => lightTheme()}><i className="fa-light fa-sun"></i> Light theme</a></li>
                    <li><a className="dropdown-item" href="#" role='button' onClick={() => darkTheme()}><i className="fa-light fa-moon"></i> Dark theme</a></li>
                </ul>
            </div>
        </div>
    )
}
