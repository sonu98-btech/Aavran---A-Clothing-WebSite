import { createProduct, getSellerProducts,getAllProducts } from "../services/product.api";
import { setSellerProducts,setAllProducts } from "../state/product.slice";
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
    const handleGetAllProducts = async()=>{
        const data = await getAllProducts();
        dispatch(setAllProducts(data.products));
        return data.products;
    }
    return { handleCreateProduct, handleGetSellerProducts,handleGetAllProducts };
};