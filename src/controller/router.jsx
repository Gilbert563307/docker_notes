import React from 'react'
import {
    createBrowserRouter,

} from "react-router-dom";
import MainController from './MainController';
import TasksController from './TasksController';
import AuthController from './AuthController';
import CollectListTasks from '../view/tasks/CollectListTasks';
import CollectCreateTask from '../view/tasks/CollectCreateTask';
import CollectReadTask from '../view/tasks/CollectReadTask';
import CollectUpdateTask from '../view/tasks/CollectUpdateTask';

import CollectListAuth from '../view/auth/CollectListAuth';
import ErrorPage from '../view/error/ErrorPage';
import ProtectedRoute from '../utils/router/ProtectedRoute';
import GuestRoute from '../utils/router/GuestRoute';
import LandingPage from '../view/pages/LandingPage';
import AuthProvider from '../context/AuthProvider';
import SettingsController from './SettingsController';
import CollectListSettings from '../view/settings/CollectListSettings';
import CollectListBoard from '../view/board/CollectListBoard';
import BoardsController from './BoardsController';


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
                path: "/board",
                element: (
                    <ProtectedRoute>
                        <BoardsController />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        path: "",
                        element: <CollectListBoard />,
                    },
                ]
            },
            {
                path: "/tasks",
                element: (
                    <ProtectedRoute>
                        <TasksController />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        path: "",
                        element: <CollectListTasks />,
                    },
                    {
                        path: "/tasks/create",
                        element: <CollectCreateTask />,
                    },
                    {
                        path: "/tasks/read/:taskId",
                        element: <CollectReadTask />,
                    },
                    {
                        path: "/tasks/update/:taskId",
                        element: <CollectUpdateTask />,
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
                element: (
                    <ProtectedRoute>
                        <SettingsController />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        path: "",
                        element: <CollectListSettings />,
                    }
                ]
            }
        ],
        errorElement: <ErrorPage />,
    },
]);

export default router;