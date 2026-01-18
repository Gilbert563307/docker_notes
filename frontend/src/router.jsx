import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AuthProvider from "./shared/context/AuthProvider";
import MainController from "./shared/controller/MainController";
import ProtectedRoute from "./utils/router/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import BoardsController from "./features/kanboard/presentation/BoardsController";
import CollectListBoard from "./pages/board/CollectListBoard";
import TasksController from "./features/kanboard/presentation/TasksController";
import CollectListTasks from "./pages/tasks/CollectListTasks";
import CollectCreateTask from "./pages/tasks/CollectCreateTask";
import CollectReadTask from "./pages/tasks/CollectReadTask";
import CollectUpdateTask from "./pages/tasks/CollectUpdateTask";
import DriveController from "./features/drive/controller/DriveController";
import CollectListDriveFiles from "./pages/files/CollectListDriveFiles";
import CollectUploadFile from "./pages/files/CollectUploadFile";
import FoldersController from "./features/drive/controller/FoldersController";
import CollectListFolders from "./pages/folders/CollectListFolders";
import CollectCreateFolder from "./pages/folders/CollectCreateFolder";
import CollectUpdateFolder from "./pages/folders/CollectUpdateFolder";
import CollectReadFolder from "./pages/folders/CollectReadFolder";
import KanBoardsController from "./features/kanboard/presentation/KanBoardsController";
import CollectListKanBoards from "./pages/kanboard/CollectListKanBoards";
import GuestRoute from "./utils/router/GuestRoute";
import AuthController from "./features/auth/controller/AuthController";
import CollectListAuth from "./pages/auth/CollectListAuth";
import SettingsController from "./features/settings/controller/SettingsController";
import CollectListSettings from "./pages/settings/CollectListSettings";
import ErrorPage from "./pages/error/ErrorPage";
import CollectUpdateKanBoard from "./pages/kanboard/CollectUpdateKanBoard";
import CollectListCreateKanBoard from "./pages/kanboard/CollectListCreateKanBoard";

const routes = [
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
        path: "/board",
        element: (
          <ProtectedRoute>
            <BoardsController />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            path: ":boardId",
            element: <CollectListBoard />,
          },
        ],
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
          },
        ],
      },
      {
        path: "/drive",
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
            path: "/drive/upload",
            element: <CollectUploadFile />,
          },
        ],
      },
      {
        path: "/folders",
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
            path: "/folders/create",
            element: <CollectCreateFolder />,
          },
          {
            path: "/folders/update/:folderId",
            element: <CollectUpdateFolder />,
          },
          {
            path: "/folders/read/:folderId",
            element: <CollectReadFolder />,
          },
        ],
      },
      {
        path: "/kanboards",
        element: (
          <ProtectedRoute>
            <KanBoardsController />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            path: "",
            element: <CollectListKanBoards />,
          },
          {
            path: "/kanboards/create",
            element: <CollectListCreateKanBoard />,
          },
          {
            path: "/kanboards/update/:kanBoardId",
            element: <CollectUpdateKanBoard />,
          },
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
          },
        ],
      },
    ],
    errorElement: <ErrorPage />,
  },
];
const router = createBrowserRouter(routes, { basename: "/app/" });

export default router;
