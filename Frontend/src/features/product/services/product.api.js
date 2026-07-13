import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
})

export const createProduct = async (formData) => {
    const response = await productApiInstance.post("/", formData)
    return response.data
}
export const getSellerProducts = async () => {
    const response = await productApiInstance.get("/seller")
    return response.data
}

export const getAllProducts = async () => {
    const response = await productApiInstance.get("/")
    return response.data
}

export const getProductDetail = async (productId) => {
    const response = await productApiInstance.get(`/${productId}`)
    return response.data
}
// add product varients 

export const addVarients = async (productId, formData) => {
    const response = await productApiInstance.post(`/${productId}/varients`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data
}