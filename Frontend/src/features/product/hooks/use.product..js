import { createProduct, getSellerProducts } from "../services/product.api";
import { setProducts } from "../state/product.slice";
import { useDispatch } from "react-redux";
export const useProduct = () => {
    const dispatch = useDispatch();

    const handleCreateProduct = async (formData) => {
        const data = await createProduct(formData);
        return data.product;
    };
    const handleGetSellerProducts = async () => {
        const data = await getSellerProducts();
        dispatch(setProducts(data.products));
        return data.products;
    }

    return { handleCreateProduct, handleGetSellerProducts };
};