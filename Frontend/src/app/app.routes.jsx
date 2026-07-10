import {createBrowserRouter} from "react-router"
import Register from "../features/auth/pages/register.jsx"
import Login from "../features/auth/pages/Login.jsx"
import CreateProducts from "../features/product/pages/CreateProducts.jsx"
import Dashboard from "../features/product/pages/Dashboard.jsx"
export const routes = createBrowserRouter(
    [
        {
            path:"/",
            element: <h1>hello world</h1>
        },
        {
            path:"/register",
            element:<Register/>
        },
        {
            path:"/login",
            element:<Login/>
        },
        {
            path:"/seller",
            children:[
                {
                    path:"/seller/create-product",
                    element:<CreateProducts/>
                },
                {
                    path:"/seller/dashboard",
                    element:<Dashboard/>
                }
            ]
        }
    ]
)