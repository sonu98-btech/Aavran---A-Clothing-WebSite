import {setUser,setError,setLoading} from "../state/auth.slice";
import { register, login } from "../services/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = ()=>{
    const dispatch = useDispatch();

    async function registerHandler({email,contact,password,fullname,isSeller}){
        dispatch(setLoading(true));
        try{
            const data = await register({email,contact,password,fullname,isSeller});
            dispatch(setUser(data.user));
            dispatch(setError(null));
        }catch(error){
            dispatch(setError(error?.response?.data?.message || "Registration failed"));
            throw error;
        }finally{
            dispatch(setLoading(false));
        }
    }

    async function loginHandler({email,password}){
        dispatch(setLoading(true));
        try{
            const data = await login({email,password});
            dispatch(setUser(data.user));
            dispatch(setError(null));
        }catch(error){
            dispatch(setError(error?.response?.data?.message || "Login failed"));
            throw error;
            
        }finally{
            dispatch(setLoading(false));
        }
    }

    return {
        registerHandler,
        loginHandler,
    }

}
