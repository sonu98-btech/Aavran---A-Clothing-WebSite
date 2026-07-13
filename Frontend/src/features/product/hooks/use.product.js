import { setError } from "../../auth/state/auth.slice";
import { createProduct, getSellerProducts, getAllProducts, getProductDetail, addVariants } from "../services/product.api";
import { setSellerProducts, setAllProducts, setProductDetail, clearProductDetail, setLoading } from "../state/product.slice";
import { useDispatch } from "react-redux";
export const useProduct = () => {
    const dispatch = useDispatch();

    const handleCreateProduct = async (formData) => {
        const data = await createProduct(formData);
        return data.product;
    };
    const handleGetSellerProducts = async () => {
        const data = await getSellerProducts();
        dispatch(setSellerProducts(data.products));
        return data.products;
    }
    const handleGetAllProducts = async () => {
        const data = await getAllProducts();
        dispatch(setAllProducts(data.products));
        return data.products;
    }

    const handleGetProductDetail = async (productId) => {
        try {
            dispatch(setLoading(true))
            dispatch(clearProductDetail())
            const data = await getProductDetail(productId)
            dispatch(setProductDetail(data.productDetail))
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || "error in product fetched"))
            throw err
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleAddVariants = async (productId, formData) => {
        const data = await addVariants(productId, formData)
        return data.variants
    }
    return { handleCreateProduct, handleAddVariants, handleGetSellerProducts, handleGetAllProducts, handleGetProductDetail, };
};