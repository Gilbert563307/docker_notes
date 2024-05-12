import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthController() {
  console.log(`AuthController`)
  return (
    <>
      <h1>AuthController</h1>
      <Outlet></Outlet>
    </>

  )
}
