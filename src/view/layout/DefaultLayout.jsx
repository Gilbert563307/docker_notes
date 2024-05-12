import React from 'react'
import { Outlet } from 'react-router-dom'
import BS5Navbar from '../components/alerts/bs5/BS5Navbar'

export default function DefaultLayout() {
  return (
    <section className='main-section'>
      <BS5Navbar />
      <Outlet></Outlet>
    </section>
  )
}
