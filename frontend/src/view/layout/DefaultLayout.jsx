import React from 'react'
import { Outlet } from 'react-router-dom'
import "../../assets/css/layouts/DefaultLayout.css";
import { useAuthProvider } from '../../context/AuthProvider';
import NavBar from "../components/nav/NavBar";
import { useMainControllerContext } from '../../controller/MainController';

/**
 * 
 * @returns {JSX.Element}
 */
export default function DefaultLayout() {
  const { user } = useAuthProvider();
  const { title } = useMainControllerContext();

  return (
    <section className="default-layout">

      <aside className="aside-navigation">
        <article>
          <h1 className="stats-tracker-h1">Tasks - Tracker</h1>
          <p ><span className='text-body-secondary user-welcome'>Welcome,</span> <b className="fw-medium user-name">{user?.displayName}</b> </p>
          <NavBar />
        </article>
      </aside>
      <article className="layout-section">
        <article className="mx-1">
          <h2 className='layout-title'>{title}</h2>
          <div className="layout-line"></div>
          <article className="content border rounded">
            <Outlet></Outlet>
          </article>
        </article>
        <p className='app-version'> Application version: Beta 1.0</p>
      </article>
    </section>
  )
}
