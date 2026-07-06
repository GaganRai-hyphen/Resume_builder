import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Ragister from "./features/auth/pages/Ragister";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/interview";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },    
    {
        path: "/ragister",
        element: <Ragister />
    },
    {
        path: "/", // Matches localhost:5173/
        element: <Protected><Home /></Protected>
    },
    {
        path: "/home", // Matches localhost:5173/home
        element: <Protected><Home /></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
    {
        // Catch-all route: Redirects any unknown URLs to the home page
        path: "*",
        element: <Navigate to="/" replace />
    }
]);