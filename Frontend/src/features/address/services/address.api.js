import axios from "axios";

const addressApiInstance = axios.create({
    baseURL: "/api/address",
    withCredentials: true,
})

export const addAddress = async (addressFormData) => {
    const response = await addressApiInstance.post("/add", addressFormData);
    return response.data;
}
export const getAllAddresses = async () => {
    const response = await addressApiInstance.get("/");
    return response.data;
}
export const deleteAddress = async (addressId) => {
    const response = await addressApiInstance.delete(`/delete/${addressId}`);
    return response.data;
}
export const updateAddress = async (addressId, addressFormData) => {
    const response = await addressApiInstance.put(`/update/${addressId}`, addressFormData);
    return response.data;
}
export const makeAddressDefault = async (addressId) => {
    const response = await addressApiInstance.put(`/make-default/${addressId}`);
    return response.data;
}
export const getOneAddress = async (addressId) => {
    const response = await addressApiInstance.get(`/get/${addressId}`);
    return response.data;
}
