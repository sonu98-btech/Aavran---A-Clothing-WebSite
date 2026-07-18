import { createBrowserRouter } from "react-router"
import Register from "../features/auth/pages/register.jsx"
import Login from "../features/auth/pages/Login.jsx"
import CreateProducts from "../features/product/pages/CreateProducts.jsx"
import Dashboard from "../features/product/pages/Dashboard.jsx"
import Protected from "../features/auth/components/Protected.jsx"
import Home from "../features/product/pages/Home.jsx"
import Shop from "../features/product/pages/Shop.jsx"
import ProductDetail from "../features/product/pages/ProductDetail.jsx"
import SellerProductDetails from "../features/product/pages/SellerProductDetails.jsx"
import Cart from "../features/cart/pages/Cart.jsx"
import Address from "../features/address/pages/Address.jsx"
import CheckOut from "../features/address/pages/CheckOut.jsx"
import OrderSuccess from "../features/address/pages/OrderSuccess.jsx"

export const routes = createBrowserRouter(
    [
        {
            path: "/",
            element: <Login />
        },
        {
            path: "/home",
            element: <Home />
        },
        {
            path: "/register",
            element: <Register />
        },
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/shop",
            element: <Shop />
        },
        {
            path: "/shop/:id",
            element: <ProductDetail />
        },
        {
            path: "/cart",
            element: <Protected role="buyer"><Cart /></Protected>
        },
        {
            path: "/checkout",
            element: <Protected role="buyer"><CheckOut /></Protected>
        },
        {
            path: "/address",
            element: <Protected role="buyer"><Address /></Protected>
        },
        {
            path: "/order/success",
            element: <Protected role="buyer"><OrderSuccess /></Protected>
        },
        {
            path: "/seller",
            children: [
                {
                    path: "/seller/create-product",
                    element:
                        <Protected role="seller">
                            <CreateProducts />
                        </Protected>
                },
                {
                    path: "/seller/dashboard",
                    element:
                        <Protected role="seller"><Dashboard /></Protected>
                },
                {
                    path: "/seller/product/:id",
                    element:
                        <Protected role="seller">
                            <SellerProductDetails />
                        </Protected>
                }
        
            ]
        }
    ]
)