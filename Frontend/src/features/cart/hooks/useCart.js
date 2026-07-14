import { setCartItems, setLoading, setError, clearCartItem } from "../state/cart.slice";
import { fetchCart, addCart, updateCartItem, removeCartItem } from "../services/cart.api";
import { useDispatch, useSelector } from "react-redux";

export const useCart = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.cart);
    const handleGetCart = async () => {
        dispatch(setLoading(true));
        try {
            const data = await fetchCart();
            dispatch(setCartItems(data.cart?.items || []));
            dispatch(setError(null));
        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleAddToCart = async (productId, variantId, quantity) => {
        dispatch(setLoading(true));
        try {
            const data = await addCart(productId, variantId, quantity);
            dispatch(setCartItems(data.cart?.items || []));
            dispatch(setError(null));
            return { success: true };
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message;
            dispatch(setError(errMsg));
            return { success: false, message: errMsg };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleUpdateCartItem = async (itemId, quantity) => {
        dispatch(setLoading(true));
        try {
            const data = await updateCartItem(itemId, quantity);
            dispatch(setCartItems(data.cart?.items || []));
            dispatch(setError(null));
            return { success: true };
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message;
            dispatch(setError(errMsg));
            return { success: false, message: errMsg };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleRemoveCartItem = async (itemId) => {
        dispatch(setLoading(true));
        try {
            const data = await removeCartItem(itemId);
            dispatch(setCartItems(data.cart?.items || []));
            dispatch(setError(null));
            return { success: true };
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message;
            dispatch(setError(errMsg));
            return { success: false, message: errMsg };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleClearCart = () => {
        dispatch(clearCartItem());
    };

    return {
        items,
        loading,
        error,
        handleGetCart,
        handleAddToCart,
        handleUpdateCartItem,
        handleRemoveCartItem,
        handleClearCart
    };
};