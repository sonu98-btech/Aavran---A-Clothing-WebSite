import React from 'react'
import { useProduct } from '../hooks/use.product'
import { useParams } from 'react-router'
import { useEffect } from 'react'
const ProductDetail = () => {
    const {handleGetProductDetail} = useProduct()
    const {id} = useParams()
    console.log("productId",id)
    useEffect(()=>{
        handleGetProductDetail(id)
    },[])
  return (
    <div>ProductDetail</div>
  )
}

export default ProductDetail