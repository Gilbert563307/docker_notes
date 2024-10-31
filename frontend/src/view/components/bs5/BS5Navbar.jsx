
import React from 'react'
import { useAuthProvider } from '../../../context/AuthProvider';
import "../../../../assets/css/BS5Navbar.css"
import { Link } from 'react-router-dom';

export default function BS5Navbar() {
    const { user, logout } = useAuthProvider();
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    <div className='d-flex gap-1'>
                        <img src={user?.photoURL} alt="Logo" width="50" height="50" className="d-inline-block align-text-top border rounded-pill" />
                        <div>
                            <p className='text-body-secondary mb-0 fs-6'>Hello,</p>
                            <h5>{user.displayName}</h5>
                        </div>
                    </div>

                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className='nav-link' to="/tasks">Tasks</Link>
                        </li>
                        <li className="nav-item">
                            <Link className='nav-link' to="/settings">Settings</Link>
                        </li>
                        <li className="nav-item logout-btn">
                            <a className="nav-link" role='button' onClick={logout}>Logout</a>
                        </li>
                    </ul>

                </div>
            </div>
        </nav>
    );
}
