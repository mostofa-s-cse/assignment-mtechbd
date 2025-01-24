// src/hooks/useProducts.js
import { useDispatch, useSelector } from 'react-redux';
import { productActions } from '../store/reducers/productSlice';
import { authClient } from '../constants/axiosInstance';
import { useCallback } from 'react';

export const useProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await authClient.get('/products');
    //   console.log("response-1", response);
      if (response.status === 200) {
        dispatch(productActions.setProducts(response.data.data)); // Use the 'data' array from the response
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }, [dispatch]);

  const createProduct = async (productData) => {
    try {
      const response = await authClient.post('/products', productData);
      dispatch(productActions.addProduct(response.data)); // Assuming the response contains the created product
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const editProduct = async (productId, updatedData) => {
    try {
      const response = await authClient.put(`/products/${productId}`, updatedData);
      console.log("updatedData",updatedData);
      console.log("response",response);
      dispatch(productActions.updateProduct(response.data)); // Assuming the response contains the updated product
    } catch (error) {
      console.error('Failed to edit product:', error);
    }
  };

  const toggleProduct = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      const response = await authClient.put(`/products/${productId}/isEnabled`, {
        isEnabled: !product.isEnabled,
      });
      dispatch(productActions.updateProduct(response.data)); // Assuming the response contains the updated product
    } catch (error) {
      console.error('Failed to toggle product:', error);
    }
  };
  const deleteProduct = async (productId) => {
    try {
        await authClient.delete(`/products/${productId}`);
        dispatch(productActions.removeProduct(productId)); // Assuming the action removes the product by its ID
    } catch (error) {
        console.error('Failed to delete product:', error);
    }
};

return { products, fetchProducts, createProduct, editProduct, toggleProduct, deleteProduct };

};

