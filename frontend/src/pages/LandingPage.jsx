import React from 'react'
import { Navigate } from 'react-router-dom'
import { LANDING_PAGE_ROUTE } from '../../config'

export default function LandingPage() {
    //TODO collect data or use for insights

    return <Navigate to={LANDING_PAGE_ROUTE}/>
}
