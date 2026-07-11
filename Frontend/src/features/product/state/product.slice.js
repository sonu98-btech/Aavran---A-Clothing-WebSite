import {createSlice} from "@reduxjs/toolkit"

const productSlice = createSlice({
    name: "product",
    initialState:{
        sellerProducts:[],
        allProducts:[],
        productDetail:null,

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
       }
}})

export const {setSellerProducts,setAllProducts,setProductDetail,clearProductDetail} = productSlice.actions
export default productSlice.reducer