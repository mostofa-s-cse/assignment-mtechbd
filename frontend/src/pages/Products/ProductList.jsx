import React, { useEffect, useState } from 'react';
import { useProducts } from '../../hooks/useProducts'; // Adjust the path accordingly

const ProductList = () => {
  const { products, fetchProducts, editProduct, toggleProduct, createProduct, deleteProduct } = useProducts();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    weight: '',
  });

  useEffect(() => {
    fetchProducts(); // Fetch products when the component mounts
  }, [fetchProducts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert price and weight to numbers
    const newValue = (name === 'price' || name === 'weight') ? parseFloat(value) : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await editProduct(currentProduct.id, { ...formData });
      setIsEditing(false);
      setCurrentProduct(null);
    } else {
      await createProduct(formData);
    }
    setFormData({ name: '', description: '', price: '', weight: '' }); // Reset form
    fetchProducts(); // Fetch products after creating or editing
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      weight: product.weight,
    });
  };

  const handleToggleClick = async (productId) => {
    await toggleProduct(productId);
    fetchProducts(); // Fetch products after toggling
  };

  const handleDeleteClick = async (productId) => {
    await deleteProduct(productId);
    fetchProducts(); // Fetch products after deleting
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Products</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight"
          value={formData.weight}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          {isEditing ? 'Update Product' : 'Add Product'}
        </button>
      </form>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border">Name</th>
            <th className="border">Description</th>
            <th className="border">Price</th>
            <th className="border">Weight</th>
            <th className="border">Enabled</th>
            <th className="border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.description}</td>
              <td className="border p-2">{product.price}</td>
              <td className="border p-2">{product.weight}</td>
              <td className="border p-2">{product.isEnabled ? 'Yes' : 'No'}</td>
              <td className="border p-2">
                <button
 onClick={() => handleEditClick(product)}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleClick(product.id)}
                  className={`text-${product.isEnabled ? 'red' : 'green'}-500`}
                >
                  {product.isEnabled ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleDeleteClick(product.id)}
                  className="text-red-500 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;