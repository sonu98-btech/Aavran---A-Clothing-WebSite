import axios from "axios"

const cartApiInstance = axios.create({
    baseURL:"/api/cart",
    withCredentials:true
})

export const fetchCart = async () => {
    const response = await cartApiInstance.get("/")
    return response.data
}

export const addCart = async(productId,variantId,quantity)=>{
    const response = await cartApiInstance.post("/",{
        productId,variantId,quantity
    })
    return response.data
}

export const updateCartItem = async(itemId,quantity)=>{
    const response = await cartApiInstance.put("/",{
        itemId,quantity
    })
    return response.data
}

export const removeCartItem = async(itemId)=>{
    const response = await cartApiInstance.delete(`/${itemId}`)
    return response.data
}

export const createCartOrder = async() =>{
    const response = await cartApiInstance.post("/payment/create/order");
    return response.data;
}