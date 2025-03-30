import { createBrowserRouter } from "react-router-dom";
import Layout from "@/pages/layout";
import Login from "@/pages/login";
import { AuthRoute } from "@/components/AuthRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthRoute><Layout /></AuthRoute>
    },
    {
        path: "/Login",
        element: <Login />
    }
])

export default router