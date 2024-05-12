import React from 'react'
import { Outlet } from 'react-router-dom'

export default function DefaultLayout() {
  return (
    <section className='main-section'>
      <h1>DefaultLayout</h1>
      <Outlet></Outlet>
    </section>
  )
}
