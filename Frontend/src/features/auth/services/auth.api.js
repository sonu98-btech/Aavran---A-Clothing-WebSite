import axios from "axios";
const authInstance = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
})

export const register = async ({email,contact,password,fullname,isSeller})=>{
    const response = await authInstance.post("/register",{email,contact,password,fullname,isSeller});
    return response.data;
}

export const login = async ({email,password})=>{
    const response = await authInstance.post("/login",{email,password});
    return response.data;
}

export const getMe = async()=>{
    const response = await authInstance.get("/")
    return response.data
}