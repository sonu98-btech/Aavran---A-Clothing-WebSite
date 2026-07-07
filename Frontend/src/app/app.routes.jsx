import {createBrowserRouter} from "react-router"
import Register from "../features/auth/pages/register.jsx"
export const routes = createBrowserRouter(
    [
        {
            path:"/",
            element: <h1>hello world</h1>
        },
        {
            path:"/register",
            element:<Register/>
        }
    ]
)