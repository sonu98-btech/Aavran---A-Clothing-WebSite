import axios from "axios";
const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})

export const register = async ({email,contact,password,fullname,isSeller})=>{
    const response = await api.post("/auth/register",{email,contact,password,fullname,isSeller});
    return response.data;
}