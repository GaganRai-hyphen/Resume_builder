import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Ragister from "./features/auth/pages/Ragister";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/interview";


export const router = createBrowserRouter([
    {
    path: "${window.location.origin}/login",
    element: <Login />
  },    
  {
    path: "${window.location.origin}/ragister",
    element: <Ragister />
  },
  {
    path: "${window.location.origin}/",
    element: <Protected><Home /></Protected>
  },
  {
        path:"${window.location.origin}/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    }
]);


