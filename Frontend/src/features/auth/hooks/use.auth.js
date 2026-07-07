import {setUser,setError,setLoading} from "../state/auth.slice";
import { register } from "../services/auth.api";
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
            dispatch(setError(error.response.data.message));
        }finally{
            dispatch(setLoading(false));
        }
    }
    return {
        registerHandler
    }

}