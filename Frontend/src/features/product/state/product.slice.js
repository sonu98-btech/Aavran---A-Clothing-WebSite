import {createSlice} from "@reduxjs/toolkit"

const productSlice = createSlice({
    name: "product",
    initialState:{
        sellerProducts:[],
        allProducts:[],
        productDetail:null,
        loading: false,
    },
    reducers:{
        setSellerProducts:(state,action)=>{
            state.sellerProducts = action.payload
        },
        setAllProducts:(state,action)=>{
            state.allProducts = action.payload
       },
       setProductDetail:(state,action)=>{
        state.productDetail = action.payload
       },
       clearProductDetail:(state)=>{
        state.productDetail = null
       },
       setLoading:(state,action)=>{
        state.loading = action.payload
       }
}})

export const {setSellerProducts,setAllProducts,setProductDetail,clearProductDetail,setLoading} = productSlice.actions
export default productSlice.reducer