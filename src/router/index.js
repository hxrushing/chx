import { createBrowserRouter } from "react-router-dom";
import Layout from "@/pages/layout";
import Login from "@/pages/login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />
    },
    {
        path: "/Login",
        element: <Login />
    }
])

export default router