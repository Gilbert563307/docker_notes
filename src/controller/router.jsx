import React from 'react'
import {
    createBrowserRouter,

} from "react-router-dom";
import MainController from './MainController';
import NotesController from './NotesController';
import AuthController from './AuthController';
import CollectListNotes from '../view/notes/CollectListNotes';
import CollectCreateNote from '../view/notes/CollectCreateNote';
import CollectReadNote from '../view/notes/CollectReadNote';
import CollectUpdateNote from '../view/notes/CollectUpdateNote';

import CollectListAuth from '../view/auth/CollectListAuth';
import ErrorPage from '../view/error/ErrorPage';
import ProtectedRoute from '../utils/router/ProtectedRoute';
import GuestRoute from '../utils/router/GuestRoute';
import LandingPage from '../view/pages/LandingPage';
import AuthProvider from '../context/AuthProvider';


const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthProvider>
                <MainController />
            </AuthProvider>
        ),
        children: [
            {
                index: true,
                path: "",
                element: (
                    <ProtectedRoute>
                        <LandingPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "/notes",
                element: (
                    <ProtectedRoute>
                        <NotesController />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        path: "",
                        element: <CollectListNotes />,
                    },
                    {
                        path: "notes/create",
                        element: <CollectCreateNote />,
                    },
                    {
                        path: "notes/read",
                        element: <CollectReadNote />,
                    },
                    {
                        path: "notes/update",
                        element: <CollectUpdateNote />,
                    }
                ],
            },
            {
                path: "/auth",
                element: (
                    <GuestRoute>
                        <AuthController />
                    </GuestRoute>
                ),
                children: [
                    {
                        path: "/auth/verify",
                        element: <CollectListAuth />,
                    },
                ],
            },
            {
                path: "/settings",
                element: <div>settings</div>
            }
        ],
        errorElement: <ErrorPage />,
    },
]);

export default router;