import React from 'react'
import { useProduct } from '../hooks/use.product'
import { useEffect } from 'react'
const Shop = () => {
  const { handleGetAllProducts } = useProduct()
  useEffect(() => {
    handleGetAllProducts()
  }, [])
  return (
    <div>Shop</div>
  )
}

export default Shop