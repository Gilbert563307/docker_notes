import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainController from "./MainController";
import TasksController from "./TasksController";
import AuthController from "./AuthController";
import CollectListTasks from "../view/tasks/CollectListTasks";
import CollectCreateTask from "../view/tasks/CollectCreateTask";
import CollectReadTask from "../view/tasks/CollectReadTask";
import CollectUpdateTask from "../view/tasks/CollectUpdateTask";

import CollectListAuth from "../view/auth/CollectListAuth";
import ErrorPage from "../view/error/ErrorPage";
import ProtectedRoute from "../utils/router/ProtectedRoute";
import GuestRoute from "../utils/router/GuestRoute";
import LandingPage from "../view/pages/LandingPage";
import AuthProvider from "../context/AuthProvider";
import SettingsController from "./SettingsController";
import CollectListSettings from "../view/settings/CollectListSettings";
import CollectListBoard from "../view/board/CollectListBoard";
import BoardsController from "./BoardsController";
import DriveController from "./DriveController";
import CollectListDriveFiles from "../view/files/CollectListDriveFiles";
import CollectUploadFile from "../view/files/CollectUploadFile";
import FoldersController from "./FoldersController";
import CollectListFolders from "../view/folders/CollectListFolders";
import CollectCreateFolder from "../view/folders/CollectCreateFolder";
import CollectUpdateFolder from "../view/folders/CollectUpdateFolder";
import CollectReadFolder from "../view/folders/CollectReadFolder";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

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
        ),
      },
      {
        path: `${BASE_URL}/board`,
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
        ],
      },
      {
        path: `${BASE_URL}/tasks`,
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
            path: "create",
            element: <CollectCreateTask />,
          },
          {
            path: "read/:taskId",
            element: <CollectReadTask />,
          },
          {
            path: "update/:taskId",
            element: <CollectUpdateTask />,
          },
        ],
      },
      {
        path: `${BASE_URL}/drive`,
        element: (
          <ProtectedRoute>
            <DriveController />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            path: "",
            element: <CollectListDriveFiles />,
          },
          {
            path: "upload",
            element: <CollectUploadFile />,
          },
        ],
      },
      {
        path: `${BASE_URL}/folders`,
        element: (
          <ProtectedRoute>
            <FoldersController />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            path: "",
            element: <CollectListFolders />,
          },
          {
            path: "create",
            element: <CollectCreateFolder />,
          },
          {
            path: "update/:folderId",
            element: <CollectUpdateFolder />,
          },
          {
            path: "read/:folderId",
            element: <CollectReadFolder />,
          },
        ],
      },
      {
        path: `${BASE_URL}/auth`,
        element: (
          <GuestRoute>
            <AuthController />
          </GuestRoute>
        ),
        children: [
          {
            path: "verify",
            element: <CollectListAuth />,
          },
        ],
      },
      {
        path: `${BASE_URL}/settings`,
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
          },
        ],
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

export default router;
